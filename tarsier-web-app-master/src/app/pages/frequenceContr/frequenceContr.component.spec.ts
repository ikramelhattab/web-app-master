import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesMissionComponent } from './frequenceContr.component';

describe('PerimetersComponent', () => {
  let component: TypesMissionComponent;
  let fixture: ComponentFixture<TypesMissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypesMissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypesMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
