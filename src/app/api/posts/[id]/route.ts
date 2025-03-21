import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper to verify admin token
const verifyToken = async (token: string | undefined) => {
  if (!token) return false;
  try {
    verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
};

// GET single post
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("arionmall");
    
    const post = await db.collection("posts").findOne({
      _id: new ObjectId(params.id)
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT update post (protected)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = cookies().get('admin_token')?.value;
    const isAdmin = await verifyToken(token);
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("arionmall");
    
    // Update the post
    const result = await db.collection("posts").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: {
        ...body,
        updatedAt: new Date().toISOString()
      }}
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE post (protected)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = cookies().get('admin_token')?.value;
    const isAdmin = await verifyToken(token);
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db("arionmall");
    
    const result = await db.collection("posts").deleteOne({
      _id: new ObjectId(params.id)
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
