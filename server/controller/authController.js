import Joi from 'joi';
import CustomErrorHandler from '../services/CustomErrorHandler.js';
import { User } from '../models/index.js';
import bcrypt from 'bcrypt';
import JwtService from '../services/JwtService.js';

const authController = {
    async register(req, res, next) {
        const registerSchema = Joi.object({
            name: Joi.string().pattern(new RegExp('^[a-zA-Z ]{3,30}$')).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: Joi.ref('password')
        });
        const { error } = registerSchema.validate(req.body);

        if (error) {
            return next(CustomErrorHandler.validationError());
        }

        try {
            const exist = await User.exists({ email: req.body.email });
            if (exist) {
                return next(CustomErrorHandler.alreadyExist('This email is already taken.'))
            }
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }

        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        let access_token;
        try {
            const result = await user.save();
            access_token = JwtService.sign({ _id: result._id, role: result.role });
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }

        res.json({ access_token });
    },

    async login(req, res, next) {
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: Joi.ref('password')
        });

        const { error } = loginSchema.validate(req.body);

        if (error) {
            return next(CustomErrorHandler.validationError());
        }

        try {
            const user = await User.findOne({ email: req.body.email });

            if (!user) {
                return next(CustomErrorHandler.wrongCredentials());
            }

            const match = await bcrypt.compare(req.body.password, user.password);

            if (!match) {
                return next(CustomErrorHandler.wrongCredentials());
            }

            const access_token = JwtService.sign({ _id: user._id, role: user.role });

            res.json({ access_token });

        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
    }
}
export default authController;