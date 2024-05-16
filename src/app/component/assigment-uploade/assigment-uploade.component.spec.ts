import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigmentUploadeComponent } from './assigment-uploade.component';

describe('AssigmentUploadeComponent', () => {
  let component: AssigmentUploadeComponent;
  let fixture: ComponentFixture<AssigmentUploadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssigmentUploadeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssigmentUploadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
