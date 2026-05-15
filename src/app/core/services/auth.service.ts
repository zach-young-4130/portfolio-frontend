import { Injectable, inject, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { TokenService } from './token.service';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private tokens = inject(TokenService);

  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  login(email: string, password: string) {
    return this.api.post<{ user: User; token: string }>('session', { email, password }).pipe(
      tap((res) => {
        this.tokens.set(res.token);
        this.currentUser.set(res.user);
      }),
    );
  }

  logout() {
    return this.api.delete<void>('session').pipe(
      tap(() => {
        this.tokens.clear();
        this.currentUser.set(null);
      }),
    );
  }

  fetchCurrentUser() {
    return this.api.get<{ user: User }>('session').pipe(
      tap((res) => this.currentUser.set(res.user)),
    );
  }
}
