import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPeriDialogComponent } from './edit-dialog.component';

describe('EditPeriDialogComponent', () => {
  let component: EditPeriDialogComponent;
  let fixture: ComponentFixture<EditPeriDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPeriDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPeriDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
