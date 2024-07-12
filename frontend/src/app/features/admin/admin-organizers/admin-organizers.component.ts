import { Component } from '@angular/core';
import Organizer from '../../../shared/models/Organizer';
import { OrganizerService } from '../../../core/services/organizer.service';
import { CommonModule } from '@angular/common';
import { CreateOrganizerComponent } from './create-organizer/create-organizer.component';
import { EditOrganizerComponent } from './edit-organizer/edit-organizer.component';
import { SingleOrganizerComponent } from './single-organizer/single-organizer.component';
import { DeleteOrganizerComponent } from './delete-organizer/delete-organizer.component';

@Component({
  selector: 'app-admin-organizers',
  standalone: true,
  imports: [CommonModule, CreateOrganizerComponent, EditOrganizerComponent, SingleOrganizerComponent, DeleteOrganizerComponent],
  templateUrl: './admin-organizers.component.html',
  styleUrl: './admin-organizers.component.css'
})
export class AdminOrganizersComponent {
  organizers: Organizer[] = [];
  paginatedOrganizers: Organizer[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  selectedOrganizerId: string | null = null;
  currentView: string = 'default';

  constructor(private organizerService: OrganizerService) {}

  ngOnInit(): void {
    this.loadOrganizers();
  }

  loadOrganizers(): void {
    this.organizerService.getAllOrganizers().subscribe((organizers) => {
      this.organizers = organizers;
      this.totalPages = Math.ceil(this.organizers.length / this.itemsPerPage);
      this.updatePaginatedOrganizers();
    });
  }

  updatePaginatedOrganizers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOrganizers = this.organizers.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedOrganizers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedOrganizers();
    }
  }

  onCreate(): void {
    this.currentView = 'create';
  }

  onView(id: string): void {
    this.selectedOrganizerId = id;
    this.currentView = 'view';
  }

  onEdit(id: string): void {
    this.selectedOrganizerId = id;
    this.currentView = 'edit';
  }

  onDelete(id: string): void {
    this.selectedOrganizerId = id;
    this.currentView = 'delete';
  }
}
