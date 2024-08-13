import Joi from 'joi';
const productSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
    processor: Joi.string().required(),
    memory: Joi.string().required(),
    camera: Joi.string().required(),
    display: Joi.string().required(),
    storage: Joi.string().required(),
    image: Joi.string(),
});
export default productSchema;