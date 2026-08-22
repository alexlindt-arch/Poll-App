import { Injectable, signal } from '@angular/core';

/** Shows a short confirmation at the bottom of the current page. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly message = signal<string>('');
  private timerId: ReturnType<typeof setTimeout> | null = null;

  /** Shows a message and hides it again after 2.5 seconds. */
  show(message: string): void {
    this.message.set(message);
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
    }
    this.timerId = setTimeout(() => this.hide(), 2500);
  }

  /** Hides the message right away. */
  hide(): void {
    this.message.set('');
  }
}
