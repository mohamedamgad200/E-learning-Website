import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { StudentRegistrationComponent } from './component/student/student-registration/student-registration.component';
import { StudentLoginComponent } from './component/student/student-login/student-login.component';
import { InstructorRegistrationComponent } from './component/instructor/instructor-registration/instructor-registration.component';
import { InstructorLoginComponent } from './component/instructor/instructor-login/instructor-login.component';
import { StudentHomeComponent } from './component/student/student-home/student-home.component';
import { InstructorTeachOnElearningComponent } from './component/instructor/instructor-teach-on-elearning/instructor-teach-on-elearning.component';
import { AdminDashboardComponent } from './component/administrator/admin-dashboard/admin-dashboard.component';
import { InstructorDashboardComponent } from './component/instructor/instructor-dashboard/instructor-dashboard.component';
import { CourseCreationComponent } from './component/instructor/course-creation/course-creation.component';
import { FileuploadComponent } from './component/fileupload/fileupload.component';
import { AssigmentUploadeComponent } from './component/assigment-uploade/assigment-uploade.component';
import { CourseManagementComponent } from './component/administrator/course-management/course-management.component';
import { StudentCourseMaterialComponent } from './component/student/student-course-material/student-course-material.component';
import { UserManagementComponent } from './component/administrator/user-management/user-management.component';
import { StudentManagementComponent } from './component/administrator/student-management/student-management.component';
import { MonitoringPrograssComponent } from './component/instructor/monitoring-prograss/monitoring-prograss.component';
import { ManagementAssignmentComponent } from './component/instructor/management-assignment/management-assignment.component';
import { StudentUploadeAssignmentComponent } from './component/student/student-uploade-assignment/student-uploade-assignment.component';
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: StudentRegistrationComponent },
  { path: 'login', component: StudentLoginComponent },
  { path: 'instructorRegister', component: InstructorRegistrationComponent },
  { path: 'instructorLogin', component: InstructorLoginComponent },
  { path: 'teachonelearning', component: InstructorTeachOnElearningComponent },
  { path: 'studentHomePage', component: StudentHomeComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'instructor-dashboard', component: InstructorDashboardComponent },
  { path: 'course-creation', component: CourseCreationComponent },
  { path: 'uploade-course', component: FileuploadComponent },
  { path: 'uploade-assigment', component: AssigmentUploadeComponent },
  { path: 'course-management', component: CourseManagementComponent },
  { path: 'user-management', component: UserManagementComponent },
  { path: 'Home-admin', component: AdminDashboardComponent },
  { path: 'student-management', component: StudentManagementComponent },
  { path: 'instructor-home', component: InstructorDashboardComponent },
  { path: 'monitoring-prograss', component: MonitoringPrograssComponent },
  { path: 'management-assigment', component: ManagementAssignmentComponent },
  { path: 'course/:id', component: StudentCourseMaterialComponent },
  {
    path: 'assignments/course',
    component: StudentUploadeAssignmentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
