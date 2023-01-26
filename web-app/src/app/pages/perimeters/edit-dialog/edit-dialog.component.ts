import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditPeriDialogComponent implements OnInit {

  editForm: FormGroup;
  getId: any;
  perimeters: any;
  file?: File;
  loading = false;

  confirmDelete = false;

  isAdmin = true;
  
  constructor(
    public dialogRef: MatDialogRef<EditPeriDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private backendService: BackendService
  ) {
    this.editForm = this.formBuilder.group({
      code: [this.data.code],
      description: [this.data.description],
      statut: [this.data.statut],
    });
  }

  ngOnInit(): void {}



  onFileChange(event: any) {
    this.file = event.target.files[0];
  }



  onUpdate(): any {
    this.loading = true;
    this.backendService.updatePerimeter(this.data.id, this.editForm?.value.code, this.editForm?.value.description,
      this.editForm.value.statut, this.file)
      .subscribe((updatedPeri) => {
        if (updatedPeri) {
          this.backendService.showSuccessDialog('Perimétre mis à jour avec succès', '');
          this.dialogRef.close(updatedPeri);
        } else {
          this.dialogRef.close(updatedPeri);
        }
        this.loading = false;
      }, (err) => {
        console.error(err);
        this.backendService.showErrorDialog('Echec de mise à jour du périmètre',
          'Vérifier que le code du périmètre n\'est pas déjà utilisé et réessayer ultérieurement.');
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
      this.backendService.deletePerimeter(this.data.id).subscribe((deletedPeri) => {
        this.backendService.showSuccessDialog('Perimétre supprimé', '');
        this.dialogRef.close(deletedPeri);
        this.loading = false;
      }, (err) => {
        console.error(err);
        this.backendService.showErrorDialog('Échec de suppression du périmètre', 'Veuillez réessayer ultérieurement');
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
