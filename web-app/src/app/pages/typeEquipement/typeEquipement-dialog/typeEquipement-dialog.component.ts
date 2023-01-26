import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-simple-dialog',
  templateUrl: './typeEquipement-dialog.component.html',
  styleUrls: ['./typeEquipement-dialog.component.scss']
})
export class typeEquipementDialogComponent implements OnInit {

  TypeEqForm: FormGroup;
  loading = false;


  constructor(
    public dialogRef: MatDialogRef<typeEquipementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private backendService: BackendService
  ) {
    this.TypeEqForm = this.formBuilder.group({
      typeEquip: ['', [Validators.required]],
      description: [''],
      statut: [null, [Validators.required]],
    });
  }




  ngOnInit(): void {
  }



  onSubmit() {
    this.TypeEqForm.markAllAsTouched();
    if (this.TypeEqForm.invalid || this.loading) {
      return;
    }

    this.loading = true;
    this.backendService.addTypeEquip(
      this.TypeEqForm?.value.typeEquip,
      this.TypeEqForm.value.description,
      this.TypeEqForm.value.statut).subscribe((newtypeEquip: any) => {
        this.dialogRef.close(newtypeEquip);
        this.backendService.showSuccessDialog('Type de Equipement ajouté avec succès', '');
        this.loading = false;
      }, (err) => {
        console.error(err);
        this.backendService.showErrorDialog('Echec d\'ajout d\'un nouveau Type de Equipement',
          'Veuillez réessayer ultérieuerment');
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


  // Convenience getter for easy access to form fields
  get f() { return this.TypeEqForm?.controls; }

}
