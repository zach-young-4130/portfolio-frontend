import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ContactFormComponent } from '../../shared/components/contact-form/contact-form';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ContactFormComponent, PageHeroComponent],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {}
