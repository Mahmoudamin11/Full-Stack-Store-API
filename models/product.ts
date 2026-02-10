import { model, Schema } from "mongoose";

export interface ProductDocument extends Document {
  name: string | RegExp;
  company: string;
  featured: boolean;
  rating: number;
  createdAt: Date;
  price: number;
}

const productSchema = new Schema<ProductDocument>({
  name: {
    type: String,
    required: [true, "Product Name must be provided"],
  },
  price: {
    type: Number,
    required: [true, "Product Price must be provided"],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  company: {
    type: String,
    enum: {
      values: ["ikea", "liddy", "caressa", "marcos"],
      message: "{VALUE} is not supported",
    },
  },
});


export default model<ProductDocument>("Product", productSchema)