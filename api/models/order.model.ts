import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // relation to product
  quantity: { type: Number, default: 1 }
});

export default mongoose.model('Order', orderSchema);