import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReviewService } from './review.service';
import Review from '../../shared/models/Review';

describe('ReviewService', () => {
  let service: ReviewService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReviewService]
    });
    service = TestBed.inject(ReviewService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test for getAllReviews
  it('should fetch all reviews', () => {
    const dummyReviews: Review[] = [
      { id: '1', attendee_id: 'attendee1', event_id: 'event1', rating: 5, comment: 'Excellent!' },
      { id: '2', attendee_id: 'attendee2', event_id: 'event2', rating: 4, comment: 'Very good!' }
    ];

    service.getAllReviews().subscribe(reviews => {
      expect(reviews.length).toBe(2);
      expect(reviews).toEqual(dummyReviews);
    });

    const req = httpMock.expectOne(service['baseUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(dummyReviews);
  });

  // Test for getReviewById
  it('should fetch a single review by id', () => {
    const dummyReview: Review = { id: '1', attendee_id: 'attendee1', event_id: 'event1', rating: 5, comment: 'Excellent!' };

    service.getReviewById('1').subscribe(review => {
      expect(review).toEqual(dummyReview);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyReview);
  });

  // Test for createReview
  it('should create a new review', () => {
    const newReview: Review = { id: '1', attendee_id: 'attendee1', event_id: 'event1', rating: 5, comment: 'Excellent!' };

    service.createReview(newReview).subscribe(review => {
      expect(review).toEqual(newReview);
    });

    const req = httpMock.expectOne(service['baseUrl']);
    expect(req.request.method).toBe('POST');
    req.flush(newReview);
  });

  // Test for updateReview
  it('should update an existing review', () => {
    const updatedReview: Review = { id: '1', attendee_id: 'attendee1', event_id: 'event1', rating: 4, comment: 'Very good!' };

    service.updateReview('1', updatedReview).subscribe(review => {
      expect(review).toEqual(updatedReview);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedReview);
  });

  // Test for deleteReview
  it('should delete a review', () => {
    service.deleteReview('1').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  // Test for getReviewsByUserId
  it('should fetch reviews by user id', () => {
    const dummyReviews: Review[] = [
      { id: '1', attendee_id: 'attendee1', event_id: 'event1', rating: 5, comment: 'Excellent!' },
      { id: '2', attendee_id: 'attendee1', event_id: 'event2', rating: 4, comment: 'Very good!' }
    ];

    service.getReviewsByUserId().subscribe(reviews => {
      expect(reviews.length).toBe(2);
      expect(reviews).toEqual(dummyReviews);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/user`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyReviews);
  });

  // Test for getReviewsByEventId
  it('should fetch reviews by event id', () => {
    const dummyReviews: Review[] = [
      { id: '1', attendee_id: 'attendee1', event_id: 'event1', rating: 5, comment: 'Excellent!' },
      { id: '2', attendee_id: 'attendee2', event_id: 'event1', rating: 4, comment: 'Very good!' }
    ];

    service.getReviewsByEventId('event1').subscribe(reviews => {
      expect(reviews.length).toBe(2);
      expect(reviews).toEqual(dummyReviews);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/event/event1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyReviews);
  });

  // Test for getReviewAnalytics
  it('should fetch review analytics', () => {
    const dummyAnalytics = { totalReviews: 10, averageRating: 4.5 };

    service.getReviewAnalytics().subscribe(analytics => {
      expect(analytics).toEqual(dummyAnalytics);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/analytics`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyAnalytics);
  });
});
