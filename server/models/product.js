import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true },
        processor: { type: String, required: true },
        memory: { type: String, required: true },
        camera: { type: String, required: true },
        display: { type: String, required: true },
        storage: { type: String, required: true },
        image: {
            type: String,
            required: true,
            get: (image) => {
                return `${process.env.APP_URL}/${image}`;
            }
        },
    },
    { timestamps: true, toJSON: { getters: true }, id: false }
);

export default mongoose.model('Product', productSchema, 'products');
