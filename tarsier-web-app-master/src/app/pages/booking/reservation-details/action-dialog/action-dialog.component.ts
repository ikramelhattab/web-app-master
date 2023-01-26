import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-simple-dialog',
  templateUrl: './action-dialog.component.html',
  styleUrls: ['./action-dialog.component.scss']
})
export class ActionDialogComponent implements OnInit {

  actionForm: FormGroup | undefined;
  

  constructor(
    public dialogRef: MatDialogRef<ActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) { }


  ngOnInit(): void {
    this.actionForm = this.formBuilder.group({
      formPilote: [this.data[13]],
      formDelais: [this.data[14]],
      formDesc: [this.data[15]],
      formCout: [this.data[16]],
      formStatut: [this.data[17]],
    });
  }


  onConfirmClick() {
    this.dialogRef.close({
      pilote: this.actionForm?.value.formPilote,
      delais: this.actionForm?.value.formDelais,
      description: this.actionForm?.value.formDesc,
      cout: this.actionForm?.value.formCout,
      statut: this.actionForm?.value.formStatut
    });
  }

  onCancelClick(event: Event) {
    event.preventDefault();
    this.dialogRef.close();
  }


  // Convenience getter for easy access to form fields
  get f() { return this.actionForm?.controls; }

}
