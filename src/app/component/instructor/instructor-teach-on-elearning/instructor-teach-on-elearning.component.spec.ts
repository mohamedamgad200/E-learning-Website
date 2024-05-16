import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorTeachOnElearningComponent } from './instructor-teach-on-elearning.component';

describe('InstructorTeachOnElearningComponent', () => {
  let component: InstructorTeachOnElearningComponent;
  let fixture: ComponentFixture<InstructorTeachOnElearningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstructorTeachOnElearningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstructorTeachOnElearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
