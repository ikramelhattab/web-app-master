import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BackendService } from 'src/app/services/backend.service';
import { UserInfoService } from 'src/app/services/user-info.service';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss']
})
export class BookingDetailsComponent implements OnInit {
  fromStr = '';
  toStr = '';
  createdOnStr = '';
  currentUid: string = '';
  isAdmin = false;
  preparingToDelete = false;
  loadingDel = false;

  constructor(
    public dialogRef: MatDialogRef<BookingDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private backendService: BackendService,
    private userInfoService: UserInfoService
  ) { }

  ngOnInit(): void {
    // Get current user ID and isAdmin
    this.userInfoService.currentUser.subscribe((user: any) => {
      this.currentUid = user._id;
      this.isAdmin = user.isAdmin;
    });
    
    this.fromStr = this.backendService.toDate(this.data.start);
    this.toStr = this.backendService.toDate(this.data.end);
    this.createdOnStr = this.backendService.toDate(this.data.createdOn);
  }


  
  deleteRes() {
    if (!this.preparingToDelete) {
      this.preparingToDelete = true;
    } else {
      // The user confirm to delete
      this.loadingDel = true;
      this.backendService.deleteReservation(this.data.bookingId).subscribe(
        (res: any) => {
          this.loadingDel = false;
          this.dialogRef.close(this.data.bookingId);
      }, (err: any) => {
        console.error(err);
        this.loadingDel = false;
        this.backendService.showErrorDialog('Impossible de supprimer la reservation', 'Veuillez essayer à nouveau.');
      });

    }
  }

  onCancelClick() {
    if (!this.loadingDel) {
      this.dialogRef.close();
    }
  }

  onDetailsClick() {
    this.dialogRef.close();
  }

}
