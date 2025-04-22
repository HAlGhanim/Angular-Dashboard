import { Component, computed, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ModalService } from '../../services/modals/modal.service';
import { ToastService } from '../../services/toasts/toast.service';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { OrderService } from '../../services/orders/order.service';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Order } from '../../../data/orders';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    StatusBadgeComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './orders.component.html',
})
export class OrdersComponent {
  allColumns = [
    'id',
    'userId',
    'productIds',
    'totalAmount',
    'status',
    'shippingStatus',
    'createdAt',
  ];

  visibleColumns = signal<string[]>([...this.allColumns]);
  showColumnDropdown = signal(false);
  allOrders = computed(() => this.ordersService.ordersSignal());
  selectedOrderId = signal<number | null>(null);
  selectedStatus = signal<'all' | 'active' | 'cancelled' | 'archived'>('all');
  selectedShipping = signal<
    'all' | 'pending' | 'shipped' | 'delivered' | 'returned'
  >('all');
  searchQuery = signal('');
  perPage = signal(5);
  currentPage = signal(1);

  editForm = new FormGroup({
    id: new FormControl<number | null>(null),
    userId: new FormControl<number | null>(null, Validators.required),
    productIds: new FormControl<number[] | null>([], Validators.required),
    totalAmount: new FormControl<number | null>(null, Validators.required),
    status: new FormControl<'active' | 'cancelled' | 'archived' | null>(
      'active',
      Validators.required
    ),
    shippingStatus: new FormControl<
      'pending' | 'shipped' | 'delivered' | 'returned' | null
    >('pending', Validators.required),
    createdAt: new FormControl<string | null>(null, Validators.required),
  });

  filteredOrders = computed(() => {
    const status = this.selectedStatus();
    const shipping = this.selectedShipping();
    const query = this.searchQuery().toLowerCase();

    return this.allOrders()
      .filter((order) => {
        const matchesQuery = order.id.toString().includes(query);
        const matchesStatus = status === 'all' ? true : order.status === status;
        const matchesShipping =
          shipping === 'all' ? true : order.shippingStatus === shipping;
        return matchesQuery && matchesStatus && matchesShipping;
      })
      .slice(
        (this.currentPage() - 1) * this.perPage(),
        this.currentPage() * this.perPage()
      );
  });

  totalPages = computed(() => {
    const total = this.allOrders().filter((order) => {
      const matchesQuery = order.id
        .toString()
        .includes(this.searchQuery().toLowerCase());
      const matchesStatus =
        this.selectedStatus() === 'all' ||
        order.status === this.selectedStatus();
      const matchesShipping =
        this.selectedShipping() === 'all' ||
        order.shippingStatus === this.selectedShipping();
      return matchesQuery && matchesStatus && matchesShipping;
    }).length;
    return Math.ceil(total / this.perPage());
  });

  pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  constructor(
    public modalService: ModalService,
    private ordersService: OrderService,
    private toast: ToastService
  ) {}

  confirmSoftDelete(id: number) {
    this.selectedOrderId.set(id);
    this.modalService.open('archive');
  }

  softDeleteConfirmed() {
    const id = this.selectedOrderId();
    if (id !== null) {
      this.ordersService.softDelete(id);
      this.toast.success('Order status set to archived.');
      this.selectedOrderId.set(null);
    }
    this.modalService.close();
  }

  toggleColumnDropdown() {
    this.showColumnDropdown.update((open) => !open);
  }

  toggleColumn(column: string) {
    this.visibleColumns.update((cols) =>
      cols.includes(column)
        ? cols.filter((c) => c !== column)
        : [...cols, column]
    );
  }

  onProductIdsInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const ids = value
      .split(',')
      .map((v) => +v.trim())
      .filter((v) => !isNaN(v));
    this.editForm.get('productIds')?.setValue(ids);
  }

  updateQuery(query: string) {
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }

  updateStatus(status: string) {
    this.selectedStatus.set(status as any);
    this.currentPage.set(1);
  }

  updateShipping(status: string) {
    this.selectedShipping.set(status as any);
    this.currentPage.set(1);
  }

  setPerPage(value: number) {
    this.perPage.set(+value);
    this.currentPage.set(1);
  }

  setPage(page: number) {
    this.currentPage.set(page);
  }

  startEdit(order: Order) {
    this.editForm.setValue({
      id: order.id,
      userId: order.userId,
      productIds: order.productIds,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      status: order.status,
      shippingStatus: order.shippingStatus,
    });
    this.modalService.open('edit');
  }

  submitEdit() {
    if (this.editForm.valid) {
      const updatedOrder = this.editForm.value as Order;
      this.ordersService.update(updatedOrder);
      this.toast.success('Order updated successfully.');
      this.cancel();
    }
  }

  cancel() {
    this.modalService.close();
    this.selectedOrderId.set(null);
    this.editForm.reset();
  }
}
