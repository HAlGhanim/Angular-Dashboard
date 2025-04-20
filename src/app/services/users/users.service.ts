import { Injectable, signal } from '@angular/core';
import { User, USERS } from '../../../data/users';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private users = signal<User[]>(USERS);
  usersSignal = this.users.asReadonly();

  add(user: User) {
    this.users.update((list) => [...list, user]);
  }

  update(updatedUser: User) {
    this.users.update((list) =>
      list.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  }

  activateUser(id: number) {
    this.users.update((list) =>
      list.map((user) =>
        user.id === id ? { ...user, status: 'active' } : user
      )
    );
  }

  softDelete(id: number) {
    this.users.update((list) =>
      list.map((user) =>
        user.id === id ? { ...user, status: 'inactive' } : user
      )
    );
  }

  banUser(id: number) {
    this.users.update((list) =>
      list.map((user) =>
        user.id === id ? { ...user, status: 'banned' } : user
      )
    );
  }
}
