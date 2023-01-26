import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BackendService } from 'src/app/services/backend.service';


@Component({
  selector: 'new-perimeter-dialog',
  templateUrl: './new-perimeter-dialog.component.html',
  styleUrls: ['./new-perimeter-dialog.component.scss']
})
export class NewPerimeterDialogComponent implements OnInit {

  periForm: FormGroup;
  file?: File;
  loading = false;


  constructor(
    public dialogRef: MatDialogRef<NewPerimeterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private backendService: BackendService,
  ) {

    this.periForm = this.formBuilder.group({
      code: ['', [Validators.required]],
      description: ['', [Validators.required]],
      statut: [null, [Validators.required]],
      photoUrl: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  onFileChange(event: any) {
    this.file = event.target.files[0];
    this.periForm.controls['photoUrl'].setValue(this.file ? this.file.name : '');
  }

  onSubmit(): any {
    this.periForm.markAllAsTouched();
    if (this.periForm.invalid || !this.file || this.loading) {
      return;
    }
    this.loading = true;
    this.backendService.addPeri(this.periForm?.value.code, this.periForm?.value.description,
      this.periForm?.value.statut, this.file).subscribe((newPeri: any) => {
        this.dialogRef.close(newPeri);
        this.backendService.showSuccessDialog('Perimétre ajouté avec succès', '');
        this.loading = false;
      }, (err) => {
        console.error(err);
        this.backendService.showErrorDialog('Echec d\'ajout du périmètre',
         'Vérifier que le code de périmètre n\'est pas déjà réservé et réessayer ultérieurement');
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
  get f() { return this.periForm?.controls; }

}
