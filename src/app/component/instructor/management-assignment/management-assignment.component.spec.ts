import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementAssignmentComponent } from './management-assignment.component';

describe('ManagementAssignmentComponent', () => {
  let component: ManagementAssignmentComponent;
  let fixture: ComponentFixture<ManagementAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagementAssignmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManagementAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
