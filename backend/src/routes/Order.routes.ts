import { Router } from 'express';
import OrderController from '../controllers/Order.controller';
import AuthMiddleware from '../middleware/Authorization';

const router = Router();

router.get('/analytics', AuthMiddleware.authorizeAdmin, OrderController.getOrderAnalytics); // Get order analytics
router.get('/user', AuthMiddleware.authorizeUser, OrderController.getOrdersByUserId); // Get orders by user id
router.get('/user/paid', AuthMiddleware.authorizeUser, OrderController.getPaidOrdersByUserId); // Get user's paid orders
router.get('/user/unpaid', AuthMiddleware.authorizeUser, OrderController.getUnpaidOrderByUserId); // Get user's unpaid orders
router.post('/checkout', AuthMiddleware.authorizeUser, OrderController.checkoutOrder); // Checkout user's order
router.get('/', AuthMiddleware.authorizeAdmin, OrderController.getAllOrders); // Get all orders
router.get('/paid', AuthMiddleware.authorizeAdmin, OrderController.getPaidOrders); // Get paid orders
router.get('/unpaid', AuthMiddleware.authorizeAdmin, OrderController.getUnpaidOrders); // Get unpaid orders
router.get('/deleted', AuthMiddleware.authorizeAdmin, OrderController.getDeletedOrders); // Get deleted orders
router.post('/', AuthMiddleware.authorizeUser, OrderController.createOrder); // Create order
router.get('/:id', AuthMiddleware.authorizeUser, OrderController.getOrderById); // Get order by id
router.put('/:id', AuthMiddleware.authorizeUser, OrderController.updateOrder); // Update order
router.delete('/:id', AuthMiddleware.authorizeUser, OrderController.deleteOrder); // Delete order

export default router;
