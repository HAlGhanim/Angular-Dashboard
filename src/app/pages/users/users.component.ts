import { Component, computed, signal } from '@angular/core';
import { ToastService } from '../../services/toasts/toast.service';
import { ModalService } from '../../services/modals/modal.service';
import { UsersService } from '../../services/users/users.service';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [StatusBadgeComponent, ModalComponent],
  templateUrl: './users.component.html',
})
export class UsersComponent {
  users = computed(() => this.userService.usersSignal());
  selectedUserId = signal<number | null>(null);
  constructor(
    private userService: UsersService,
    private toast: ToastService,
    private modalService: ModalService
  ) {}

  confirmSoftDelete(id: number) {
    this.selectedUserId.set(id);
    this.modalService.open();
  }

  softDeleteConfirmed() {
    const id = this.selectedUserId();
    if (id !== null) {
      this.userService.softDelete(id);
      this.toast.success('User status set to inactive.');
      this.selectedUserId.set(null);
    }
    this.modalService.close();
  }

  cancel() {
    this.modalService.close();
    this.selectedUserId.set(null);
  }
}
