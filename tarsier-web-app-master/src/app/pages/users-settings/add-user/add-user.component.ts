import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  addUserForm: FormGroup | undefined;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  // passwordPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}';
  loading = false;
  // showPassword = false;

  constructor(
    public dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private backendService: BackendService
  ) { }



  ngOnInit(): void {
    this.addUserForm = this.formBuilder.group({
      formLastName: ['', [Validators.required]],
      formFirstName: ['', [Validators.required]],
      formEmail: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    })
  }


  onConfirmClick() {
    if (this.addUserForm?.invalid || this.loading) {
      return;
    }

    this.loading = true;
    this.backendService.registerUser(this.addUserForm?.value.formFirstName, this.addUserForm?.value.formLastName,
      this.addUserForm?.value.formEmail).subscribe(
        (addedUser: any) => {
          this.dialogRef.close(addedUser);
      }, (err: any) => {
        this.loading = false;
        const backendError = err.error;
        if (backendError == 'Email already exists') {
          this.backendService.showErrorDialog('Échec d\'ajouter un utilisateur', 'L\'email est reservé.');
        } else {
          this.backendService.showErrorDialog('Échec d\'ajouter un utilisateur', 'Veuillez vérifier vos données et essayer à nouveau.')
        }
        console.error(err);
      });
  }


  onCancelClick() {
    if (!this.loading) {
      this.dialogRef.close();
    }
  }


  // Convenience getter for easy access to form fields
  get f() { return this.addUserForm?.controls; }

}
