import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCourseMaterialComponent } from './student-course-material.component';

describe('StudentCourseMaterialComponent', () => {
  let component: StudentCourseMaterialComponent;
  let fixture: ComponentFixture<StudentCourseMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentCourseMaterialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentCourseMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
