import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          updated_at?: string | null
        }
      }
      waitlist: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
    }
    Views: {
      waitlist_stats: {
        Row: {
          total_subscribers: number
          subscription_date: string
          today_subscribers: number
        }
      }
    }
  }
}
