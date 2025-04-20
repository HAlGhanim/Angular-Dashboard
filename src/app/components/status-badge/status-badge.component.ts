import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.component.html',
})
export class StatusBadgeComponent {
  @Input() status:
    | 'active'
    | 'inactive'
    | 'banned'
    | 'available'
    | 'out-of-stock'
    | 'archived' = 'active';

  get color(): string {
    switch (this.status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-yellow-500';
      case 'banned':
        return 'bg-red-600';
      case 'available':
        return 'bg-green-600';
      case 'out-of-stock':
        return 'bg-orange-500';
      case 'archived':
        return 'bg-gray-500';
      default:
        return 'bg-gray-300';
    }
  }
}
