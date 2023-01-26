import { ComponentFixture, TestBed } from '@angular/core/testing';

import { typeEquipementDialogComponent } from './typeEquipement-dialog.component';

describe('typeEquipementDialogComponent', () => {
  let component: typeEquipementDialogComponent;
  let fixture: ComponentFixture<typeEquipementDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ typeEquipementDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(typeEquipementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
