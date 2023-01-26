import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTypesMissionDialogComponent } from './edit-dialog.component';

describe('EditTypesMissionDialogComponent', () => {
  let component: EditTypesMissionDialogComponent;
  let fixture: ComponentFixture<EditTypesMissionDialogComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTypesMissionDialogComponent ]
    })
    .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(EditTypesMissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
