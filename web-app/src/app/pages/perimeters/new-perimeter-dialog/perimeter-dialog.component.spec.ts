import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPerimeterDialogComponent } from './new-perimeter-dialog.component';

describe('PerimeterDialogComponent', () => {
  let component: NewPerimeterDialogComponent;
  let fixture: ComponentFixture<NewPerimeterDialogComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPerimeterDialogComponent ]
    })
    .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(NewPerimeterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
