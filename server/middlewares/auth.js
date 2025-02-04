import CustomErrorHandler from "../services/CustomErrorHandler.js";
import JwtService from "../services/JwtService.js";

const auth = (req, _res, next) => {
    let authHeader = req.headers.authorization;
    if (!authHeader) {
        return next(CustomErrorHandler.unAuthorized());
    }
    const token = authHeader.split(' ')[1];

    try {
        const { _id, role } = JwtService.verify(token);
        const user = {
            _id,
            role
        }
        req.user = user;
        next();
    } catch (err) {
        return next(CustomErrorHandler.unAuthorized());
    }

}
export default auth;