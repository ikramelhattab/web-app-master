import { Component, Inject, OnInit, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-simple-dialog',
  templateUrl: './equipement-dialog.component.html',
  styleUrls: ['./equipement-dialog.component.scss']
})
export class EquipementDialogComponent implements OnInit {

  EquipForm: FormGroup | undefined;
  file?: File;
  loading = false;
  initialising = true;

  typequips: Array<any> = [];

  @ViewChild('imageInput', { static: false }) imageInput: any;

  constructor(
    public dialogRef: MatDialogRef<EquipementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private backendService: BackendService,
  ) {

    this.EquipForm = this.formBuilder.group({
      code: ['', [Validators.required]],
      description: ['', [Validators.required]],
      typeEquipId: ['', [Validators.required]],
      facteur: [null, [Validators.required]],
      statut: [null, [Validators.required]],
      photoUrl: ['', [Validators.required]]
    });
  }


  ngOnInit(): void {

    this.backendService.GetAllTypesEquip().subscribe((res: any) => {
      this.typequips = res;
      this.initialising = false;
    });

  }


  onFileChange(event: any) {
    this.file = event.target.files[0];
    this.EquipForm?.controls['photoUrl'].setValue(this.file ? this.file.name : '');
  }



  onSubmit() {
    this.EquipForm?.markAllAsTouched();
    if (this.EquipForm?.invalid || !this.file || this.loading) {
      return;
    }

    this.loading = true;
    this.backendService.addEquip(this.EquipForm?.value.code, this.EquipForm?.value.description,
      this.EquipForm?.value.typeEquipId, this.EquipForm?.value.statut, this.file,
      this.EquipForm?.value.facteur).subscribe((newEquip: any) => {
        this.dialogRef.close(newEquip);
        this.backendService.showSuccessDialog('Equipement ajouté avec succès', '');
        this.loading = false;
      }, (err) => {
        console.error(err);
        this.backendService.showErrorDialog('Echec d\'ajout d\'équipement',
          'Vérifier que le code d\'équipement n\'est pas déjà réservé ou réessayer ultérieurement');
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
  get f() { return this.EquipForm?.controls; }

}
