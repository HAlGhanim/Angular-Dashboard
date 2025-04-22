import { Injectable, signal } from '@angular/core';
import { Order, ORDERS } from '../../../data/orders';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private orders = signal<Order[]>(ORDERS);
  ordersSignal = this.orders.asReadonly();

  getById(id: number): Order | undefined {
    return this.orders().find((o) => o.id === id);
  }

  update(updatedOrder: Order) {
    this.orders.update((list) =>
      list.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
    );
  }

  softDelete(id: number) {
    this.orders.update((list) =>
      list.map((order) =>
        order.id === id ? { ...order, status: 'archived' } : order
      )
    );
  }

  restore(id: number) {
    this.orders.update((list) =>
      list.map((order) =>
        order.id === id && order.status === 'archived'
          ? { ...order, status: 'active' }
          : order
      )
    );
  }

  updateShippingStatus(id: number, status: Order['shippingStatus']) {
    this.orders.update((list) =>
      list.map((order) =>
        order.id === id ? { ...order, shippingStatus: status } : order
      )
    );
  }

  filterByStatus(status: Order['status'] | 'all') {
    return status === 'all'
      ? this.orders()
      : this.orders().filter((o) => o.status === status);
  }

  filterByShippingStatus(shippingStatus: Order['shippingStatus'] | 'all') {
    return shippingStatus === 'all'
      ? this.orders()
      : this.orders().filter((o) => o.shippingStatus === shippingStatus);
  }
}
