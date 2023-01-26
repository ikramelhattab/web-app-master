import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeEquipementComponent } from './typeEquipement.component';

describe('PerimetersComponent', () => {
  let component: TypeEquipementComponent;
  let fixture: ComponentFixture<TypeEquipementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeEquipementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeEquipementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
