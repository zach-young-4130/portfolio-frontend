import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ContactFormComponent } from '../../shared/components/contact-form/contact-form';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ContactFormComponent, PageHeroComponent],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  constructor() {
    inject(SeoService).set({
      title: 'Contact',
      description: 'Get in touch with Zach Young, senior full-stack software engineer specializing in Ruby on Rails and Angular. Open to professional opportunities.',
    });
  }
}
