import { Component, isDevMode, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';
import { UserInfoService } from 'src/app/services/user-info.service';

@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.scss']
})
export class CreatePasswordComponent implements OnInit {

  loginForm: FormGroup | undefined;
  loading = false;
  loginErrorMsg = '';
  userName = '';
  userEmail = '';
  userId = '';
  showPassword = false;
  showConfirmPassword = false;
  passwordPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}';

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

    this.userInfoService.currentUser.subscribe((user: any) => {
      this.userName = user.firstName + ' ' + user.lastName;
      this.userEmail = user.email;
      this.userId = user._id;
      this.loginForm = this.formBuilder.group({
        formPassword: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
        formEmail: [user.email, [Validators.required]],
        formConfirmPassword: ['', [Validators.required]],
        formAlwaysLogin: [false, []]
      }, { validator: this.passwordsValidator });
    });


  }


  submitLogin() {
    this.loginErrorMsg = '';
    if (this.loginForm?.invalid || this.loading) {
      return;
    }
    this.loading = true;
    const password = this.loginForm?.value.formPassword;
    const rememberme = this.loginForm?.value.formAlwaysLogin;

    this.service.createPasswordAndLogin(this.userEmail, password, rememberme).subscribe(

      (res: any) => {
        // Set user infos
        this.userInfoService.changeUser(res);
        // Set the stupid login cookie locally, because the navigator won't save
        // the one sent from the server in production (So strange !!!)
        // TODO only the server can set login cookie
        if (!isDevMode()) {
          this.service.setCookie('login', new Date().toString(), 30);
        }

        this.loading = false;
        this.router.navigate(['/bookings']);
      },

      err => {
        // Error login
        const backendError = err.error;
        if (typeof backendError === 'string') {
          this.loginErrorMsg = backendError;
        } else {
          this.loginErrorMsg = 'An unexpected error occurred, please try again later.';
        }
        this.service.showErrorDialog('Login error', this.loginErrorMsg);
        this.loading = false;
      });
  }



  passwordsValidator(frm: FormGroup): boolean {
    return frm.controls.formPassword === frm.controls.formConfirmPassword;
  }



  onShowPassClick(event: Event) {
    event.preventDefault();
    this.showPassword = !this.showPassword;
  }

  onShowConfirmPassClick(event: Event) {
    event.preventDefault();
    this.showConfirmPassword = !this.showConfirmPassword;
  }


  // convenience getter for easy access to form fields
  get f() { return this.loginForm?.controls; }

}
