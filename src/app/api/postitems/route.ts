import dbConnect from '../../../../config/db';
import PostItem from '../../../../models/PostItem';

// Hubungkan ke database
dbConnect().catch(error => {
  console.error('Database connection error:', error);
});

export async function GET() {
  try {
    const postItems = await PostItem.find().select('-__v');
    return Response.json(postItems);
  } catch (error) {
    console.error('Error fetching post items:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch data' }), {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    // Parse body request sebagai JSON
    const postItem = await request.json();
    console.log('Received data:', postItem); // Log data yang diterima

    // Simpan data ke database
    const savedItem = await new PostItem(postItem).save();
    console.log('Data saved:', savedItem); // Log data yang disimpan

    // Kirim respons sukses
    return new Response(JSON.stringify(savedItem), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 201,
    });
  } catch (error) {
    console.error('Error saving data:', error); // Log error yang terjadi

    // Kirim respons error dengan detail
    return new Response(
      JSON.stringify({
        message: 'Failed to save data',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
      }
    );
  }
}
