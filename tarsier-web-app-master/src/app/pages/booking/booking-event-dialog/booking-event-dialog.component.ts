import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-booking-event-dialog',
  templateUrl: './booking-event-dialog.component.html',
  styleUrls: ['./booking-event-dialog.component.scss']
})
export class BookingEventDialogComponent implements OnInit {

  bookingForm: FormGroup | undefined;
  loading = false;
  equips: Array<any> = [];
  perimeters: Array<any> = [];
  tyMission: Array<any> = [];
  statut: Array<any> = [];

  constructor(
    public dialogRef: MatDialogRef<BookingEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private backendService: BackendService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.backendService.getActivatedTypeMission().subscribe((res: any) => {
      this.tyMission = res;
    });

    this.backendService.getActivatedPeris().subscribe((res: any) => {
      this.perimeters = res;
    });

    this.backendService.getActivatedEquip().subscribe((res: any) => {
      this.equips = res;
    });


    this.bookingForm = this.formBuilder.group({
      typeMissionId: [this.data.typeMissionId, [Validators.required]],
      perimeterId: [this.data.perimeterId, [Validators.required]],
      equipId: [this.data.equipId, [Validators.required]],
      // statut:[this.data.statut, [Validators.required]],
      formStartDate: [this.data.startDay, [Validators.required]],
      formStartHour: [this.data.startHour, [Validators.required]],
      formEndDate: [this.data.endDay, [Validators.required]],
      formEndHour: [this.data.endHour, [Validators.required]]
    });
  }

  onCancelClick() {
    if (!this.loading) {
      this.dialogRef.close();
    }
  }

  onConfirmClick() {
    if (this.bookingForm?.invalid) {
      return;
    }

    const typeMissionId = this.bookingForm?.value.typeMissionId;
    const perimeterId = this.bookingForm?.value.perimeterId;
    const equipId = this.bookingForm?.value.equipId;
    const statut = "Planifée";

    const startDateStr = this.bookingForm?.value.formStartDate;
    const startHourStr = this.bookingForm?.value.formStartHour;
    const endDateStr = this.bookingForm?.value.formEndDate;
    const endHourStr = this.bookingForm?.value.formEndHour;

    const startDateArray = startDateStr.split('-');
    const startHourArray = startHourStr.split(':');
    const endDateArray = endDateStr.split('-');
    const endHourArray = endHourStr.split(':');

    const startYear = Number(startDateArray[0]);
    const startMonth = Number(startDateArray[1]) - 1;
    const startDay = Number(startDateArray[2]);
    const startHour = Number(startHourArray[0]);
    const startMinute = Number(startHourArray[1]);
    const endYear = Number(endDateArray[0]);
    const endMonth = Number(endDateArray[1]) - 1;
    const endDay = Number(endDateArray[2]);
    const endHour = Number(endHourArray[0]);
    const endMinute = Number(endHourArray[1]);

    const startDate = new Date(startYear, startMonth, startDay, startHour, startMinute);
    const endDate = new Date(endYear, endMonth, endDay, endHour, endMinute);

    const equipEl = this.equips.find((e) => e._id === equipId);
    const num_reservation = 'R-' + equipEl.code + '-' + this.timeResCode();

    this.loading = true;
    this.backendService.addReservation(startDate, endDate, num_reservation, typeMissionId, perimeterId, equipId, statut).subscribe(
      (addedBooking: any) => {
        this.dialogRef.close(addedBooking);
        this.router.navigate(['/reservationDetails'], { queryParams: { id: addedBooking._id } });
        this.backendService.showSuccessDialog('Réservation ajoutée avec succès', '');
      }, (err: any) => {
        this.loading = false;
        const backendError = err.error;
        if (backendError == 'overlapped') {
          this.backendService.showErrorDialog('Impossible d\'ajouter la réservation',
            'Il y a un chevauchement avec d\'autres réservations.');

        } else if (backendError == 'invalid start date') {
          this.backendService.showErrorDialog('Impossible d\'ajouter la réservation',
            'Date de début invalide.');
        }
        else {
          this.backendService.showErrorDialog('Impossible d\'ajouter la réservation',
            'Veuillez essayer à nouveau.');
        }
        console.error(err);
      });


  }


  // Convenience getter for easy access to form fields
  get f() { return this.bookingForm?.controls; }



  timeResCode(): string {
    const now = new Date();
    const day = ('0' + now.getDate()).slice(-2);
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const year = (now.getFullYear() + '').slice(-2);
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    return day + month + year + '-' + hour + minute + second;
  }


}
