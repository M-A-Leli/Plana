import { Component } from '@angular/core';
import Admin from '../../../shared/models/Admin';
import { AdminService } from '../../../core/services/admin.service';
import { CommonModule } from '@angular/common';
import { CreateAdminComponent } from './create-admin/create-admin.component';
import { EditAdminComponent } from './edit-admin/edit-admin.component';
import { SingleAdminComponent } from './single-admin/single-admin.component';
import { DeleteAdminComponent } from './delete-admin/delete-admin.component';

@Component({
  selector: 'app-admin-admins',
  standalone: true,
  imports: [CommonModule, CreateAdminComponent, EditAdminComponent, SingleAdminComponent, DeleteAdminComponent],
  templateUrl: './admin-admins.component.html',
  styleUrl: './admin-admins.component.css'
})
export class AdminAdminsComponent {
  admins: Admin[] = [];
  paginatedAdmins: Admin[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  selectedAdminId: string | null = null;
  currentView: string = 'default';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.adminService.getAllAdmins().subscribe((admins) => {
      this.admins = admins;
      this.totalPages = Math.ceil(this.admins.length / this.itemsPerPage);
      this.updatePaginatedAdmins();
    });
  }

  updatePaginatedAdmins(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedAdmins = this.admins.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedAdmins();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedAdmins();
    }
  }

  onCreate(): void {
    this.currentView = 'create';
  }

  onView(id: string): void {
    this.selectedAdminId = id;
    this.currentView = 'view';
  }

  onEdit(id: string): void {
    this.selectedAdminId = id;
    this.currentView = 'edit';
  }

  onDelete(id: string): void {
    this.selectedAdminId = id;
    this.currentView = 'delete';
  }
}
