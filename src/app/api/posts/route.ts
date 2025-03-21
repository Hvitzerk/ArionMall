import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';
import dbConnect from '../../../../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper to verify admin token (synchronous version)
const verifyToken = (token: string | undefined) => {
  if (!token) return false;
  try {
    verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
};

// GET all posts
export async function GET() {
  try {
    // Ensure DB is connected
    await dbConnect();
    
    // Try using MongoDB client directly
    const client = await clientPromise;
    const db = client.db("arionmall");
    const posts = await db.collection("posts").find({}).toArray();
    
    // Add timestamp to prevent caching issues
    const timestamp = new Date().getTime();
    
    // Log for debugging
    console.log(`[${timestamp}] Successfully fetched ${posts.length} posts`);
    
    return NextResponse.json(posts, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST new post (protected)
export async function POST(request: Request) {
  try {
    // Ensure DB is connected
    await dbConnect();
    
    // Use the correct way to access cookies in Next.js App Router
    const cookieList = cookies();
    const token = cookieList.get('admin_token')?.value;
    
    // Simple verification without async
    if (!verifyToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("arionmall");
    
    // Add creation date
    const post = {
      ...body,
      date: new Date().toISOString(),
    };
    
    const result = await db.collection("posts").insertOne(post);
    console.log('Post created successfully:', result.insertedId);
    
    return NextResponse.json({
      _id: result.insertedId,
      ...post
    }, {
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error('Failed to create post:', error);
    return NextResponse.json(
      { error: 'Failed to create post', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
