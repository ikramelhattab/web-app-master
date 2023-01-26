import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  editUserForm: FormGroup | undefined;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  loading = true;
  loadingDel = false;

  isAdmin = true;
  preparingToDelete = false;



  constructor(
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private backendService: BackendService
  ) { }



  ngOnInit(): void {
    const userId = this.data.id;
    this.backendService.getOneUser(userId).subscribe(
      (user: any) => {
        this.isAdmin = user.isAdmin;
        this.editUserForm = this.formBuilder.group({
          formLastName: [user.lastName, []],
          formFirstName: [user.firstName, []],
          formEmail: [user.email, [Validators.pattern(this.emailPattern)]],
        });
        this.loading = false;
      }, (err: any) => {
        console.error(err);
        this.dialogRef.close();
        this.backendService.showErrorDialog('Une erreur inattendue est survenue', 'Veuillez essayer à nouveau plus tard');
        this.loading = false;
      });
  }


  onConfirmClick() {
    if (this.editUserForm?.invalid || this.loading) {
      return;
    }
    this.loading = true;
    this.backendService.updateOneUser(this.data.id, this.editUserForm?.value.formFirstName,
      this.editUserForm?.value.formLastName, this.editUserForm?.value.formEmail)
      .subscribe(
        (updatedUser: any) => {
          this.loading = false;
          this.dialogRef.close(updatedUser);
        }, (err: any) => {
          console.error(err);
          const backenError = err.error;
          if (backenError == 'Email already exists') {
            this.backendService.showErrorDialog('Impossible de mettre à jour',
              'Le nouveau email est déjà utilisé par un autre utilisateur.');
          } else {
            this.backendService.showErrorDialog('Impossible de mettre à jour',
              'Une erreur inattendue est survenue, veuiller verifier vos données et essayer à nouveau');
          }

          this.dialogRef.close();
          this.loading = false;
        });
  }


  deleteUser() {
    if (!this.preparingToDelete) {
      this.preparingToDelete = true;
    } else {
      // The user confirms to delete
      this.loadingDel = true;
      this.backendService.deleteOneUser(this.data.id).subscribe(
        (deleteUser) => {
          this.dialogRef.close('deleted');
          this.loadingDel = false;
        }, (err: any) => {
          this.backendService.showErrorDialog('Impossible de supprimer cet utilisateur',
            'Une erreur inattendue est survenue, veuiller essayer à nouveau.');
          this.dialogRef.close();
          console.error(err);
          this.loadingDel = false;
        });
    }
  }


  onCancelClick() {
    if (!this.loading && !this.loadingDel) {
      this.dialogRef.close();
    }
  }


  // Convenience getter for easy access to form fields
  get f() { return this.editUserForm?.controls; }

}
