import { DestroyRef, Directive, OnInit, Signal, TemplateRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

export interface HasId { id: number; }

@Directive()
export abstract class BaseCrudComponent<T extends HasId> implements OnInit {
  protected modalService = inject(NgbModal);
  protected destroyRef = inject(DestroyRef);

  protected items = signal<T[]>([]);
  protected editing = signal<T | null>(null);

  // Subclasses provide via viewChild.required(...)
  protected abstract editModal: Signal<TemplateRef<unknown>>;
  protected abstract deleteModal: Signal<TemplateRef<unknown>>;

  protected abstract form: FormGroup;
  protected abstract editModalAriaLabel: string;
  protected abstract deleteModalAriaLabel: string;

  protected abstract loadList(): Observable<T[]>;
  protected abstract createItem(data: unknown): Observable<unknown>;
  protected abstract updateItem(id: number, data: unknown): Observable<unknown>;
  protected abstract removeItem(id: number): Observable<void>;
  protected abstract resetForm(): void;
  protected abstract populateForm(item: T): void;
  protected abstract buildSaveData(): unknown;

  ngOnInit(): void {
    this.refresh();
  }

  protected openNew(): void {
    this.editing.set(null);
    this.resetForm();
    this.modalService.open(this.editModal(), { ariaLabelledBy: this.editModalAriaLabel });
  }

  protected openEdit(item: T): void {
    this.editing.set(item);
    this.populateForm(item);
    this.modalService.open(this.editModal(), { ariaLabelledBy: this.editModalAriaLabel });
  }

  protected save(close: () => void): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const data = this.buildSaveData();
    const current = this.editing();
    const op = current ? this.updateItem(current.id, data) : this.createItem(data);
    op.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      close();
      this.refresh();
    });
  }

  protected confirmDelete(item: T): void {
    this.editing.set(item);
    this.modalService
      .open(this.deleteModal(), { ariaLabelledBy: this.deleteModalAriaLabel })
      .result.then(
        (confirmed) => {
          if (confirmed) {
            this.removeItem(item.id)
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe(() => this.refresh());
          }
        },
        () => undefined,
      );
  }

  protected refresh(): void {
    this.loadList()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((items) => this.items.set(items));
  }
}
