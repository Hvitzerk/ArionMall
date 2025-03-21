import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import dbConnect from '../../../../../config/db';

// Simplified API that doesn't require authentication for dashboard data
// This is a workaround to avoid the cookies API issue
export async function GET() {
  try {
    console.log("Dashboard API: Fetching posts data...");
    
    // Connect to database using both methods for redundancy
    await dbConnect();
    const client = await clientPromise;
    const db = client.db("arionmall");
    
    // Get posts from MongoDB
    const posts = await db.collection("posts").find({}).toArray();
    
    // Get post items from MongoDB
    const postItems = await db.collection("postitems").find({}).toArray();
    
    // Log success
    console.log(`Dashboard API: Successfully fetched ${posts.length} posts and ${postItems.length} post items`);
    
    // Return combined data with cache control headers
    return NextResponse.json(
      { 
        posts,
        postItems,
        timestamp: new Date().toISOString(),
        count: {
          posts: posts.length,
          postItems: postItems.length
        }
      }, 
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store'
        }
      }
    );
  } catch (error) {
    console.error('Dashboard API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch dashboard data', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
