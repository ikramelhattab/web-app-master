import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EqpImgModalComponent } from './eqp-img-modal.component';

describe('EqpImgModalComponent', () => {
  let component: EqpImgModalComponent;
  let fixture: ComponentFixture<EqpImgModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EqpImgModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EqpImgModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
