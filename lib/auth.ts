import bcrypt from 'bcryptjs'
import { eq, or } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users, userProfiles, userSessions, userActivityLog, type User, type UserProfile, type UserSession } from '@/lib/db/schema'
import { v4 as uuidv4 } from 'uuid'

export interface AuthUser {
  id: string
  email: string
  role: string | null
  profile?: UserProfile | null
}

export interface LoginCredentials {
  phone: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName?: string
  lastName?: string
  phone?: string
  department?: string
  municipality?: string
}

export class AuthService {
  // Hash password
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  // Verify password
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  // Generate session token
  static generateSessionToken(): string {
    return uuidv4()
  }

  // Create user session
  static async createSession(userId: string, ipAddress?: string, userAgent?: string): Promise<UserSession> {
    const token = this.generateSessionToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30) // 30 days

    const [session] = await db.insert(userSessions)
      .values({
        userId,
        token,
        expiresAt,
        ipAddress,
        userAgent,
      })
      .returning()

    return session
  }

  // Log user activity
  static async logActivity(userId: string, action: string, metadata?: any, ipAddress?: string, userAgent?: string) {
    await db.insert(userActivityLog).values({
      userId,
      action,
      metadata: metadata ? JSON.stringify(metadata) : null,
      ipAddress,
      userAgent,
    })
  }

  // Register new user
  static async register(data: RegisterData, ipAddress?: string, userAgent?: string): Promise<AuthUser> {
    const existingUser = await db.select().from(users).where(
      or(eq(users.email, data.email), eq(users.phone, data.phone))
    ).limit(1)
    
    if (existingUser.length > 0) {
      throw new Error('User already exists')
    }

    const passwordHash = await this.hashPassword(data.password)

    // Create user
    const [user] = await db.insert(users)
      .values({
        email: data.email,
        phone: data.phone, // Guardar teléfono también en users
        passwordHash,
        emailVerified: false,
        isActive: true,
        role: 'user',
      })
      .returning()

    // Create user profile
    if (data.firstName || data.lastName || data.phone || data.department || data.municipality) {
      await db.insert(userProfiles).values({
        userId: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        department: data.department,
        municipality: data.municipality,
      })
    }

    // Log registration
    await this.logActivity(user.id, 'register', { email: data.email }, ipAddress, userAgent)

    // Get user with profile
    const authUser = await this.getUserById(user.id)
    
    if (!authUser) {
      throw new Error('Failed to create user')
    }

    return authUser
  }

  // Login user
  static async login(credentials: LoginCredentials, ipAddress?: string, userAgent?: string): Promise<{ user: AuthUser; session: UserSession }> {
    const [user] = await db.select({
      id: users.id,
      email: users.email,
      phone: users.phone,
      passwordHash: users.passwordHash,
      emailVerified: users.emailVerified,
      isActive: users.isActive,
      role: users.role,
      lastLoginAt: users.lastLoginAt,
    }).from(users).where(eq(users.phone, credentials.phone)).limit(1)

    if (!user) {
      throw new Error('Invalid credentials')
    }

    if (!user.isActive) {
      throw new Error('Account is disabled')
    }

    const isValidPassword = await this.verifyPassword(credentials.password, user.passwordHash)
    
    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }

    // Update last login
    await db.update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id))

    // Create session
    const session = await this.createSession(user.id, ipAddress, userAgent)

    // Log login
    await this.logActivity(user.id, 'login', { sessionId: session.id }, ipAddress, userAgent)

    // Get user with profile
    const authUser = await this.getUserById(user.id)

    if (!authUser) {
      throw new Error('Failed to get user data')
    }

    return { user: authUser, session }
  }

  // Logout user
  static async logout(sessionToken: string, ipAddress?: string, userAgent?: string): Promise<void> {
    const [session] = await db.select()
      .from(userSessions)
      .where(eq(userSessions.token, sessionToken))
      .limit(1)

    if (session) {
      // Deactivate session
      await db.update(userSessions)
        .set({ isActive: false })
        .where(eq(userSessions.id, session.id))

      // Log logout
      await this.logActivity(session.userId, 'logout', { sessionId: session.id }, ipAddress, userAgent)
    }
  }

  // Get user by ID
  static async getUserById(id: string): Promise<AuthUser | null> {
    const [user] = await db.select({
      id: users.id,
      email: users.email,
      phone: users.phone,
      role: users.role,
    }).from(users).where(eq(users.id, id)).limit(1)

    if (!user) {
      return null
    }

    // Get user profile
    const [profile] = await db.select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, user.id))
      .limit(1)

    return {
      ...user,
      profile: profile || null,
    }
  }

  // Get user by session token
  static async getUserBySessionToken(token: string): Promise<AuthUser | null> {
    const [session] = await db.select()
      .from(userSessions)
      .where(eq(userSessions.token, token))
      .limit(1)

    if (!session || !session.isActive || session.expiresAt < new Date()) {
      return null
    }

    return this.getUserById(session.userId)
  }

  // Update user profile
  static async updateProfile(userId: string, data: Partial<UserProfile>, ipAddress?: string, userAgent?: string): Promise<UserProfile> {
    const [profile] = await db.update(userProfiles)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, userId))
      .returning()

    if (!profile) {
      // Create profile if it doesn't exist
      const [newProfile] = await db.insert(userProfiles)
        .values({
          userId,
          ...data,
        })
        .returning()

      // Log profile creation
      await this.logActivity(userId, 'profile_created', data, ipAddress, userAgent)

      return newProfile
    }

    // Log profile update
    await this.logActivity(userId, 'profile_updated', data, ipAddress, userAgent)

    return profile
  }

  // Change password
  static async changePassword(userId: string, currentPassword: string, newPassword: string, ipAddress?: string, userAgent?: string): Promise<void> {
    const [user] = await db.select({
      id: users.id,
      passwordHash: users.passwordHash,
    }).from(users).where(eq(users.id, userId)).limit(1)

    if (!user) {
      throw new Error('User not found')
    }

    const isValidPassword = await this.verifyPassword(currentPassword, user.passwordHash)
    
    if (!isValidPassword) {
      throw new Error('Current password is incorrect')
    }

    const newPasswordHash = await this.hashPassword(newPassword)

    await db.update(users)
      .set({ 
        passwordHash: newPasswordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))

    // Log password change
    await this.logActivity(userId, 'password_changed', null, ipAddress, userAgent)
  }

  // Request password reset
  static async requestPasswordReset(email: string, ipAddress?: string, userAgent?: string): Promise<void> {
    const [user] = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (!user) {
      // Don't reveal that user doesn't exist
      return
    }

    const resetToken = uuidv4()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // 1 hour

    await db.update(users)
      .set({
        passwordResetToken: resetToken,
        passwordResetExpires: expiresAt,
      })
      .where(eq(users.id, user.id))

    // Log password reset request
    await this.logActivity(user.id, 'password_reset_requested', { email }, ipAddress, userAgent)

    // TODO: Send email with reset token
    console.log(`Password reset token for ${email}: ${resetToken}`)
  }

  // Reset password
  static async resetPassword(token: string, newPassword: string, ipAddress?: string, userAgent?: string): Promise<void> {
    const [user] = await db.select()
      .from(users)
      .where(eq(users.passwordResetToken, token))
      .limit(1)

    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new Error('Invalid or expired reset token')
    }

    const newPasswordHash = await this.hashPassword(newPassword)

    await db.update(users)
      .set({
        passwordHash: newPasswordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))

    // Log password reset
    await this.logActivity(user.id, 'password_reset', null, ipAddress, userAgent)
  }

  // Clean up expired sessions
  static async cleanupExpiredSessions(): Promise<void> {
    await db.delete(userSessions)
      .where(eq(userSessions.expiresAt, new Date()))
  }
}
