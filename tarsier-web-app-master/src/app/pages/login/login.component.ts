import { CompileTemplateMetadata } from '@angular/compiler';
import { Component, isDevMode, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';
import { UserInfoService } from 'src/app/services/user-info.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup | undefined;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  passwordPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}'
  loading = false;
  loginErrorMsg = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: BackendService,
    private userInfoService: UserInfoService
  ) {
    if (service.checkCookie('login')) {
      router.navigate(['/bookings']);
    }
  }


  ngOnInit(): void {

    this.loginForm = this.formBuilder.group({
      formEmail: ['', [
        Validators.required,
        Validators.pattern(this.emailPattern)]],
    });
  }


  submitLogin() {
    this.loginErrorMsg = '';
    if (this.loginForm?.invalid || this.loading) {
      return;
    }
    this.loading = true;
    const email = this.loginForm?.value.formEmail;

    this.service.doesUserHavePassword(email).subscribe(

      (res: any) => {
        if (res.passwordExist) {
          // The user does have a password redirect them to EnterPasswordComponent
          // Pass user info
          this.userInfoService.changeUser(res.user);
          this.router.navigate(['/enter-password']);
        } else {
          // The user does NOT have a password yet, redirect them to CreatePasswordComponent
          this.userInfoService.changeUser(res.user);
          this.router.navigate(['/create-password']);
        }
        this.loading = false;
      },

      err => {
        // Error login
        if (err.error === 'Email does not exist') {
          this.service.showErrorDialog('Pas de compte associé avec cet email',
            'Si vous n\'avez pas un compte, veuillez demander à votre administrateur d\'en créer un.');
        } else {
          this.service.showErrorDialog('Une erreur inattendue est survenue', 'Veuillez réessayer ultérieurement');
        }
        this.loading = false;
      });


  }


  // convenience getter for easy access to form fields
  get f() { return this.loginForm?.controls; }


}
