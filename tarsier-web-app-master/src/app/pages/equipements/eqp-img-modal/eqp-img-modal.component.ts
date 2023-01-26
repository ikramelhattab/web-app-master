import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-eqp-img-modal',
  templateUrl: './eqp-img-modal.component.html',
  styleUrls: ['./eqp-img-modal.component.scss']
})
export class EqpImgModalComponent implements OnInit {

  constructor(
    public dilaoRef: MatDialogRef<EqpImgModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  onCancelClick(event: Event) {
    this.dilaoRef.close();
  }
}
