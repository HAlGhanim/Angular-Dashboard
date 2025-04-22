import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private isOpen = signal(false);
  private modalType = signal<'edit' | 'archive' | null>(null);

  modalState = this.isOpen.asReadonly();
  type = this.modalType.asReadonly();

  open(type: 'edit' | 'archive') {
    this.modalType.set(type);
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.modalType.set(null);
  }

  toggle(type: 'edit' | 'archive') {
    this.modalType.set(type);
    this.isOpen.update((v) => !v);
  }
}
