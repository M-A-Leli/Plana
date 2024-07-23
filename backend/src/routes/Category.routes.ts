import { Router } from 'express';
import CategoryController from '../controllers/Category.controller';
import AuthMiddleware from '../middleware/Authorization';

const router = Router();

router.get('/analytics',  AuthMiddleware.authorizeAdmin, CategoryController.getCategoryAnalytics); // Get category analytics
router.get('/active', CategoryController.getActiveCategories); // Get deleted categories
router.get('/deleted',  AuthMiddleware.authorizeAdmin, CategoryController.getDeletedCategories); // Get deleted categories
router.get('/', AuthMiddleware.authorizeAdmin, CategoryController.getAllCategories); // Get all categories
router.post('/', AuthMiddleware.authorizeAdmin, CategoryController.createCategory); // Create category
router.get('/:id', AuthMiddleware.authorizeAdmin, CategoryController.getCategoryById); // Get category by id
router.put('/:id', AuthMiddleware.authorizeAdmin, CategoryController.updateCategory); // Update category
router.delete('/:id', AuthMiddleware.authorizeAdmin, CategoryController.deleteCategory); // Delete category

export default router;
