import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private isOpen = signal(false);
  private modalType = signal<'edit' | 'delete' | null>(null);

  modalState = this.isOpen.asReadonly();
  type = this.modalType.asReadonly();

  open(type: 'edit' | 'delete') {
    this.modalType.set(type);
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.modalType.set(null);
  }

  toggle(type: 'edit' | 'delete') {
    this.modalType.set(type);
    this.isOpen.update((v) => !v);
  }
}
