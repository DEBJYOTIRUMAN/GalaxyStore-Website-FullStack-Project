import { User } from "../models/index.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";

const admin = async (req, _res, next) => {
    try {
        const user = await User.findOne({ _id: req.user._id });

        if (user.role === 'admin') {
            next();
        } else {
            return next(CustomErrorHandler.unAuthorized());
        }
    } catch (err) {
        return next(CustomErrorHandler.serverError());
    }
}
export default admin;