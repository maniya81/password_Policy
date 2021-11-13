import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevExComponent } from './dev-ex.component';

describe('DevExComponent', () => {
  let component: DevExComponent;
  let fixture: ComponentFixture<DevExComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevExComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevExComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
