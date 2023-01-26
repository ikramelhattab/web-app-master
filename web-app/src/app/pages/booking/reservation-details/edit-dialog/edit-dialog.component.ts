import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {

  editForm: FormGroup | undefined;

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    let leakDate: Date;
    const leakDateStr = this.data[1];
    const daySplit = leakDateStr.split(' ')[0];
    const timeSplit = leakDateStr.split(' ')[1];
    let dayModel = '';
    let timeModel = '';
    if (leakDateStr.includes('-')) {
      const year = Number(daySplit.split('-')[0]);
      const month = Number(daySplit.split('-')[1]) - 1;
      const day = Number(daySplit.split('-')[2]);
      const hour = Number(timeSplit.split(':')[0]);
      const minute = Number(timeSplit.split(':')[1]);
      const second = Number(timeSplit.split(':')[2]);
      leakDate = new Date(year, month, day, hour, minute, second);
      dayModel = year + '-' + ('0' + (month + 1)).slice(-2) + '-' + ('0' + day).slice(-2);
      timeModel = ('0' + hour).slice(-2) + ':' + ('0' + minute).slice(-2);
    } else {
      const year = Number(daySplit.split('/')[2]);
      const month = Number(daySplit.split('/')[1]) - 1;
      const day = Number(daySplit.split('/')[0]);
      const hour = Number(timeSplit.split(':')[0]);
      const minute = Number(timeSplit.split(':')[1]);
      leakDate = new Date(year, month, day, hour, minute);
      dayModel = year + '-' + ('0' + (month + 1)).slice(-2) + '-' + ('0' + day).slice(-2);
      timeModel = ('0' + hour).slice(-2) + ':' + ('0' + minute).slice(-2);
    }

    // Prepare form
    this.editForm = this.formBuilder.group({
      name: [this.data[0], [Validators.required]],
      day: [dayModel, [Validators.required]],
      time: [timeModel, [Validators.required]],
      gain: [this.data[2]],
      dbRms: [this.data[3]],
      k: [this.data[4]],
      flow: [this.data[5]],
      cout: [this.data[6]],
      currency: [this.data[7]],
    });
  }


  onConfirmClick() {
    if (this.editForm?.invalid) {
      return;
    }
    // Regenerate leak date string
    let leakDateString: string;
    if (this.data[1].includes('/')) {
      const splittedDay = this.editForm?.value.day.split('-');
      leakDateString = splittedDay[2] + '/' + splittedDay[1] + '/' + splittedDay[0] + ' ' + this.editForm?.value.time;
    } else {
      leakDateString = this.editForm?.value.day + ' ' + this.editForm?.value.time;
    }

    this.dialogRef.close([
      this.editForm?.value.name,
      leakDateString,
      this.editForm?.value.gain,
      this.editForm?.value.dbRms,
      this.editForm?.value.k,
      this.editForm?.value.flow,
      this.editForm?.value.cout,
      this.editForm?.value.currency
    ]);
  }

  onCancelClick(event: Event) {
    event.preventDefault();
    this.dialogRef.close();
  }

  // Convenience getter for easy access to form fields
  get f() { return this.editForm?.controls; }


}
