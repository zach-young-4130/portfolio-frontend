import { WritableSignal } from '@angular/core';

export function toggleSetItem<T>(sig: WritableSignal<Set<T>>, item: T): void {
  const next = new Set(sig());
  next.has(item) ? next.delete(item) : next.add(item);
  sig.set(next);
}
