import { Component, Inject, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BackendService } from 'src/app/services/backend.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditTypesMissionDialogComponent implements OnInit {

  editForm: FormGroup;
  getId: any;
  public typesMission: Array<any> = [];
  loading = false;
  confirmDelete = false;

  isAdmin = true;
  constructor(
    public dialogRef: MatDialogRef<EditTypesMissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private backendService: BackendService,
    private activatedRoute: ActivatedRoute,
    private ngZone: NgZone,
    private router: Router,
  ) {
    this.editForm = this.formBuilder.group({
      statut: [this.data.statut],
    });


  }



  ngOnInit(): void {

  }

  onUpdate() {

    this.loading = true;
    this.backendService.updateTypeMission(this.data.id,this.editForm?.value.statut)
      .subscribe(
        (updatedtypeM: any) => {
          if (updatedtypeM) {
            this.backendService.showSuccessDialog('Type Mission mis à jour avec succès', '');
            this.dialogRef.close(updatedtypeM);
          } else {
            this.dialogRef.close(updatedtypeM);
          }
          this.loading = false;
        }, (err: any) => {
          console.error(err);
          this.backendService.showErrorDialog('Impossible de mettre à jour',
            'Une erreur inattendue est survenue, veuiller verifier vos données et essayer à nouveau');
          this.loading = false;
        });
   
  }

 

  onCancelClick(event: Event) {
    if (this.loading) {
      return;
    }
    event.preventDefault();
    this.dialogRef.close();
  }


  onDeleteClick(event: Event) {
    event.preventDefault();
    if (this.confirmDelete) {
      this.loading = true;
      this.backendService.deleteTypeMiss(this.data.id).subscribe((deletedTM) => {
        this.backendService.showSuccessDialog('Perimétre supprimé', '');
        this.dialogRef.close(deletedTM);
        this.loading = false;
      }, (err) => {
        console.error(err);
        this.backendService.showErrorDialog('Échec de suppression du type d\'équipement', 'Veuillez réessayer ultérieurement');
      });
    }
    this.confirmDelete = true;
  }

  cancelDelete() {
    this.confirmDelete = false;
  }

  // Convenience getter for easy access to form fields
  get f() { return this.editForm?.controls; }


}
