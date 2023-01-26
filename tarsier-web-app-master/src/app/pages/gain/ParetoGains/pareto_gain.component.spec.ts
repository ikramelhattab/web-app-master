import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParetoGainComponent } from './pareto_gain.component';

describe('ParetoGainComponent', () => {
  let component: ParetoGainComponent;
  let fixture: ComponentFixture<ParetoGainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParetoGainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParetoGainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
