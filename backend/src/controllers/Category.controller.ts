import { Request, Response, NextFunction } from 'express';
import CategoryService from '../services/Category.service';

class CategoryController {

  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }

  getActiveCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.categoryService.getActiveCategories();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }

  getDeletedCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.categoryService.getDeletedCategories();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }

  getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.categoryService.getCategoryById(req.params.id);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  createCategory = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const newCategory = await this.categoryService.createCategory(req.body);
        res.status(201).json(newCategory);
      } catch (error: any) {
        next(error);
      }
  }

  updateCategory = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const updatedCategory = await this.categoryService.updateCategory(req.params.id, req.body);
        res.status(201).json(updatedCategory);
      } catch (error: any) {
        next(error);
      }
  }

  deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.categoryService.deleteCategory(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }

  getCategoryAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const analytics = await this.categoryService.getCategoryAnalytics();
      res.status(200).json(analytics);
    } catch (error: any) {
      next(error);
    }
  }
}

export default new CategoryController();
