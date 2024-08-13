import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const orderSchema = new Schema({

    userId: { type: String, required: true },
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }

}, { timestamps: true });

export default mongoose.model('Order', orderSchema, 'orders');