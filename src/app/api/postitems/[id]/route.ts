import dbConnect from '../../../../../config/db';
import PostItem from '../../../../../models/PostItem';
import { NextResponse } from 'next/server';

dbConnect();

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const postItem = await PostItem.findById(params.id).select('-__v');
    
    if (!postItem) {
      return NextResponse.json({ message: 'No Item Found For This ID' }, { status: 404 });
    }
    
    return NextResponse.json(postItem);
  } catch (error) {
    console.error('Error fetching post item:', error);
    return NextResponse.json({ 
      message: 'Failed to fetch item', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// UPDATE - Untuk memperbarui item yang sudah ada
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { id } = params;

    // Cek apakah item ada
    const existingItem = await PostItem.findById(id);
    if (!existingItem) {
      return NextResponse.json({ message: 'Item not found' }, { status: 404 });
    }

    // Update item dengan data baru
    const updatedItem = await PostItem.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    console.log('Item updated successfully:', updatedItem);
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating post item:', error);
    return NextResponse.json({ 
      message: 'Failed to update item', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// PATCH - Untuk update sebagian dari item
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { id } = params;

    // Cek apakah item ada
    const existingItem = await PostItem.findById(id);
    if (!existingItem) {
      return NextResponse.json({ message: 'Item not found' }, { status: 404 });
    }

    // Update hanya field yang diberikan
    const updatedItem = await PostItem.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    console.log('Item partially updated successfully:', updatedItem);
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating post item:', error);
    return NextResponse.json({ 
      message: 'Failed to update item', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// DELETE - Untuk menghapus item
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Cek apakah item ada
    const existingItem = await PostItem.findById(id);
    if (!existingItem) {
      return NextResponse.json({ message: 'Item not found' }, { status: 404 });
    }

    // Hapus item
    const deletedItem = await PostItem.findByIdAndDelete(id);
    console.log('Item deleted successfully:', deletedItem);
    
    return NextResponse.json({ 
      message: 'Item deleted successfully', 
      deleted: true, 
      item: deletedItem 
    });
  } catch (error) {
    console.error('Error deleting post item:', error);
    return NextResponse.json({ 
      message: 'Failed to delete item', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
