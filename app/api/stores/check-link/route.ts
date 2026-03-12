import { NextRequest, NextResponse } from 'next/server'

// GET /api/stores/check-link?link=storename - Check if store link is available
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const link = searchParams.get('link')

    if (!link) {
      return NextResponse.json({ error: 'Link parameter is required' }, { status: 400 })
    }

    // Validate link format
    if (!/^[a-z0-9-]{3,30}$/.test(link)) {
      return NextResponse.json({ error: 'Invalid link format' }, { status: 400 })
    }

    // Mock check for now - TODO: Implement real database query
    const isAvailable = !['admin', 'api', 'www', 'store', 'shop'].includes(link)

    if (!isAvailable) {
      return NextResponse.json({ error: 'Store link already taken' }, { status: 400 })
    }

    return NextResponse.json({ available: true })
  } catch (error) {
    console.error('Error checking store link:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
