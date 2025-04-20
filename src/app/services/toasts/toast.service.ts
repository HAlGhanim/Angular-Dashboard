import { Injectable, computed, effect, signal } from '@angular/core';

export enum ToastType {
  success = 'SUCCESS',
  error = 'ERROR',
}

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts = signal<ToastMessage[]>([]);
  private idCounter = 0;
  toastSignal = computed(() => this.toasts());

  show(type: ToastType, message: string) {
    const id = ++this.idCounter;
    this.toasts.update((toasts) => [...toasts, { id, type, message }]);
    setTimeout(() => {
      this.toasts.update((toasts) => toasts.filter((t) => t.id !== id));
    }, 3000);
  }

  success(msg: string) {
    this.show(ToastType.success, msg);
  }

  error(msg: string) {
    this.show(ToastType.error, msg);
  }
}
