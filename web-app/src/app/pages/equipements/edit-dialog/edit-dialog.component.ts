import { Component, Inject, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditEquipDialogComponent implements OnInit {

  editForm: FormGroup;
  getId: any;
  loading = false;
  initialising = true;

  confirmDelete = false;
  file?: File;

  typequips: Array<any> = [];
  isAdmin = true;

  constructor(
    public dialogRef: MatDialogRef<EditEquipDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private backendService: BackendService,
  ) {

    this.editForm = this.formBuilder.group({
      code: [this.data.eqp.code],
      description: [this.data.eqp.description],
      typeEquipId: [this.data.eqp.typeEquipId._id],
      facteur: [this.data.eqp.facteur],
      statut: [this.data.eqp.statut],
    });
  }

  onFileChange(event: any) {
    this.file = event.target.files[0];
  }

  ngOnInit(): void {
    this.backendService.GetAllTypesEquip().subscribe((res: any) => {
      this.typequips = res;
      let typeEqpExist = false;
      this.typequips.forEach(typeEqp => {
        if (typeEqp._id === this.data.eqp.typeEquipId._id) {
          typeEqpExist = true;
        }
      });
      if (!typeEqpExist) {
        this.typequips.push(this.data.eqp.typeEquipId);
      }
      this.initialising = false;
    });
  }

  onUpdate() {
    this.loading = true;
    this.backendService.updateEquip(this.data.eqp.id, this.editForm?.value.code,
      this.editForm?.value.typeEquipId, this.editForm?.value.description, this.editForm?.value.statut,
      this.editForm?.value.facteur, this.file)
      .subscribe(
        (updatedEq) => {
          if (updatedEq) {
            this.backendService.showSuccessDialog('Equipement mis à jour avec succès', '');
            this.dialogRef.close(updatedEq);
          } else {
            this.dialogRef.close(updatedEq);
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
      this.backendService.deleteEquip(this.data.eqp.id).subscribe((deletedEquip) => {
        this.backendService.showSuccessDialog('Equipement supprimé', '');
        this.dialogRef.close(deletedEquip);
        this.loading = false;
      }, (err) => {
        console.error(err);
        this.backendService.showErrorDialog('Échec de suppression d\'Equipement', 'Veuillez réessayer ultérieurement');
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
