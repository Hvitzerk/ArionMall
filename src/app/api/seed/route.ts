import { NextResponse } from 'next/server';
import dbConnect from '../../../../config/db';
import Post from '../../../../models/Post';
import PostItem from '../../../../models/PostItem';

export async function GET() {
  try {
    // Connect to the database
    await dbConnect();
    
    // Check if we already have data
    const postCount = await Post.countDocuments();
    const postItemCount = await PostItem.countDocuments();
    
    if (postCount > 0 || postItemCount > 0) {
      return NextResponse.json({
        message: 'Database already has data. Seed skipped to prevent duplicates.',
        posts: postCount,
        postItems: postItemCount
      });
    }
    
    // Sample data for Posts
    const posts = [
      {
        title: 'Grand Opening Arion Mall',
        content: 'Arion Mall akan resmi dibuka pada tanggal 1 April 2025. Berbagai acara dan promosi telah disiapkan untuk menyambut pengunjung.',
        brief: 'Arion Mall akan resmi dibuka pada tanggal 1 April 2025.',
        category: 'News',
        author: 'Admin',
        img: '/assets/img/mall-exterior.jpg',
        date: new Date(),
        featured: true
      },
      {
        title: 'Promo Besar-Besaran di Semua Tenant',
        content: 'Dalam rangka pembukaan Arion Mall, semua tenant akan memberikan diskon hingga 50% untuk berbagai produk. Jangan lewatkan kesempatan ini!',
        brief: 'Semua tenant memberikan diskon hingga 50% dalam rangka pembukaan mall.',
        category: 'Promotion',
        author: 'Admin',
        img: '/assets/img/sale.jpg',
        date: new Date(),
        featured: false
      }
    ];
    
    // Sample data for PostItems
    const postItems = [
      {
        title: 'Captain America: Brave New World',
        category: 'Movies',
        date: new Date(),
        brief: 'Film terbaru dari MCU yang akan tayang di XXI Arion Mall',
        author: 'Admin',
        img: '/images/captain-america.jpg',
        top: true,
        whatsNew: true,
        showInMiddle: false,
        order: 1
      },
      {
        title: 'SPESIAL DISKON 20% SEMUA MENU NASI GORENG!',
        category: 'Food',
        date: new Date(),
        brief: 'Diskon spesial dari Food Court Arion Mall',
        author: 'Admin',
        img: '/images/food-discount.jpg',
        top: false,
        whatsNew: true,
        showInMiddle: true,
        order: 2
      },
      {
        title: 'Pilihan film yang tayang hari ini di XXI',
        category: 'Movies',
        date: new Date(),
        brief: 'Jadwal film terbaru di XXI Arion Mall',
        author: 'Admin',
        img: '/images/movie-selection.jpg',
        top: false,
        whatsNew: false,
        showInMiddle: true,
        order: 3
      }
    ];
    
    // Insert the sample data
    await Post.insertMany(posts);
    await PostItem.insertMany(postItems);
    
    return NextResponse.json({
      message: 'Database seeded successfully',
      postsInserted: posts.length,
      postItemsInserted: postItems.length
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
