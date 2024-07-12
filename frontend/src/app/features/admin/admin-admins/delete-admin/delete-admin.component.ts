import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../../core/services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-admin.component.html',
  styleUrls: ['./delete-admin.component.css']
})
export class DeleteAdminComponent {
  message: string | null = null;
  isError: boolean = false;

  @Input() adminId: string | null = null;
  @Output() cancel = new EventEmitter<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    // Initialization logic if needed
  }

  onDelete(): void {
    if (this.adminId) {
      this.adminService.deleteAdmin(this.adminId).subscribe(
        response => {
          this.message = 'Admin deleted successfully!';
          this.isError = false;
          setTimeout(() => {
            this.cancel.emit();
            this.router.navigate(['/admins']); // Adjust the route as needed
          }, 2000);
        },
        error => {
          this.message = 'Failed to delete admin. Please try again.';
          this.isError = true;
        }
      );
    } else {
      const id = this.route.snapshot.paramMap.get('id') || '';
      this.adminService.deleteAdmin(id).subscribe(
        response => {
          this.message = 'Admin deleted successfully!';
          this.isError = false;
          setTimeout(() => {
            this.cancel.emit();
            this.router.navigate(['/admins']); // Adjust the route as needed
          }, 2000);
        },
        error => {
          this.message = 'Failed to delete admin. Please try again.';
          this.isError = true;
        }
      );
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.router.navigate(['/admins']); // Adjust the route as needed
  }
}
