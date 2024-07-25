import createError from 'http-errors';
import prisma from '../config/Prisma.config';
import CategoryService from '../services/Category.service';

jest.mock('../config/Prisma.config');

describe('CategoryService', () => {
  let categoryService: CategoryService;

  beforeAll(() => {
    categoryService = new CategoryService();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const categories = [{ id: '1', name: 'Category 1' }];
      prisma.category.findMany = jest.fn().mockResolvedValue(categories);

      const result = await categoryService.getAllCategories();
      expect(result).toEqual(categories);
    });

    it('should throw 404 if no categories found', async () => {
      prisma.category.findMany = jest.fn().mockResolvedValue([]);

      await expect(categoryService.getAllCategories()).rejects.toThrowError(createError(404, 'No categories found'));
    });
  });

  describe('getActiveCategories', () => {
    it('should return active categories', async () => {
      const categories = [{ id: '1', name: 'Category 1' }];
      prisma.category.findMany = jest.fn().mockResolvedValue(categories);

      const result = await categoryService.getActiveCategories();
      expect(result).toEqual(categories);
    });

    it('should throw 404 if no active categories found', async () => {
      prisma.category.findMany = jest.fn().mockResolvedValue([]);

      await expect(categoryService.getActiveCategories()).rejects.toThrowError(createError(404, 'No categories found'));
    });
  });

  describe('getDeletedCategories', () => {
    it('should return deleted categories', async () => {
      const categories = [{ id: '1', name: 'Category 1' }];
      prisma.category.findMany = jest.fn().mockResolvedValue(categories);

      const result = await categoryService.getDeletedCategories();
      expect(result).toEqual(categories);
    });

    it('should throw 404 if no deleted categories found', async () => {
      prisma.category.findMany = jest.fn().mockResolvedValue([]);

      await expect(categoryService.getDeletedCategories()).rejects.toThrowError(createError(404, 'No categories found'));
    });
  });

  describe('getCategoryById', () => {
    it('should return category by ID', async () => {
      const category = { id: '1', name: 'Category 1' };
      prisma.category.findUnique = jest.fn().mockResolvedValue(category);

      const result = await categoryService.getCategoryById('1');
      expect(result).toEqual(category);
    });

    it('should throw 404 if category not found', async () => {
      prisma.category.findUnique = jest.fn().mockResolvedValue(null);

      await expect(categoryService.getCategoryById('1')).rejects.toThrowError(createError(404, 'Category not found'));
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const categoryData = { name: 'new category' };
      const newCategory = { id: '1', name: 'new category' };
      prisma.category.findFirst = jest.fn().mockResolvedValue(null);
      prisma.category.create = jest.fn().mockResolvedValue(newCategory);

      const result = await categoryService.createCategory(categoryData);
      expect(result).toEqual(newCategory);
    });

    it('should throw 409 if category already exists', async () => {
      const categoryData = { name: 'existing category' };
      const existingCategory = { id: '1', name: 'existing category' };
      prisma.category.findFirst = jest.fn().mockResolvedValue(existingCategory);

      await expect(categoryService.createCategory(categoryData)).rejects.toThrowError(createError(409, 'Category already exists'));
    });
  });

  describe('updateCategory', () => {
    it('should update an existing category', async () => {
      const category = { id: '1', name: 'updated category' };
      prisma.category.findUnique = jest.fn().mockResolvedValue(category);
      prisma.category.update = jest.fn().mockResolvedValue(category);

      const result = await categoryService.updateCategory('1', { name: 'updated category' });
      expect(result).toEqual(category);
    });

    it('should throw 404 if category not found', async () => {
      prisma.category.findUnique = jest.fn().mockResolvedValue(null);

      await expect(categoryService.updateCategory('1', { name: 'updated category' })).rejects.toThrowError(createError(404, 'Category not found'));
    });
  });

  describe('deleteCategory', () => {
    it('should mark a category as deleted', async () => {
      const category = { id: '1', is_deleted: false, events: [] };
      prisma.category.findUnique = jest.fn().mockResolvedValue(category);
      prisma.category.update = jest.fn();

      await categoryService.deleteCategory('1');
      expect(prisma.category.update).toHaveBeenCalledWith({ where: { id: '1' }, data: { is_deleted: true } });
    });

    it('should throw 404 if category not found', async () => {
      prisma.category.findUnique = jest.fn().mockResolvedValue(null);

      await expect(categoryService.deleteCategory('1')).rejects.toThrowError(createError(404, 'Category not found'));
    });

    it('should throw 400 if category has active events', async () => {
      const category = { id: '1', is_deleted: false, events: [{ id: 'event1', is_deleted: false }] };
      prisma.category.findUnique = jest.fn().mockResolvedValue(category);

      await expect(categoryService.deleteCategory('1')).rejects.toThrowError(createError(400, 'Cannot delete a category with active products'));
    });
  });

  describe('getCategoryAnalytics', () => {
    it('should return category analytics', async () => {
      prisma.category.count = jest.fn().mockResolvedValue(10);
      prisma.category.count = jest.fn().mockResolvedValueOnce(7);
      prisma.category.count = jest.fn().mockResolvedValueOnce(3);

      const result = await categoryService.getCategoryAnalytics();
      expect(result).toEqual({ all_categories: 10, active_categories: 7, deleted_categories: 3 });
    });
  });
});
