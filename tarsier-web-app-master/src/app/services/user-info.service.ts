import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  private userSource = new BehaviorSubject({});
  currentUser = this.userSource.asObservable();

  constructor() { }

  changeUser(user: any) {
    this.userSource.next(user);
  }
}
