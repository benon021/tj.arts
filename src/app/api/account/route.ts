import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Verify the user's token
    const token = authHeader.replace('Bearer ', '')
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const body = await request.json()
    const { username } = body

    if (!username || typeof username !== 'string' || username.trim().length < 2) {
      return NextResponse.json({ error: 'Username must be at least 2 characters' }, { status: 400 })
    }

    // Update the profile using admin client (bypasses RLS)
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ username: username.trim() })
      .eq('id', user.id)

    if (updateError) {
      // If the profiles table doesn't have a username column, try to add it
      if (updateError.message.includes('username')) {
        return NextResponse.json(
          { error: 'Profile schema needs a "username" column. Please add it in Supabase.' },
          { status: 500 }
        )
      }
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, username: username.trim() })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // Fetch profile data
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('username, is_admin')
      .eq('id', user.id)
      .single()

    // If no profile exists yet, return default data instead of 500
    if (profileError && profileError.code === 'PGRST116') {
      return NextResponse.json({
        id: user.id,
        email: user.email,
        username: '',
        is_admin: false,
        created_at: user.created_at,
      })
    }

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      username: profile?.username || '',
      is_admin: profile?.is_admin || false,
      created_at: user.created_at,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
