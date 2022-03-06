import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // auto generating ids
  name: { type: String, required: true },
  price: { type: Number, required: true },
  productImage: { type: String, required: true },
});


export default mongoose.model('Product', productSchema);