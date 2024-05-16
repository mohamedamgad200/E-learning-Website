import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment.dev';
import { FormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FileuploadComponent } from './component/fileupload/fileupload.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HomeComponent } from './component/home/home.component';
import { FooterComponent } from './component/footer/footer.component';
import { AdminDashboardComponent } from './component/administrator/admin-dashboard/admin-dashboard.component';
import { StudentRegistrationComponent } from './component/student/student-registration/student-registration.component';
import { StudentLoginComponent } from './component/student/student-login/student-login.component';
import { StudentHomeComponent } from './component/student/student-home/student-home.component';
import { InstructorRegistrationComponent } from './component/instructor/instructor-registration/instructor-registration.component';
import { InstructorTeachOnElearningComponent } from './component/instructor/instructor-teach-on-elearning/instructor-teach-on-elearning.component';
import { InstructorLoginComponent } from './component/instructor/instructor-login/instructor-login.component';
import { SideBarComponent } from './component/instructor/side-bar/side-bar.component';
import { CourseCreationComponent } from './component/instructor/course-creation/course-creation.component';
import { InstructorDashboardComponent } from './component/instructor/instructor-dashboard/instructor-dashboard.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AssigmentUploadeComponent } from './component/assigment-uploade/assigment-uploade.component';
import { CourseManagementComponent } from './component/administrator/course-management/course-management.component';
import { StudentCourseMaterialComponent } from './component/student/student-course-material/student-course-material.component';
import { StudentManagementComponent } from './component/administrator/student-management/student-management.component';
import { UserManagementComponent } from './component/administrator/user-management/user-management.component';
import { SideBarAdminComponent } from './component/administrator/side-bar-admin/side-bar-admin.component';
import { ManagementAssignmentComponent } from './component/instructor/management-assignment/management-assignment.component';
import { MonitoringPrograssComponent } from './component/instructor/monitoring-prograss/monitoring-prograss.component';
import { StudentUploadeAssignmentComponent } from './component/student/student-uploade-assignment/student-uploade-assignment.component';

@NgModule({
  declarations: [
    AppComponent,
    FileuploadComponent,
    HomeComponent,
    FooterComponent,
    AdminDashboardComponent,
    StudentRegistrationComponent,
    StudentLoginComponent,
    StudentHomeComponent,
    InstructorRegistrationComponent,
    InstructorTeachOnElearningComponent,
    InstructorLoginComponent,
    SideBarComponent,
    CourseCreationComponent,
    InstructorDashboardComponent,
    AssigmentUploadeComponent,
    CourseManagementComponent,
    StudentCourseMaterialComponent,
    StudentManagementComponent,
    UserManagementComponent,
    SideBarAdminComponent,
    ManagementAssignmentComponent,
    MonitoringPrograssComponent,
    StudentUploadeAssignmentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [provideClientHydration(), provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
