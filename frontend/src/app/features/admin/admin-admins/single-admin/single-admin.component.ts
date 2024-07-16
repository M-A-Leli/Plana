import { Component, Input } from '@angular/core';
import Admin from '../../../../shared/models/Admin';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../../core/services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-single-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-admin.component.html',
  styleUrl: './single-admin.component.css'
})
export class SingleAdminComponent {
  @Input() adminId: string | null = null;
  admin: Admin | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loadAdminData();
  }

  private loadAdminData(): void {
    if (this.adminId) {
      this.adminService.getAdminById(this.adminId).subscribe(
        admin => {
          this.admin = admin;
        },
        error => {
          console.error('Failed to fetch admin', error);
        }
      );
    } else {
      const id = this.route.snapshot.paramMap.get('id') || '';
      if (id) {
        this.adminService.getAdminById(id).subscribe(
          response => {
            this.admin = response;
          },
          error => {
            console.error('Failed to fetch admin', error);
          }
        );
      }
    }
  }

  onBack(): void {
    this.router.navigate(['/admin/admins']); // Adjust the route as needed
  }
}
