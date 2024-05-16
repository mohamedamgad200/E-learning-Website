import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent {
  constructor(private router: Router) {}
  goToCreateCourse() {
    this.router.navigate(['/course-creation']);
  }
  goToHome() {
    this.router.navigate(['/instructor-home']);
  }
  goToManagementAssigment() {
    this.router.navigate(['/management-assigment']);
  }
  goToMonitoringPrograss() {
    this.router.navigate(['/monitoring-prograss']);
  }
  logout() {
    this.router.navigate(['/home']);
  }
}
