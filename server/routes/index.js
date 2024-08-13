import express from 'express';
import { authController, orderController, productController } from '../controller/index.js';
import auth from '../middlewares/auth.js';
import admin from '../middlewares/admin.js';

const router = express.Router();

// Auth Routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Products Routes
router.post('/products', [auth, admin], productController.create);
router.put('/products/:id', [auth, admin], productController.update);
router.delete('/products/:id', [auth, admin], productController.destroy);
router.get('/products', productController.show);

// Order Routes
router.post('/order', auth, orderController.createOrder);

export default router;