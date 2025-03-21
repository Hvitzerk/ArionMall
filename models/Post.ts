import mongoose, { Document, Model } from 'mongoose';

// Define interface for Post document
interface IPost {
  title: string;
  content: string;
  brief: string;
  category: string;
  author: string;
  img: string;
  date: Date;
  featured: boolean;
}

// Define interface for Post model
interface PostModel extends Model<IPost> {}

// Define interface for Post document with Mongoose Document
interface PostDocument extends IPost, Document {}

// Define schema
const postSchema = new mongoose.Schema<PostDocument, PostModel>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    brief: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: String, required: true },
    img: { type: String, required: true },
    date: { type: Date, default: Date.now },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Create or get model
const Post: PostModel =
  mongoose.models.Post ||
  mongoose.model<PostDocument, PostModel>('Post', postSchema);

export default Post;
