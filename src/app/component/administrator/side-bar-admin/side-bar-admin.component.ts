import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-side-bar-admin',
  templateUrl: './side-bar-admin.component.html',
  styleUrl: './side-bar-admin.component.css',
})
export class SideBarAdminComponent {
  constructor(private router: Router) {}
  logout() {
    this.router.navigate(['/home']);
  }
  gotocoursemanagement() {
    this.router.navigate(['/course-management']);
  }
  gotousermanagement() {
    this.router.navigate(['/user-management']);
  }
  gothome() {
    this.router.navigate(['/Home-admin']);
  }
  gotstudentmanagement() {
    this.router.navigate(['/student-management']);
  }
}
