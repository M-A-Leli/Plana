import { Component, EventEmitter, Output } from '@angular/core';
import Order from '../../../shared/models/Order';
import { OrderService } from '../../../core/services/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attendee-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendee-events.component.html',
  styleUrl: './attendee-events.component.css'
})
export class AttendeeEventsComponent {
  orders: Order[] = [];
  paginatedOrders: Order[] = [];
  selectedOrder: Order | null = null;
  viewMode: 'default' | 'delete' = 'default';
  currentPage: number = 1;
  ordersPerPage: number = 10;
  totalPages: number = 1;
  errorMessage: string = '';
  successMessage: string = '';
  all_orders: number = 0;
  paid_orders: number = 0;
  unpaid_orders: number = 0;

  @Output() navigate = new EventEmitter<string>();
  @Output() orderSelected = new EventEmitter<string>();

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.fetchOrders();
  }

  getOrderAnalytics() {
    let all_orders = 0;
    let paid_orders = 0;
    let unpaid_orders = 0;

    this.orders.forEach(order => {
      all_orders += 1;
      if (order.payment_id) {
        paid_orders += 1;
      } else {
        unpaid_orders += 1;
      }
    });

    this.all_orders = all_orders;
    this.paid_orders = paid_orders;
    this.unpaid_orders = unpaid_orders;
  }

  fetchOrders(): void {
    this.orderService.getOrdersByUserId().subscribe(orders => {
      this.orders = orders;
      this.totalPages = Math.ceil(this.orders.length / this.ordersPerPage);
      this.updatePaginatedOrders();
      this.getOrderAnalytics();
    });
  }

  filterOrders(type: 'all' | 'paid' | 'unpaid'): void {
    switch (type) {
      case 'all':
        this.orderService.getOrdersByUserId().subscribe(orders => {
          this.orders = orders;
          this.totalPages = Math.ceil(this.orders.length / this.ordersPerPage);
          this.updatePaginatedOrders();
        });
        break;
      case 'paid':
        this.orderService.getPaidOrdersByUserId().subscribe(orders => {
          this.orders = orders;
          this.totalPages = Math.ceil(this.orders.length / this.ordersPerPage);
          this.updatePaginatedOrders();
        });
        break;
      case 'unpaid':
        this.orderService.getUnpaidOrderByUserId().subscribe(orders => {
          this.orders = orders;
          this.totalPages = Math.ceil(this.orders.length / this.ordersPerPage);
          this.updatePaginatedOrders();
        });
        break;
    }
  }

  updatePaginatedOrders(): void {
    const start = (this.currentPage - 1) * this.ordersPerPage;
    const end = start + this.ordersPerPage;
    this.paginatedOrders = this.orders.slice(start, end);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedOrders();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedOrders();
    }
  }

  showDelete(order: Order): void {
    this.selectedOrder = order;
    this.viewMode = 'delete';
  }

  showTickets(order: Order): void {
    this.orderSelected.emit(order.id);
    this.navigate.emit('tickets');
  }

  resetView(): void {
    this.selectedOrder = null;
    this.viewMode = 'default';
  }

  clearErrors() {
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  deleteOrder(): void {
    if (this.selectedOrder) {
      this.orderService.deleteOrder(this.selectedOrder.id as string).subscribe({
        next: data => {
          this.successMessage = 'Order deleted successfull!';
          setTimeout(() => {
            this.successMessage = '';
            this.fetchOrders();
            this.updatePaginatedOrders();
            this.resetView();
          }, 3000);
        },
        error: err => {
          if (err.status === 401 || err.status === 404 || err.status === 400) {
            this.errorMessage = err.error.error.message;
            this.clearErrors();
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again.';
            this.clearErrors();
          }
        }
      });
    }
  }
}
