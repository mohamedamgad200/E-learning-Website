import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../shared/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  selectedSection: string = 'userManagement'; // Default selected section
  activeUsers: any[] = [];
  deactivatedUsers: any[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.firebaseService
      .getAllUsers()
      .then((users) => {
        this.users = users;
        this.getActiveUsers();
        this.getDeactivatedUsers();
      })
      .catch((error) => {
        console.error('Error getting users:', error);
      });
  }

  getActiveUsers() {
    this.activeUsers = this.users.filter((user) => user.isActive);
  }

  getDeactivatedUsers() {
    this.deactivatedUsers = this.users.filter((user) => !user.isActive);
  }

  activateUser(uid: string) {
    this.firebaseService
      .activateUser(uid)
      .then(() => {
        // Remove the deactivated user from the deactivatedUsers array
        this.deactivatedUsers = this.deactivatedUsers.filter(
          (user) => user.uid !== uid
        );

        // Find the user in the users array and update its isActive status
        const index = this.users.findIndex((user) => user.uid === uid);
        if (index !== -1) {
          this.users[index].isActive = true;

          // Add the activated user to the activeUsers array
          this.activeUsers.push(this.users[index]);
          console.log('User activated successfully');
        }
      })
      .catch((error) => {
        console.error('Error activating user:', error);
      });
  }
  deactivateUser(uid: string) {
    this.firebaseService
      .deactivateAccount(uid)
      .then(() => {
        // Remove the activated user from the activeUsers array
        this.activeUsers = this.activeUsers.filter((user) => user.uid !== uid);

        // Find the user in the users array and update its isActive status
        const index = this.users.findIndex((user) => user.uid === uid);
        if (index !== -1) {
          this.users[index].isActive = false;

          // Add the deactivated user to the deactivatedUsers array
          this.deactivatedUsers.push(this.users[index]);
          console.log('User deactivated successfully');
        }
      })
      .catch((error) => {
        console.error('Error deactivating user:', error);
      });
  }

  deleteUser(uid: string) {
    this.firebaseService
      .deleteUser(uid)
      .then(() => {
        // Remove the deleted user from the users array
        this.users = this.users.filter((user) => user.uid !== uid);

        // Remove the deleted user from the activeUsers array if present
        this.activeUsers = this.activeUsers.filter((user) => user.uid !== uid);

        // Remove the deleted user from the deactivatedUsers array if present
        this.deactivatedUsers = this.deactivatedUsers.filter(
          (user) => user.uid !== uid
        );

        console.log('User deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
  }
}
