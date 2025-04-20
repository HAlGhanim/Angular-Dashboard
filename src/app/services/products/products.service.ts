import { Injectable, signal } from '@angular/core';
import { Product, PRODUCTS } from '../../../data/products';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private products = signal<Product[]>(PRODUCTS);
  productsSignal = this.products.asReadonly();

  add(product: Product) {
    this.products.update((list) => [...list, product]);
  }

  update(updatedProduct: Product) {
    this.products.update((list) =>
      list.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  }

  productInStock(id: number) {
    this.products.update((list) =>
      list.map((product) =>
        product.id === id ? { ...product, status: 'available' } : product
      )
    );
  }

  productOutOfStock(id: number) {
    this.products.update((list) =>
      list.map((product) =>
        product.id === id ? { ...product, status: 'out-of-stock' } : product
      )
    );
  }

  archiveProduct(id: number) {
    this.products.update((list) =>
      list.map((product) =>
        product.id === id ? { ...product, status: 'archived' } : product
      )
    );
  }
}
