import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent {
  project = input.required<Project>();
}
