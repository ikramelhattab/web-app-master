import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { MaterialDialogComponent } from '../containers/material-dialog/material-dialog.component';
import { forkJoin } from 'rxjs';
import { Observable, throwError } from 'rxjs';



@Injectable({
  providedIn: 'root'
})

export class BackendService {


  toDate = ((date: number | Date) => {
    if (typeof date === 'number') {
      const d = new Date(date);
      return d.toLocaleDateString('fr-FR') + ', ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else {
      const d = new Date(date);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('fr-FR') + ', ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      }
    }
    return '---';
  });


  toDateCsv = ((date: number | Date) => {
    if (typeof date === 'number') {
      const d = new Date(date);
      return d.toLocaleDateString('fr-FR') + ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else {
      const d = new Date(date);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('fr-FR') + ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      }
    }
    return '---';
  });




  constructor(private httpClient: HttpClient, public dialog: MatDialog) {

  }

  /**
   * Test if user already have a password or not
   * @param email 
   * @returns 
   */
  doesUserHavePassword(email: string) {
    return this.httpClient.post(environment.serverUrl + '/auth/doesUserHavePassword',
      { email: email }, { withCredentials: true });
  }


  /**
   * Login to the app
   * @param mail string
   * @param password string
   * @param rememberme boolean
   * @returns 
   */
  login(mail: string, password: string, rememberme: boolean) {
    return this.httpClient.post(environment.serverUrl + '/auth/login', {
      email: mail,
      password: password,
      rememberme: rememberme
    }, {
      withCredentials: true,
    });
  }


  /**
   * Create password and login
   * When the user try to login for the first time
   * @param mail 
   * @param password 
   * @param rememberme 
   * @returns 
   */
  createPasswordAndLogin(mail: string, password: string, rememberme: boolean) {
    return this.httpClient.post(environment.serverUrl + '/auth/createPasswordAndLogin', {
      email: mail,
      password: password,
      rememberme: rememberme
    }, {
      withCredentials: true,
    });
  }


  /**
   * Verify if the user is logged in
   * @returns 
   */
  isLoggedIn() {
    return this.httpClient.get(environment.serverUrl + '/auth/isLoggedIn', {
      withCredentials: true,
    });
  }


  /**
   * Logout session
   * @returns 
   */
  signOut() {
    return this.httpClient.post(environment.serverUrl + '/auth/logOut',
      {},
      { withCredentials: true });
  }


  /**
   * Get users list
   * @returns 
   */
  getUsersList(orderByColName: string, orderDir: string, pageNumber: number, pageSize: number, filter: string) {
    const params = new HttpParams()
      .set('orderBy', orderByColName)
      .set('orderDir', orderDir)
      .set('page', pageNumber)
      .set('pageSize', pageSize)
      .set('filter', filter);
    return this.httpClient.get(environment.serverUrl + '/auth/users', { withCredentials: true, params: params });
  }



  /**
   * Register new user by the admin
   * @param firstName string
   * @param lastName string
   * @param email string
   * @returns Observable
   */
  registerUser(firstName: string, lastName: string, email: string) {
    return this.httpClient.post(environment.serverUrl + '/auth/registerUser', {
      firstName: firstName,
      lastName: lastName,
      email: email,
    }, { withCredentials: true });
  }


  /**
   * Get user details from id
   * @param userId string
   * @returns Observable
   */
  getOneUser(userId: string) {
    return this.httpClient.post(environment.serverUrl + '/auth/users/one',
      { id: userId },
      { withCredentials: true });
  }


  /**
   * Update one user
   * @param userId string
   * @param firstName string
   * @param lastName string
   * @param email string
   * @returns 
   */
  updateOneUser(userId: string, firstName: string, lastName: string, email: string) {
    return this.httpClient.post(environment.serverUrl + '/auth/users/updateOne', {
      id: userId,
      firstName: firstName,
      lastName: lastName,
      email: email,
    }, { withCredentials: true });
  }


  /**
   * Delete user by id
   * @param userId string
   * @returns 
   */
  deleteOneUser(userId: string) {
    return this.httpClient.post(environment.serverUrl + '/auth/users/deleteOne', {
      id: userId
    }, { withCredentials: true });
  }





  /**
   * Get reservations list from the server between fromDate and toDate
   * For the calendar
   * 
   * @param fromDate Date
   * @param toDate Date
   * @returns 
   */
  getReservations(fromDate: Date, toDate: Date) {
    return this.httpClient.get(environment.serverUrl + `/booking/list/${fromDate}/${toDate}`,
      { withCredentials: true });
  }




  /**
   * Get single reservation
   * @param id 
   * @returns 
   */
  getOneReservations(id: String): Observable<any> {
    return this.httpClient.get(environment.serverUrl + `/booking/getBooking/${id}`,
      { withCredentials: true });
  }


  /**
 *   // Update Booking
 * @param id 
 * @param statut 
 * @returns 
 */
  updateBookingStatut(id: String, statut: string): Observable<any> {
    let API_URL = (environment.serverUrl + `/booking/updateStatut`);
    return this.httpClient.put(API_URL, {
      id: id,
      statut: statut
    },
      { withCredentials: true });
  }


  /**
   * Get reservations list from the server 
   * with pagination
   * 
   * @param orderByColName 
   * @param orderDir 
   * @param pageNumber 
   * @param pageSize 
   * @param filter 
   * @returns 
   */
  getAllReservations(orderByColName: string, orderDir: string, pageNumber: number, pageSize: number, filter: string) {
    const params = new HttpParams()
      .set('orderBy', orderByColName)
      .set('orderDir', orderDir)
      .set('page', pageNumber)
      .set('pageSize', pageSize)
      .set('filter', filter)
    return this.httpClient.get(environment.serverUrl + `/booking/getAllBooking`,
      { withCredentials: true, params: params });
  }



  /**
   * Delete a booking
   * @param id string
   * @returns 
   */
  deleteReservation(id: string) {
    return this.httpClient.post(environment.serverUrl + '/booking/delete',
      { bookingId: id },
      { withCredentials: true });
  }



  /**
   * Add booking
   * @param start Date
   * @param end Date
   * @param num_reservation String
   * @param typeMissionId String
   * @param perimeterId String
   * @param equipId String
   * @param statut String
   * @returns 
   */
  addReservation(start: Date, end: Date, num_reservation: String, typeMissionId: String, perimeterId: String, equipId: String, statut: String) {
    return this.httpClient.post(environment.serverUrl + '/booking/add',
      {
        start: start,
        end: end,
        num_reservation: num_reservation,
        typeMissionId: typeMissionId,
        perimeterId: perimeterId,
        equipId: equipId,
        statut: statut
      },
      { withCredentials: true });
  }


  /**
   * Get gain data
   *  @param startDate date
   * @param endDate date
   * @returns 
   */
  getGainData(startDate: Date, endDate: Date) {
    let params = new HttpParams();

    if (this.isValidDate(startDate)) {
      params = params.append('start', startDate.toISOString());
    }
    if (this.isValidDate(endDate)) {
      params = params.append('end', endDate.toISOString());
    }
    return this.httpClient.get(
      environment.serverUrl + `/leak/gain`,
      { withCredentials: true, params: params });
  }






  /**
   * Upload missions with its leaks
   * @param missionsRows 
   * @param dateStr 
   * @param responsable 
   * @returns Promise
   */
  uploadMissions(missionsRows: Array<any>, dateStr: string, responsable: string) {
    return new Promise((resolve, reject) => {
      const dateStrSplit = dateStr.split('-');
      const missionsDate = new Date(Number(dateStrSplit[0]), Number(dateStrSplit[1]) - 1, Number(dateStrSplit[2]));

      // Creates fuite objects array 
      const leaksObjArr: Array<any> = [];

      missionsRows.forEach(row => {
        // Parse date fuite
        let dateFuite: Date;
        const dateFuiteStr: string = row[1];
        const dayStr = dateFuiteStr.split(' ')[0];
        const timeStr = dateFuiteStr.split(' ')[1];
        // Rarely date have format dd/mm/yyyy hh:mm
        // Most often date have format yyyy-mm-dd hh:mm:ss
        if (dateFuiteStr.includes('-')) {
          const year = Number(dayStr.split('-')[0]);
          const month = Number(dayStr.split('-')[1]) - 1;
          const day = Number(dayStr.split('-')[2]);
          const hour = Number(timeStr.split(':')[0]);
          const minute = Number(timeStr.split(':')[1]);
          const second = isNaN(Number(timeStr.split(':')[2])) ? 0 : Number(timeStr.split(':')[2]);
          dateFuite = new Date(year, month, day, hour, minute, second);
        } else {
          const year = Number(dayStr.split('/')[2]);
          const month = Number(dayStr.split('/')[1]) - 1;
          const day = Number(dayStr.split('/')[0]);
          const hour = Number(timeStr.split(':')[0]);
          const minute = Number(timeStr.split(':')[1]);
          dateFuite = new Date(year, month, day, hour, minute);
        }

        // Parse delai action date
        let delaiActionDate = undefined;
        if (row[14]) {
          const split = dateStr.split('-');
          delaiActionDate = new Date(Number(split[0]), Number(split[1]) - 1, Number(split[2]));
        }

        const leakObj = {
          leakName: row[0],
          leakDate: dateFuite,
          leakGain: Number(row[2]),
          leakDbRms: Number(row[3]),
          leakK: Number(row[4]),
          leakFlow: Number(row[5]),
          leakCost: Number(row[6]),
          leakCurrency: row[7],
          leakImgUrl: row[8],
          leakImgFile: row[9],
          leakCoord: row[11],
          leakPerimeter: row[12],
          actionPilote: row[13] ? row[13] : undefined,
          actionDelai: delaiActionDate ? delaiActionDate : undefined,
          actionDesc: row[15] ? row[15] : undefined,
          actionCost: row[16] ? row[16] : null,
        };
        leaksObjArr.push(leakObj);
      });

      // Group leaksObjArray by perimeter
      const groupByPerimeter = leaksObjArr.reduce((r, a) => {
        r[a.leakPerimeter] = r[a.leakPerimeter] || [];
        r[a.leakPerimeter].push(a);
        return r;
      }, Object.create(null));

      // Contains pairs like {perimeter: uploadedMissionId}
      const uploadedMissionsId: any = {};

      // Add post missions request to an array to call them simultaneously
      const postMissionsRequests: Array<any> = [];

      // Upload missions by perimeters
      for (let perimeter of Object.keys(groupByPerimeter)) {
        postMissionsRequests.push(
          this.httpClient.post(environment.serverUrl + '/mission/add-mission', {
            date: missionsDate,
            perimetre: perimeter,
            responsable: responsable
          }, { withCredentials: true })
        );
      }

      // Upload all missions simultaneously
      forkJoin(postMissionsRequests).subscribe(([...missionsAdded]) => {
        missionsAdded.forEach((mAdded: any) => {
          // Create missions IDs perimetre pairs
          uploadedMissionsId[mAdded.perimetre] = mAdded.id;
        });

        // Now post leaks after missions have been uploaded
        const leaksRequests: Array<any> = [];
        leaksObjArr.forEach(leak => {
          let formData: FormData = new FormData();
          formData.append('image', leak.leakImgFile);
          formData.append('leakName', leak.leakName);
          formData.append('bookingId', uploadedMissionsId[leak.leakPerimeter]);
          leak.leakDate && formData.append('leakDate', leak.leakDate);
          leak.leakGain && formData.append('leakGain', leak.leakGain);
          leak.leakDbRms && formData.append('leakDbRms', leak.leakDbRms);
          leak.leakK && formData.append('leakK', leak.leakK);
          leak.leakFlow && formData.append('leakFlow', leak.leakFlow);
          leak.leakCost && formData.append('leakCost', leak.leakCost);
          leak.leakCurrency && formData.append('leakCurrency', leak.leakCurrency);
          formData.append('leakCoordX', leak.leakCoord[0]);
          formData.append('leakCoordY', leak.leakCoord[1]);
          leak.actionPilote && formData.append('actionPilote', leak.actionPilote);
          leak.actionDelai && formData.append('actionDelai', leak.actionDelai);
          leak.actionDesc && formData.append('actionDesc', leak.actionDesc);
          leak.actionCost && formData.append('actionCost', leak.actionCost);

          // Prepare leaks post request array
          leaksRequests.push(
            this.httpClient.post(environment.serverUrl + '/leak/add-leak', formData,
              { withCredentials: true })
          );
        });

        // Upload all leaks simultaneously
        forkJoin(leaksRequests).subscribe(([...leaksAdded]) => {
          resolve(leaksAdded);
        }, error => {
          console.error('Error on posting leaks');
          console.error(error);
          reject(error);
        });

      }, error => {
        console.error('Error on posting missions');
        console.error(error);
        reject(error);
      });
    });
  }



  /**
   * Get leaks list of a specific booking
   * @param bookingId 
   * @returns 
   */
  getLeaksOfSpecificBooking(bookingId: string) {
    const params = new HttpParams()
      .set('bookingId', bookingId);
    return this.httpClient.get(
      environment.serverUrl + `/leak/specific-book-leaks`,
      { withCredentials: true, params: params }
    );
  }





  /**
   * Upload single leak when the user uploaded a csv content
   * @param leakRow 
   * @param bookingId 
   * @returns 
   */
  uploadLeak(leakRow: Array<any>, bookingId: string | undefined) {

    // Parse date fuite
    let dateFuite: Date;
    const dateFuiteStr: string = leakRow[1];
    const dayStr = dateFuiteStr.split(' ')[0];
    const timeStr = dateFuiteStr.split(' ')[1];
    // Rarely date have format dd/mm/yyyy hh:mm
    // Most often date have format yyyy-mm-dd hh:mm:ss
    if (dateFuiteStr.includes('-')) {
      const year = Number(dayStr.split('-')[0]);
      const month = Number(dayStr.split('-')[1]) - 1;
      const day = Number(dayStr.split('-')[2]);
      const hour = Number(timeStr.split(':')[0]);
      const minute = Number(timeStr.split(':')[1]);
      const second = isNaN(Number(timeStr.split(':')[2])) ? 0 : Number(timeStr.split(':')[2]);
      dateFuite = new Date(year, month, day, hour, minute, second);
    } else {
      const year = Number(dayStr.split('/')[2]);
      const month = Number(dayStr.split('/')[1]) - 1;
      const day = Number(dayStr.split('/')[0]);
      const hour = Number(timeStr.split(':')[0]);
      const minute = Number(timeStr.split(':')[1]);
      dateFuite = new Date(year, month, day, hour, minute);
    }

    // Parse delai action date
    let delaiActionDate = undefined;
    if (leakRow[14]) {
      const split = leakRow[14].split('-');
      delaiActionDate = new Date(Number(split[0]), Number(split[1]) - 1, Number(split[2]));
    }

    const leakObj: any = {
      leakName: leakRow[0],
      leakDate: dateFuite,
      leakGain: Number(leakRow[2]),
      leakDbRms: Number(leakRow[3]),
      leakK: Number(leakRow[4]),
      leakFlow: Number(leakRow[5]),
      leakCost: Number(leakRow[6]),
      leakCurrency: leakRow[7],
      leakImgUrl: leakRow[8],
      leakImgFile: leakRow[9],
      leakCoord: leakRow[11] ? leakRow[11] : undefined,
      leakPerimeter: leakRow[12] ? leakRow[12] : undefined,
      actionPilote: leakRow[13] ? leakRow[13] : undefined,
      actionDelai: delaiActionDate ? delaiActionDate : undefined,
      actionDesc: leakRow[15] ? leakRow[15] : undefined,
      actionCost: leakRow[16] ? leakRow[16] : null,
    };

    let formData: FormData = new FormData();
    formData.append('image', leakObj.leakImgFile);
    formData.append('leakName', leakObj.leakName);
    bookingId && formData.append('bookingId', bookingId);
    leakObj.leakDate && formData.append('leakDate', leakObj.leakDate);
    leakObj.leakGain && formData.append('leakGain', leakObj.leakGain);
    leakObj.leakDbRms && formData.append('leakDbRms', leakObj.leakDbRms);
    leakObj.leakK && formData.append('leakK', leakObj.leakK);
    leakObj.leakFlow && formData.append('leakFlow', leakObj.leakFlow);
    leakObj.leakCost && formData.append('leakCost', leakObj.leakCost);
    leakObj.leakCurrency && formData.append('leakCurrency', leakObj.leakCurrency);
    leakObj.leakCoord && formData.append('leakCoordX', leakObj.leakCoord[0]);
    leakObj.leakCoord && formData.append('leakCoordY', leakObj.leakCoord[1]);
    leakObj.actionPilote && formData.append('actionPilote', leakObj.actionPilote);
    leakObj.actionDelai && formData.append('actionDelai', leakObj.actionDelai);
    leakObj.actionDesc && formData.append('actionDesc', leakObj.actionDesc);
    leakObj.actionCost && formData.append('actionCost', leakObj.actionCost);

    return this.httpClient.post(environment.serverUrl + '/leak/add-leak', formData,
      { withCredentials: true });

  }





  /**
   * Get detailled leaks list from the server
   * with pagination, ordering and filtering
   * 
   * @param orderByColName 
   * @param orderDir 
   * @param pageNumber 
   * @param pageSize 
   * @param startDate 
   * @param endDate 
   * @param perimeter 
   * @param typeMission 
   * @param actionStatut 
   * @param actionType 
   * @param actionPilote 
   * @returns 
   */
  getAllLeaks(orderByColName: string, orderDir: string, pageNumber: number, pageSize: number,
    startDate: Date, endDate: Date, perimeter: string, typeMission: string, actionStatut: string,
    actionType: string, actionPilote: string) {
    let params = new HttpParams();
    params = params.append('orderBy', orderByColName);
    params = params.append('orderDir', orderDir);
    params = params.append('page', pageNumber);
    params = params.append('pageSize', pageSize);
    if (this.isValidDate(startDate)) {
      params = params.append('start', startDate.toISOString());
    }
    if (this.isValidDate(endDate)) {
      params = params.append('end', endDate.toISOString());
    }
    params = params.append('perimeter', perimeter);
    params = params.append('typeMission', typeMission);
    params = params.append('actionStatut', actionStatut);
    params = params.append('actionType', actionType);
    params = params.append('actionPilote', actionPilote);
    return this.httpClient.get(environment.serverUrl + `/leak/getAllLeaks`,
      { withCredentials: true, params: params });
  }




  /**
    * Get detailled leaks list from the server
    * 
    */
  getAllLeaksInPdf(startDate: Date, endDate: Date, perimeter: string, typeMission: string, actionStatut: string,
    actionType: string, actionPilote: string) {
    //
    let params = new HttpParams();
    if (this.isValidDate(startDate)) {
      params = params.append('start', startDate.toISOString());
    }
    if (this.isValidDate(endDate)) {
      params = params.append('end', endDate.toISOString());
    }
    params = params.append('perimeter', perimeter);
    params = params.append('typeMission', typeMission);
    params = params.append('actionStatut', actionStatut);
    params = params.append('actionType', actionType);
    params = params.append('actionPilote', actionPilote);


    return this.httpClient.get(environment.serverUrl + `/leak/getAllLeaksInPdf`,
      { withCredentials: true, params: params });
  }




  /**
   * Get paginations of leaks history
   * TODO: Data and paginations must be on the same API
   * @param page 
   * @returns 
   */
  getPaginatedPermissionUsage(page: number) {
    return this.httpClient.get(environment.serverUrl + `/leak/leak/${page}`,
      { withCredentials: true });
  }




  /**
   * Update leak
   * @param leakRow
   * @returns 
   */
  updateLeak(leakRow: any): Observable<any> {
    let url = (environment.serverUrl + `/leak/update`);

    // Parse date fuite
    let dateFuite: Date | undefined = undefined;
    if (leakRow[1]) {
      const dateFuiteStr: string = leakRow[1];
      const dayStr = dateFuiteStr.split(' ')[0];
      const timeStr = dateFuiteStr.split(' ')[1];
      // Rarely date have format dd/mm/yyyy hh:mm
      // Most often date have format yyyy-mm-dd hh:mm:ss
      if (dateFuiteStr.includes('-')) {
        const year = Number(dayStr.split('-')[0]);
        const month = Number(dayStr.split('-')[1]) - 1;
        const day = Number(dayStr.split('-')[2]);
        const hour = Number(timeStr.split(':')[0]);
        const minute = Number(timeStr.split(':')[1]);
        const second = isNaN(Number(timeStr.split(':')[2])) ? 0 : Number(timeStr.split(':')[2]);
        dateFuite = new Date(year, month, day, hour, minute, second);
      } else {
        const year = Number(dayStr.split('/')[2]);
        const month = Number(dayStr.split('/')[1]) - 1;
        const day = Number(dayStr.split('/')[0]);
        const hour = Number(timeStr.split(':')[0]);
        const minute = Number(timeStr.split(':')[1]);
        dateFuite = new Date(year, month, day, hour, minute);
      }
    }

    // Parse delai action date
    let delaiActionDate = undefined;
    if (leakRow[14]) {
      if (typeof leakRow[14] == 'string') {
        const split = leakRow[14].split('-');
        delaiActionDate = new Date(Number(split[0]), Number(split[1]) - 1, Number(split[2]));
      } else {
        delaiActionDate = leakRow[14];
      }
    }

    const data = {
      leakId: leakRow[19],
      leakName: leakRow[0],
      leakDate: dateFuite,
      leakGain: leakRow[2],
      leakDbRms: leakRow[3],
      leakK: leakRow[4],
      leakFlow: leakRow[5],
      leakCost: leakRow[6],
      leakCurrency: leakRow[7],
      leakCoordX: leakRow[11] ? (leakRow[11][0] == null ? undefined : leakRow[11][0]) : undefined,
      leakCoordY: leakRow[11] ? (leakRow[11][1] == null ? undefined : leakRow[11][1]) : undefined,
      actionPilote: leakRow[13],
      actionDelai: delaiActionDate,
      actionDesc: leakRow[15],
      actionCost: leakRow[16],
      actionStatut: leakRow[17],
    };

    return this.httpClient.post(url, data, { withCredentials: true });
  }




  /**
   * Delete leak
   * @param leakId 
   * @returns 
   */
  deleteLeak(leakId: string) {
    return this.httpClient.post(environment.serverUrl + '/leak/delete',
      { leakId: leakId }, { withCredentials: true });
  }















  /**
   * Get perimeter list with pagination and ordering
   * @param orderByColName 
   * @param orderDir 
   * @param pageNumber 
   * @param pageSize 
   * @param filter 
   * @returns 
   */
  GetAllPeri(orderByColName: string, orderDir: string, pageNumber: number, pageSize: number, filter: string) {
    const params = new HttpParams()
      .set('orderBy', orderByColName)
      .set('orderDir', orderDir)
      .set('page', pageNumber)
      .set('pageSize', pageSize)
      .set('filter', filter)
    return this.httpClient.get(environment.serverUrl + `/perimeter/getAllPerimeter`,
      { withCredentials: true, params: params });
  }



  /**
   * Get activated perimeters list
   * @returns 
   */
  getActivatedPeris() {
    return this.httpClient.get(environment.serverUrl + `/perimeter/getAllPeris`,
      { withCredentials: true });
  }



  /**
 * Add booking
 * @param code String
 * @param description String
 * @param statut String 
 * @param file Plan File
 * @returns 
 */
  addPeri(code: string, description: string, statut: boolean, file: File) {
    let formData: FormData = new FormData();
    formData.append('image', file);
    formData.append('code', code);
    formData.append('description', description);
    formData.append('statut', statut + '');
    return this.httpClient.post(environment.serverUrl + '/perimeter/add-perimeter', formData,
      { withCredentials: true });
  }







  /**
   * Update perimeter
   * @param id 
   * @param code 
   * @param description 
   * @param statut 
   * @param file 
   * @returns 
   */
  updatePerimeter(id: string, code: string, description: string, statut: boolean, file?: File): Observable<any> {
    let API_URL = (environment.serverUrl + `/perimeter/update-perimeter`);
    let formData: FormData = new FormData();
    if (file) {
      formData.append('image', file);
    }
    formData.append('code', code);
    formData.append('description', description);
    formData.append('statut', statut + '');
    formData.append('id', id);
    return this.httpClient.put(API_URL, formData, { withCredentials: true });
  }


  /**
   * Delete perimeter
   * @param id 
   * @returns 
   */
  deletePerimeter(id: string) {
    return this.httpClient.post(environment.serverUrl + `/perimeter/delete-perimeter`,
      { id: id }, { withCredentials: true });
  }


  /**
   * Get All Equipement
   * @returns 
   */
  GetAllEquip(orderByColName: string, orderDir: string, pageNumber: number, pageSize: number, filter: string) {
    const params = new HttpParams()
      .set('orderBy', orderByColName)
      .set('orderDir', orderDir)
      .set('page', pageNumber)
      .set('pageSize', pageSize)
      .set('filter', filter)
    return this.httpClient.get(environment.serverUrl + `/equipement/getAllEquip`,
      { withCredentials: true, params: params });

  }



  /**
* Get activated Equipements list
* @returns 
*/
  getActivatedEquip() {
    return this.httpClient.get(environment.serverUrl + `/equipement/getAllEquis`,
      { withCredentials: true });
  }





  /**
  * Add Equip
  * @param code String
  * @param description String
  * @param typeEquipId String
  * @param facteur number
  * @param statut boolean 
  * @param file String
  * @returns 
  */
  addEquip(code: string, description: string, typeEquipId: string, statut: boolean, file: File, facteur: string) {
    let formData: FormData = new FormData();
    formData.append('image', file);
    formData.append('code', code);
    formData.append('typeEquip', typeEquipId);
    formData.append('facteur', facteur);
    formData.append('description', description);
    formData.append('statut', statut + '');
    return this.httpClient.post(environment.serverUrl + '/equipement/add-equip',
      formData,
      { withCredentials: true });
  }


  /**
  * 
  * Update Type equipement
  * @param id 
  * @param code 
  * @param typeEquipId 
  * @param description 
  * @param facteur 
  * @param statut 
  * @param file 
  * @returns 
  */
  updateEquip(id: string, code: string, typeEquipId: string, description: string, statut: string,
    facteur: string, file?: File): Observable<any> {

    let API_URL = (environment.serverUrl + `/equipement/update-equip`);
    let formData: FormData = new FormData();
    if (file) {
      formData.append('image', file);
    }
    formData.append('code', code);
    formData.append('description', description);
    formData.append('facteur', facteur);
    formData.append('typeEquipId', typeEquipId);
    formData.append('statut', statut + '');
    formData.append('id', id);
    return this.httpClient.put(API_URL, formData, { withCredentials: true });
  }


  /**
   * Delete equipement
   * @param id 
   * @returns 
   */
  deleteEquip(id: string) {
    return this.httpClient.post(environment.serverUrl + `/equipement/delete-equip`,
      { id: id }, { withCredentials: true });
  }



  /**
   * Get the right facteur for a booking
   * @param EqpId equipement id
   * @param bookingCreationDate booking creation date string
   * @returns 
   */
  getFacteur(EqpId: string, bookingCreationDate: string) {
    const params = new HttpParams()
      .set('equipId', EqpId)
      .set('date', bookingCreationDate);
    return this.httpClient.get(environment.serverUrl + `/equipement/facteur`,
      { withCredentials: true, params: params });
  }











  /**
  * Get All  Types Equipement
  * @returns 
  */
  GetAllTypeEquip(orderByColName: string, orderDir: string, pageNumber: number, pageSize: number, filter: string) {
    const params = new HttpParams()
      .set('orderBy', orderByColName)
      .set('orderDir', orderDir)
      .set('page', pageNumber)
      .set('pageSize', pageSize)
      .set('filter', filter)
    return this.httpClient.get(environment.serverUrl + `/typeEquip/getAllTypeEquip`,
      { withCredentials: true, params: params });
  }


  GetAllTypesEquip() {
    return this.httpClient.get(environment.serverUrl + `/typeEquip/getAllTypeEquips`,
      { withCredentials: true });
  }

  /**
  * Add type Equip
  * @param typeEquip string
  * @param description string
  * @param statut boolean 
  * @returns 
  */
  addTypeEquip(typeEquip: string, description: string, statut: boolean) {
    return this.httpClient.post(environment.serverUrl + '/typeEquip/add-typeEquip',
      {
        typeEquip: typeEquip,
        description: description,
        statut: statut,
      },
      { withCredentials: true });
  }



  /**
  *   // Update type Equip
  * @param id 
  * @param typeEquip 
  * @param description 
  * @param statut 
  * @returns 
  */
  updateTypeEquip(id: string, typeEquip: string, description: string, statut: string): Observable<any> {
    let API_URL = (environment.serverUrl + `/typeEquip/update-typeEquip`);
    return this.httpClient.put(API_URL, {
      id: id,
      typeEquip: typeEquip,
      description: description,
      statut: statut
    },
      { withCredentials: true });
  }

  /**
     * Delete typeEquip
     * @param id 
     * @returns 
     */
  deleteTypeEquip(id: string) {
    return this.httpClient.post(environment.serverUrl + `/typeEquip/delete-typeEquip`,
      { id: id }, { withCredentials: true });
  }



  /**
   * Get All Types Mission
   * @returns 
   */
  GetAllTypesMission(orderByColName: string, orderDir: string, pageNumber: number, pageSize: number, filter: string) {
    const params = new HttpParams()
      .set('orderBy', orderByColName)
      .set('orderDir', orderDir)
      .set('page', pageNumber)
      .set('pageSize', pageSize)
      .set('filter', filter)
    return this.httpClient.get(environment.serverUrl + `/typesMission/getAllTypesMission`,
      { withCredentials: true, params: params });
  }




  /**
* Get activated Type Mission list
* @returns 
*/
  getActivatedTypeMission() {
    return this.httpClient.get(environment.serverUrl + `/typesMission/getAllMissions`,
      { withCredentials: true });
  }



  /**
  * Add Type Mission
  * @param typeMission String
  * @param description String
  * @param statut boolean 
  * @returns 
  */
  addTypeMission(typeMission: String, description: String, statut: boolean) {
    return this.httpClient.post(environment.serverUrl + '/typesMission/add-typesMission',
      {
        typeMission: typeMission,
        description: description,
        statut: statut,
      },
      { withCredentials: true });
  }

  /**
  *   // Update Type Mission
  * @param id 
  * @param statut 
  * @returns 
  */
  updateTypeMission(id: String, statut: boolean): Observable<any> {
    let API_URL = (environment.serverUrl + `/typesMission/update-typesMission`);
    return this.httpClient.put(API_URL, {
      id: id,
      statut: statut
    },
      { withCredentials: true });
  }

  /**
   * Delete typeEquip
   * @param id 
   * @returns 
   */
  deleteTypeMiss(id: string) {
    return this.httpClient.post(environment.serverUrl + `/typesMission/delete-typesMission`,
      { id: id }, { withCredentials: true });
  }



  /**
     * Get All  Frequence Controle
     * @returns 
     */
  GetAllFreqContr() {
    return this.httpClient.get(environment.serverUrl + `/freq/getAllFreqContr`,
      { withCredentials: true });
  }


  /**
  * Update freq controle
  * @param id 
  * @param _0_100euro 
  * @param _100_500euro 
  * @param _500_1500euro 
  * @param _1500euro 
  * @param horizon 
  * @returns 
  */
  updateFreqContr(id: string, _0_100euro: number | null, _100_500euro: number | null, _500_1500euro: number | null,
    _1500euro: number | null, horizon: number | null): Observable<any> {
    let API_URL = (environment.serverUrl + `/freq/update-FreqContr`);
    return this.httpClient.post(API_URL, {
      id: id,
      _0_100euro: _0_100euro,
      _100_500euro: _100_500euro,
      _500_1500euro: _500_1500euro,
      _1500euro: _1500euro,
      horizon: horizon
    },
      { withCredentials: true });
  }




  // ==================================================================================================
  // # ALL next method are not APIs
  // ==================================================================================================

  /**
   * Show error dialog
   * @param title 
   * @param msg 
   */
  showErrorDialog(title: string, msg: string) {
    this.dialog.open(MaterialDialogComponent, {
      width: '300px',
      panelClass: 'error-alert',
      data: { title: title, msg: msg }
    });
  }

  /**
   * Show success dialog
   * @param title 
   * @param msg  
   */
  showSuccessDialog(title: string, msg: string) {
    this.dialog.open(MaterialDialogComponent, {
      width: '300px',
      panelClass: 'success-alert',
      data: { title: title, msg: msg }
    });
  }


  /**
   * A function to convert a date to a compatible input string and vice versa
   * @param d Date | string
   * @returns Date | string
   */
  inputDateFormat(d: Date | string): Date | string {
    if (typeof d === 'string') {
      // Return date
      const dateStrSplit = d.split('-');
      return new Date(Number(dateStrSplit[0]), Number(dateStrSplit[1]) - 1, Number(dateStrSplit[2]));
    } else {
      // Return string
      if (!this.isValidDate(d)) {
        return '';
      }
      return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-'
        + ('0' + d.getDate()).slice(-2);
    }
  }


  /**
   * Test whether d is valid Date
   * @param d 
   * @returns boolean
   */
  isValidDate(d: Date) {
    return d instanceof Date && !isNaN(d.getTime());
  }



  // Cookies stuffs
  setCookie(cname: string, cvalue: string, exdays: number) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }

  getCookie(cname: string) {
    const name = cname + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  checkCookie(cname: string): boolean {
    const cValue = this.getCookie(cname);
    if (cValue && cValue.length !== 0) {
      return true;
    } else {
      return false;
    }
  }

  // Error -
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Handle client error
      errorMessage = error.error.message;
    } else {
      // Handle server error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}