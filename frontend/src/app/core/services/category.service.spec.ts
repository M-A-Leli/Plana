import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import Category from '../../shared/models/Category';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService]
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test for getAllCategories
  it('should fetch all categories', () => {
    const dummyCategories: Category[] = [
      { id: '1', name: 'Category 1' },
      { id: '2', name: 'Category 2' }
    ];

    service.getAllCategories().subscribe(categories => {
      expect(categories.length).toBe(2);
      expect(categories).toEqual(dummyCategories);
    });

    const req = httpMock.expectOne(service['baseUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(dummyCategories);
  });

  // Test for getCategoryById
  it('should fetch a single category by id', () => {
    const dummyCategory: Category = { id: '1', name: 'Category 1' };

    service.getCategoryById('1').subscribe(category => {
      expect(category).toEqual(dummyCategory);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyCategory);
  });

  // Test for createCategory
  it('should create a new category', () => {
    const newCategory: Category = { id: '3', name: 'Category 3' };

    service.createCategory(newCategory).subscribe(category => {
      expect(category).toEqual(newCategory);
    });

    const req = httpMock.expectOne(service['baseUrl']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCategory);
    req.flush(newCategory);
  });

  // Test for updateCategory
  it('should update an existing category', () => {
    const updatedCategory: Category = { id: '1', name: 'Updated Category' };

    service.updateCategory('1', updatedCategory).subscribe(category => {
      expect(category).toEqual(updatedCategory);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedCategory);
    req.flush(updatedCategory);
  });

  // Test for deleteCategory
  it('should delete a category', () => {
    service.deleteCategory('1').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  // Test for getActiveCategories
  it('should fetch active categories', () => {
    const dummyCategories: Category[] = [
      { id: '1', name: 'Active Category 1' },
      { id: '2', name: 'Active Category 2' }
    ];

    service.getActiveCategories().subscribe(categories => {
      expect(categories.length).toBe(2);
      expect(categories).toEqual(dummyCategories);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/active`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyCategories);
  });

  // Test for getDeletedCategories
  it('should fetch deleted categories', () => {
    const dummyCategories: Category[] = [
      { id: '3', name: 'Deleted Category 1' },
      { id: '4', name: 'Deleted Category 2' }
    ];

    service.getDeletedCategories().subscribe(categories => {
      expect(categories.length).toBe(2);
      expect(categories).toEqual(dummyCategories);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/deleted`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyCategories);
  });

  // Test for getCategoryAnalytics
  it('should fetch category analytics', () => {
    const dummyAnalytics = { totalCategories: 10, activeCategories: 7 };

    service.getCategoryAnalytics().subscribe(analytics => {
      expect(analytics).toEqual(dummyAnalytics);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/analytics`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyAnalytics);
  });
});
