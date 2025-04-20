import { Component, computed } from '@angular/core';
import { ModalService } from '../../services/modals/modal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  isOpen = computed(() => this.modalService.modalState());
  constructor(private modalService: ModalService) {}

  close() {
    this.modalService.close();
  }
}
