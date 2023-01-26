import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingEventDialogComponent } from './booking-event-dialog.component';

describe('BookingEventDialogComponent', () => {
  let component: BookingEventDialogComponent;
  let fixture: ComponentFixture<BookingEventDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingEventDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
