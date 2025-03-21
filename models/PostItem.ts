import mongoose, { Document, Model } from 'mongoose';

// Definisikan interface untuk dokumen PostItem
interface IPostItem {
  img: string;
  category: string;
  date: Date;
  title: string;
  brief: string | null;
  avatar: string | null;
  author: string | null;
  top: boolean;
  whatsNew: boolean;
  showInMiddle: boolean;
  order: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PostItemModel extends Model<IPostItem> {}

// Definisikan interface untuk dokumen PostItem yang menggabungkan Document dari Mongoose
interface PostItemDocument extends IPostItem, Document {}

// Definisikan schema
const postItemSchema = new mongoose.Schema<PostItemDocument, PostItemModel>(
  {
    img: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
    title: { type: String, required: true },
    brief: { type: String, default: null },
    avatar: { type: String, default: null },
    author: { type: String, default: null },
    top: { type: Boolean, default: false },
    whatsNew: { type: Boolean, default: false },
    showInMiddle: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Buat atau ambil model
const PostItem: PostItemModel =
  mongoose.models.PostItem ||
  mongoose.model<PostItemDocument, PostItemModel>('PostItem', postItemSchema);

export default PostItem;
