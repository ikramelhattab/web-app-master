import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaksComponent } from './leaks.component';

describe('LeaksComponent', () => {
  let component: LeaksComponent;
  let fixture: ComponentFixture<LeaksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
