import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringPrograssComponent } from './monitoring-prograss.component';

describe('MonitoringPrograssComponent', () => {
  let component: MonitoringPrograssComponent;
  let fixture: ComponentFixture<MonitoringPrograssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonitoringPrograssComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonitoringPrograssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
