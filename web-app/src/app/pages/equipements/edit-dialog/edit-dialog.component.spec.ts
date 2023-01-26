import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEquipDialogComponent } from './edit-dialog.component';

describe('EditEquipDialogComponent', () => {
  let component: EditEquipDialogComponent;
  let fixture: ComponentFixture<EditEquipDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEquipDialogComponent ]
    })
    .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(EditEquipDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
