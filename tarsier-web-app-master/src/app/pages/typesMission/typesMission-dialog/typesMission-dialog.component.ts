import { Component, Inject, OnInit, NgZone,ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BackendService } from 'src/app/services/backend.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserInfoService } from 'src/app/services/user-info.service';

@Component({
  selector: 'app-simple-dialog',
  templateUrl: './typesMission-dialog.component.html',
  styleUrls: ['./typesMission-dialog.component.scss']
})
export class TypesMissionDialogComponent implements OnInit {

  TypeMissionForm: FormGroup | undefined;

  @ViewChild('imageInput', { static: false }) imageInput: any;

  constructor(
    public dialogRef: MatDialogRef<TypesMissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private backendService: BackendService
  ) 
  {
    this.TypeMissionForm = this.formBuilder.group({
      typeMission: ['', [Validators.required]],
      description: ['', [Validators.required]],
      statut: [null, [Validators.required]],
    });
  }
  
  


  ngOnInit(): void {

    // this.userInfoService.currentUser.subscribe((currentUser: any) => {
      
    //   this.TypeMissionForm = this.formBuilder.group({
    //     typeMission: ['', [Validators.required]],
    //     description: ['', [Validators.required]],
    //     statut: ['', [Validators.required]],
    //     createdBy: [currentUser.firstName + ' ' + currentUser.lastName, [Validators.required]] //['user', [Validators.required]] //[ currentUser.firstName + ' ' + currentUser.lastName,, [Validators.required]]
    //   })
    // });
  
  }

  onSubmit() {
    this.TypeMissionForm?.markAllAsTouched();
    if (this.TypeMissionForm?.invalid) {
      return;
    }
    this.backendService.addTypeMission(this.TypeMissionForm?.value.typeMission, this.TypeMissionForm?.value.description,
      this.TypeMissionForm?.value.statut).subscribe((newTM: any) => {
        this.dialogRef.close(newTM);
        this.backendService.showSuccessDialog('Perimétre ajouté avec succès', '');
      }, (err) => {
        console.error(err);
        this.backendService.showErrorDialog('Echec d\'ajout du périmètre',
         'Vérifier que le code de périmètre n\'est pas déjà réservé ou réessayer ultérieurement' );
      });
  }


  onCancelClick(event: Event) {
    event.preventDefault();
    this.dialogRef.close();
  }

  // Convenience getter for easy access to form fields
  get f() { return this.TypeMissionForm?.controls; }

}
