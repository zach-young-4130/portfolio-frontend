import {
  Component,
  ChangeDetectionStrategy,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  protected submitting = signal(false);
  protected errorMessage = signal<string | null>(null);

  protected form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.errorMessage.set(null);
    const { email, password } = this.form.getRawValue();
    this.auth
      .login(email, password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.redirectAfterLogin(),
        error: (err) => this.handleAuthError(err, 'Invalid email or password.'),
      });
  }

  private handleAuthError(err: unknown, fallback: string): void {
    const body = (err as { error?: { errors?: string[]; locked_until?: string } })?.error ?? null;
    if (body?.locked_until) {
      const until = new Date(body.locked_until);
      const minutes = Math.max(1, Math.ceil((until.getTime() - Date.now()) / 60_000));
      this.errorMessage.set(
        `Account locked. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`,
      );
    } else if (body?.errors?.length) {
      this.errorMessage.set(body.errors[0]);
    } else {
      this.errorMessage.set(fallback);
    }
    this.submitting.set(false);
  }

  private redirectAfterLogin(): void {
    this.router.navigate([this.auth.isAdmin() ? '/admin' : '/']);
  }
}
