import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTypeEquipementDialogComponent } from './edit-dialog.component';

describe('EditTypeEquipementDialogComponent', () => {
  let component: EditTypeEquipementDialogComponent;
  let fixture: ComponentFixture<EditTypeEquipementDialogComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTypeEquipementDialogComponent ]
    })
    .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(EditTypeEquipementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
