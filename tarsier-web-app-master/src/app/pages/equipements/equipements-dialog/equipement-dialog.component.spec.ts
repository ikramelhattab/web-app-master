import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipementDialogComponent } from './equipement-dialog.component';

describe('EquipementDialogComponent', () => {
  let component: EquipementDialogComponent;
  let fixture: ComponentFixture<EquipementDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquipementDialogComponent ]
    })
    .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(EquipementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
