import multer from "multer";
import path from "path";
import fs from "fs";
import appRoot from 'app-root-path';
import { Product } from "../models/index.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import productSchema from "../validators/productValidator.js";

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, "uploads/"),
    filename: (_req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${path.extname(file.originalname)}`;

        cb(null, uniqueName);
    },
});
const handleMultipartData = multer({
    storage,
    limits: { fileSize: 1000000 * 5 },
}).single("image");

const productController = {
    async create(req, res, next) {
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }

            const filePath = req.file.path;
            const correctedPath = filePath.replace(/\\/g, "/");

            const { error } = productSchema.validate(req.body);
            if (error) {
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    if (err) {
                        return next(CustomErrorHandler.serverError(err.message));
                    }
                });
                return next(CustomErrorHandler.validationError());
            }

            const {
                name,
                price,
                description,
                processor,
                memory,
                camera,
                display,
                storage,
            } = req.body;

            let document;
            try {
                document = await Product.create({
                    name,
                    price,
                    description,
                    processor,
                    memory,
                    camera,
                    display,
                    storage,
                    image: correctedPath,
                });
            } catch (err) {
                return next(CustomErrorHandler.serverError());
            }
            res.status(201).json(document);
        });
    },

    update(req, res, next) {
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }

            let correctedPath;
            if (req.file) {
                let filePath = req.file.path;
                correctedPath = filePath.replace(/\\/g, "/");
            }

            const { error } = productSchema.validate(req.body);
            if (error) {
                if (req.file) {
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        if (err) {
                            return next(CustomErrorHandler.serverError(err.message));
                        }
                    });
                }
                return next(CustomErrorHandler.validationError());
            }
            const {
                name,
                price,
                description,
                processor,
                memory,
                camera,
                display,
                storage,
            } = req.body;

            let document;
            try {
                document = await Product.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        name,
                        price,
                        description,
                        processor,
                        memory,
                        camera,
                        display,
                        storage,
                        ...(req.file && { image: correctedPath }),
                    },
                    { new: true }
                );
            } catch (err) {
                return next(CustomErrorHandler.serverError());
            }
            res.status(201).json(document);
        });
    },

    async destroy(req, res, next) {
        const document = await Product.findOneAndDelete({ _id: req.params.id });
        if (!document) {
            return next(new Error("Nothing to delete"));
        }

        const imagePath = document._doc.image;
        fs.unlink(`${appRoot}/${imagePath}`, (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError());
            }
        });
        res.json(document);
    },

    async show(_req, res, next) {
        let documents;
        try {
            documents = await Product.find().select("-updatedAt -__v");
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }

        return res.json(documents);
    },
};
export default productController;