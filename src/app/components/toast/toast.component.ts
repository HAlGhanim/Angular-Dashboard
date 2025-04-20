import { Component, computed } from '@angular/core';
import { ToastService } from '../../services/toasts/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  toasts = computed(() => this.toastService.toastSignal());
  constructor(private toastService: ToastService) {}
}
