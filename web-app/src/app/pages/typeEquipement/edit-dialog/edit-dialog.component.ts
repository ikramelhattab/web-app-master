import { Component, Inject, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BackendService } from 'src/app/services/backend.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserInfoService } from 'src/app/services/user-info.service';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditTypeEquipementDialogComponent implements OnInit {

  editForm: FormGroup;
  
  public typeequips: Array<any> = [];

  loading = false;
  confirmDelete = false;

  isAdmin = true;
  constructor(
    public dialogRef: MatDialogRef<EditTypeEquipementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private backendService: BackendService,
    private activatedRoute: ActivatedRoute,
    private ngZone: NgZone,
    private router: Router,
    private userInfoService: UserInfoService

  ) {
  
    this.editForm = this.formBuilder.group({
      typeEquip: [this.data.typeEquip],
      description: [this.data.description],
      statut: [this.data.statut],
    });
   }


  ngOnInit(): void {
  }

  onUpdate() {
    this.loading = true;
    this.backendService.updateTypeEquip(this.data.id,
      this.editForm?.value.typeEquip, this.editForm?.value.description, this.editForm?.value.statut)
      .subscribe(
        (updatedtypeEq: any) => {
          if (updatedtypeEq) {
            this.backendService.showSuccessDialog('Perimétre mis à jour avec succès', '');
            this.dialogRef.close(updatedtypeEq);
          } else {
            this.dialogRef.close(updatedtypeEq);
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
      this.backendService.deleteTypeEquip(this.data.id).subscribe((deletedTEq) => {
        this.backendService.showSuccessDialog('Perimétre supprimé', '');
        this.dialogRef.close(deletedTEq);
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
