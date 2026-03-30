import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

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

    // Check if the user is an admin
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.is_admin || false

    let query = supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false })

    // If not admin, only fetch their own orders
    if (!isAdmin) {
      query = query.eq('user_id', user.id)
    }

    const { data: orders, error: ordersError } = await query

    if (ordersError) {
      // Handle missing table gracefully
      if (ordersError.message.includes('does not exist')) {
        return NextResponse.json({ 
          error: 'Orders table not found. Please run the migration SQL from the implementation plan.',
          orders: [],
          stats: { total: 0, pending: 0, in_progress: 0, completed: 0 }
        })
      }
      return NextResponse.json({ error: ordersError.message }, { status: 500 })
    }

    // Calculate stats
    const stats = {
      total: orders?.length || 0,
      pending: orders?.filter(o => o.status === 'pending').length || 0,
      in_progress: orders?.filter(o => o.status === 'in_progress').length || 0,
      completed: orders?.filter(o => o.status === 'completed').length || 0,
    }

    return NextResponse.json({ orders, stats })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { templateId, title, phoneNumber, price, depositPaid } = body

    const { data: order, error: insertError } = await supabaseAdmin
      .from('orders')
      .insert([
        {
          user_id: user.id,
          template_id: templateId,
          title: title,
          phone_number: phoneNumber,
          price: price || 3500,
          deposit_paid: depositPaid || 1750,
          status: 'pending'
        }
      ])
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, order })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
