import { Component, computed, signal } from '@angular/core';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';
import { ProductsService } from '../../services/products/products.service';
import { ToastService } from '../../services/toasts/toast.service';
import { ModalService } from './../../services/modals/modal.service';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [StatusBadgeComponent, ModalComponent],
  templateUrl: './products.component.html',
})
export class ProductsComponent {
  products = computed(() => this.productService.productsSignal());
  selectedProductId = signal<number | null>(null);
  dropdownOpenId = signal<number | null>(null);

  constructor(
    private productService: ProductsService,
    private toast: ToastService,
    private modalService: ModalService
  ) {}

  toggleDropdown(id: number) {
    this.dropdownOpenId.update((openId) => (openId === id ? null : id));
  }

  setOutOfStock(id: number) {
    this.productService.productOutOfStock(id);
    this.toast.success('Product marked as out of stock.');
    this.dropdownOpenId.set(null);
  }

  setInStock(id: number) {
    this.productService.productInStock(id);
    this.toast.success('Product marked as in stock.');
    this.dropdownOpenId.set(null);
  }

  confirmArchive(id: number) {
    this.selectedProductId.set(id);
    this.dropdownOpenId.set(null);
    this.modalService.open();
  }

  archiveConfirmed() {
    const id = this.selectedProductId();
    if (id !== null) {
      this.productService.archiveProduct(id);
      this.toast.success('Product status set to archived.');
      this.selectedProductId.set(null);
    }
    this.modalService.close();
  }

  cancel() {
    this.modalService.close();
    this.selectedProductId.set(null);
  }
}
