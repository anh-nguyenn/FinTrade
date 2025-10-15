import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminService } from "../../services/admin.service";
import { User } from "../../models/user.model";

@Component({
  selector: "app-admin",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <h1 class="mb-4">
            <i class="fas fa-users-cog me-2"></i>Admin Panel
            <small class="text-muted">User Management</small>
          </h1>
        </div>
      </div>

      <!-- Users Table -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div
              class="card-header d-flex justify-content-between align-items-center"
            >
              <h5 class="mb-0"><i class="fas fa-users me-2"></i>All Users</h5>
              <button class="btn btn-outline-secondary" (click)="loadUsers()">
                <i class="fas fa-sync-alt me-1"></i>Refresh
              </button>
            </div>
            <div class="card-body">
              <div *ngIf="isLoading" class="text-center py-4">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <div
                *ngIf="!isLoading && users.length === 0"
                class="text-center py-5"
              >
                <i class="fas fa-users fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No users found</h5>
              </div>

              <div
                *ngIf="!isLoading && users.length > 0"
                class="table-responsive"
              >
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let user of users">
                      <td>{{ user.id }}</td>
                      <td>
                        <strong>{{ user.username }}</strong>
                      </td>
                      <td>{{ user.email }}</td>
                      <td>{{ user.firstName }} {{ user.lastName }}</td>
                      <td>
                        <span
                          class="badge"
                          [class.bg-primary]="user.role === 'USER'"
                          [class.bg-danger]="user.role === 'ADMIN'"
                        >
                          {{ user.role }}
                        </span>
                      </td>
                      <td>
                        <span
                          class="badge"
                          [class.bg-success]="user.enabled"
                          [class.bg-secondary]="!user.enabled"
                        >
                          {{ user.enabled ? "Active" : "Inactive" }}
                        </span>
                      </td>
                      <td>{{ user.createdAt | date : "short" }}</td>
                      <td>
                        <div class="btn-group" role="group">
                          <button
                            class="btn btn-sm btn-outline-warning"
                            (click)="toggleUserStatus(user)"
                          >
                            <i class="fas fa-power-off"></i>
                          </button>
                          <button
                            class="btn btn-sm btn-outline-danger"
                            (click)="deleteUser(user)"
                          >
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .badge {
        font-size: 0.75rem;
      }

      .btn-group .btn {
        margin-right: 0.25rem;
      }

      .btn-group .btn:last-child {
        margin-right: 0;
      }
    `,
  ],
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  isLoading = false;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading users:", error);
        this.isLoading = false;
      },
    });
  }

  toggleUserStatus(user: User): void {
    const action = user.enabled ? "disable" : "enable";
    if (confirm(`Are you sure you want to ${action} user ${user.username}?`)) {
      this.adminService.toggleUserStatus(user.id).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex((u) => u.id === user.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
        },
        error: (error) => {
          console.error("Error toggling user status:", error);
        },
      });
    }
  }

  deleteUser(user: User): void {
    if (
      confirm(
        `Are you sure you want to delete user ${user.username}? This action cannot be undone.`
      )
    ) {
      this.adminService.deleteUser(user.id).subscribe({
        next: (response) => {
          this.users = this.users.filter((u) => u.id !== user.id);
        },
        error: (error) => {
          console.error("Error deleting user:", error);
        },
      });
    }
  }
}
