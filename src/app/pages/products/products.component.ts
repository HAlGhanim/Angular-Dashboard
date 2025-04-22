import {
  Component,
  computed,
  ElementRef,
  HostListener,
  signal,
  ViewChild,
} from '@angular/core';
import { ModalComponent } from '../../components/modal/modal.component';
import { ProductsService } from '../../services/products/products.service';
import { ToastService } from '../../services/toasts/toast.service';
import { ModalService } from './../../services/modals/modal.service';
import { DatePipe } from '@angular/common';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ModalComponent, DatePipe, StatusBadgeComponent],
  templateUrl: './products.component.html',
})
export class ProductsComponent {
  allColumns = [
    'image',
    'name',
    'description',
    'price',
    'rating',
    'stock',
    'category',
    'status',
    'tags',
    'createdAt',
    'updatedAt',
  ];

  visibleColumns = signal<string[]>([...this.allColumns]);
  showColumnDropdown = signal(false);
  allProducts = computed(() => this.productService.productsSignal());
  searchQuery = signal('');
  selectedStatus = signal('all');
  selectedCategory = signal('all');
  dropdownOpenId = signal<number | null>(null);
  selectedProductId = signal<number | null>(null);
  perPage = signal(5);
  currentPage = signal(1);
  pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  @ViewChild('dropdownRef') dropdownRef!: ElementRef;

  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const status = this.selectedStatus();
    const category = this.selectedCategory();

    return this.allProducts()
      .filter((product) => {
        const matchesQuery =
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query);
        const matchesStatus =
          status === 'all' ? true : product.status === status;
        const matchesCategory =
          category === 'all' ? true : product.category === category;
        return matchesQuery && matchesStatus && matchesCategory;
      })
      .slice(
        (this.currentPage() - 1) * this.perPage(),
        this.currentPage() * this.perPage()
      );
  });

  totalPages = computed(() => {
    const total = this.allProducts().filter((product) => {
      const matchesQuery = product.name
        .toLowerCase()
        .includes(this.searchQuery().toLowerCase());
      const matchesStatus =
        this.selectedStatus() === 'all' ||
        product.status === this.selectedStatus();
      const matchesCategory =
        this.selectedCategory() === 'all' ||
        product.category === this.selectedCategory();
      return matchesQuery && matchesStatus && matchesCategory;
    }).length;
    return Math.ceil(total / this.perPage());
  });

  constructor(
    private productService: ProductsService,
    private toast: ToastService,
    private modalService: ModalService
  ) {}

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

  setPage(page: number) {
    this.currentPage.set(page);
  }

  setPerPage(value: number) {
    this.perPage.set(value);
    this.currentPage.set(1);
  }

  updateQuery(query: string) {
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }

  updateStatus(status: string) {
    this.selectedStatus.set(status);
    this.currentPage.set(1);
  }

  updateCategory(category: string) {
    this.selectedCategory.set(category);
    this.currentPage.set(1);
  }

  toggleDropdown(id: number) {
    this.dropdownOpenId.update((openId) => (openId === id ? null : id));
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    const dropdown = this.dropdownRef?.nativeElement;
    if (
      this.dropdownOpenId() !== null &&
      dropdown &&
      !dropdown.contains(target)
    ) {
      this.dropdownOpenId.set(null);
    }
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
    this.modalService.open('archive');
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
