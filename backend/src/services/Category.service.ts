import createError from 'http-errors';
import { Category, Prisma } from '@prisma/client';
import prisma from '../config/Prisma.config';

class CategoryService {
  async getAllCategories(): Promise<Partial<Category>[]> {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      }
    });

    if (categories.length === 0) {
      throw createError(404, 'No categories found');
    }

    return categories;
  }

  async getActiveCategories(): Promise<Partial<Category>[]> {
    const categories = await prisma.category.findMany({
      where: { is_deleted: false },
      select: {
        id: true,
        name: true,
      }
    });

    if (categories.length === 0) {
      throw createError(404, 'No categories found');
    }

    return categories;
  }

  async getDeletedCategories(): Promise<Partial<Category>[]> {
    const categories = await prisma.category.findMany({
      where: { is_deleted: true },
      select: {
        id: true,
        name: true,
      }
    });

    if (categories.length === 0) {
      throw createError(404, 'No categories found');
    }

    return categories;
  }

  async getCategoryById(categoryId: string): Promise<Partial<Category> | null> {
    const category = prisma.category.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
        name: true,
      }
    });

    if (!category) {
      throw createError(404, 'Category not found');
    }

    return category;
  }

  async createCategory(data: Omit<Prisma.CategoryCreateInput, 'id'>): Promise<Partial<Category>> {
    const { name } = data;
  
    const lowerCaseName = name.toLowerCase();
  
    const nameExists = await prisma.category.findFirst({
      where: { name: lowerCaseName }
    });
  
    if (nameExists) {
      throw createError(409, 'Category already exists');
    }

    const categoryData = {
      ...data,
      name: lowerCaseName,
    }
  
    // Create a new category
    const newCategory = await prisma.category.create({
      data: categoryData,
      select: {
        id: true,
        name: true
      }
    });
  
    return newCategory;
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<Partial<Category> | null> {
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw createError(404, 'Category not found');
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
      }
    });

    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await prisma.category.findUnique({ 
      where: { id },
      include: {
        events: true,
      } 
    });

    if (!category) {
      throw createError(404, 'Category not found');
    }

    const activeCategories = category.events.filter(order => order.is_deleted === false);

    if(activeCategories.length > 0) {
      throw createError(400, 'Cannot delete a category wih active products');
    }

    await prisma.category.update({
      where: { id },
      data: { is_deleted: true }
    });
  }

  async getCategoryAnalytics(): Promise<Object> {
    const all_categories = await prisma.category.count();

    const active_categories = await prisma.category.count({
      where: {
        is_deleted: false
      },
    });

    const deleted_categories = await prisma.category.count({
      where: { is_deleted: true },
    });

    // ! More analytics

    return {
      all_categories,
      active_categories,
      deleted_categories
    };
  }
}

export default CategoryService;
