import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  try {
    // Parse the JSON body from the request
    const { role, userId }: { role: string; userId: string } = await req.json()

    // Get the Clerk client instance
    const client = await clerkClient()

    // Update user metadata in Clerk
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role,
      },
    })

    // Return a success response
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: 'Failed to update user metadata' }, { status: 500 })
  }
}
