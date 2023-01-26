import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BackendService } from './backend.service';
import { UserInfoService } from './user-info.service';

@Injectable({
  providedIn: 'root'
})

// This service is used to verify if the user is already logged in
export class PreloadService {

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private userInfoService: UserInfoService,
    private service: BackendService) { }

  public async initialiseApp() {
    this.httpClient.get(environment.serverUrl + '/auth/isLoggedIn', {
      withCredentials: true,
    }).subscribe(
      res => {
        if (res) {
          // Set user infos
          this.userInfoService.changeUser(res);
          // this.router.navigate(['/bookings']);
        }
      },
      err => {
        console.error(err);
        // Remove login cookie in production
        // TODO: only the server cans set login cookie
        if (!isDevMode()) {
          this.service.setCookie('login', '', 0);
        }
        
        // Remove user infos
        this.userInfoService.changeUser({});
        this.router.navigate(['/login']);
      });

  }
}

export function PreloadFactory(preloadService: PreloadService) {
  return () => preloadService.initialiseApp();
}
