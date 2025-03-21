import { NextResponse } from 'next/server';
import dbConnect from '../../../../config/db';
import PostItem from '../../../../models/PostItem';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    console.log('Search API received query:', query);

    if (!query) {
      console.log('Empty query, returning empty results');
      return NextResponse.json({ data: [] });
    }

    await dbConnect();
    console.log('Database connected');

    // Buat regex case-insensitive untuk pencarian
    const searchRegex = new RegExp(query, 'i');
    console.log('Searching with regex:', searchRegex);

    // Cari berdasarkan judul atau kategori
    const results = await PostItem.find({
      $or: [
        { title: searchRegex },
        { category: searchRegex }
      ]
    })
    .select('title category img brief')
    .limit(10);

    console.log(`Found ${results.length} results for "${query}"`);

    // Format hasil pencarian
    const formattedResults = results.map(item => {
      // Pastikan URL gambar valid
      let imageUrl = item.img;
      
      // Tangani protocol-relative URL
      if (imageUrl.startsWith('//')) {
        imageUrl = `https:${imageUrl}`;
      }
      // Tangani URL relatif tanpa slash di depan
      else if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
        imageUrl = `/${imageUrl}`;
      }

      return {
        _id: item._id,
        title: item.title,
        category: item.category,
        image: imageUrl,
        brief: item.brief,
        slug: item._id.toString()
      };
    });

    console.log('Returning formatted results');
    return NextResponse.json({ data: formattedResults });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat mencari' },
      { status: 500 }
    );
  }
} 