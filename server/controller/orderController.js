import { User } from "../models/index.js";
import Joi from "joi";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import { Order } from "../models/index.js";

const orderController = {
    async createOrder(req, res, next) {
        let user;
        try {
            user = await User.findOne({ _id: req.user._id });
            if (!user) {
                return next(CustomErrorHandler.notFound());
            }
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }

        const orderSchema = Joi.object({
            _id: Joi.string().required(),
            name: Joi.string().required(),
            price: Joi.number().required(),
            image: Joi.string().required(),
        });

        const { error } = orderSchema.validate(req.body);

        if (error) {
            return next(CustomErrorHandler.validationError());
        }

        const { _id, name, price, image } = req.body;

        let document = new Order({
            userId: user._id,
            productId: _id,
            name: name,
            price: price,
            image: image,
        });

        try {
            await document.save();
        } catch (err) {
            return next(err);
        }

        res.json({ "message": "Order Success." });
    },
};
export default orderController;
