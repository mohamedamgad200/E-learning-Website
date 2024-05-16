import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentUploadeAssignmentComponent } from './student-uploade-assignment.component';

describe('StudentUploadeAssignmentComponent', () => {
  let component: StudentUploadeAssignmentComponent;
  let fixture: ComponentFixture<StudentUploadeAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentUploadeAssignmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentUploadeAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
