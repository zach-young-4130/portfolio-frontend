import {
  Component,
  ChangeDetectionStrategy,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

// Google Identity Services global, loaded dynamically when the form mounts.
declare const google: {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: { credential: string }) => void;
      }) => void;
      renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
    };
  };
};

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

  protected googleButton = viewChild<ElementRef<HTMLDivElement>>('googleButton');

  protected form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor() {
    afterNextRender(() => this.initGoogleSignIn());
  }

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

  private async initGoogleSignIn(): Promise<void> {
    if (!environment.googleClientId) return;

    try {
      await this.loadGsiScript();
    } catch {
      return; // Network/blocker — leave the password form usable.
    }

    const target = this.googleButton()?.nativeElement;
    if (!target) return;

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response) => this.handleGoogleCredential(response.credential),
    });
    google.accounts.id.renderButton(target, {
      theme: 'outline',
      size: 'large',
      width: 280,
      text: 'continue_with',
    });
  }

  private loadGsiScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as unknown as { google?: unknown }).google) return resolve();
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Google Sign-In failed to load'));
      document.head.appendChild(script);
    });
  }

  private handleGoogleCredential(idToken: string): void {
    this.submitting.set(true);
    this.errorMessage.set(null);
    this.auth
      .loginWithGoogle(idToken)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.redirectAfterLogin(),
        error: (err) => this.handleAuthError(err, 'Google sign-in failed.'),
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
