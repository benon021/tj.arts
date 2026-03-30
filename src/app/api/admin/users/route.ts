import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// GET: List all users (excluding system users)
export async function GET(req: NextRequest) {
  try {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()
    if (error) throw error

    // Fetch profile data for these users
    const { data: profiles, error: pError } = await supabaseAdmin
      .from('profiles')
      .select('*')

    if (pError) throw pError

    // Merge auth data with profile data
    const mergedUsers = users.map(user => ({
      ...user,
      profile: profiles.find(p => p.id === user.id) || null
    }))

    return NextResponse.json(mergedUsers)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST: Update a user's details
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, email, password, isAdmin, fullName } = body

    if (!userId) return NextResponse.json({ error: 'User ID is required' }, { status: 400 })

    const updates: any = {}
    if (email) updates.email = email
    if (password) updates.password = password

    // Update Auth Data
    if (Object.keys(updates).length > 0) {
      const { error: aError } = await supabaseAdmin.auth.admin.updateUserById(userId, updates)
      if (aError) throw aError
    }

    // Update Profile Data
    const { error: pError } = await supabaseAdmin
      .from('profiles')
      .update({ is_admin: isAdmin, full_name: fullName })
      .eq('id', userId)

    if (pError) throw pError

    return NextResponse.json({ success: true, message: 'User updated successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
