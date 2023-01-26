import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { first } from 'rxjs/operators';
import { BackendService } from 'src/app/services/backend.service';
import { ToolbarTitleService } from 'src/app/services/toolbar-title.service';
import { UserInfoService } from 'src/app/services/user-info.service';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';

@Component({
  selector: 'app-users-settings',
  templateUrl: './users-settings.component.html',
  styleUrls: ['./users-settings.component.scss']
})
export class UsersSettingsComponent implements OnInit {

  isAdmin = false;

  usersList: Array<any> = [];
  usersListLoading = false;
  // For pagination and ordering
  page: any = {
    limit: 8, // number of items by page
    count: 0, // Total numbers of items
    offset: 0, // page number
    orderBy: 'lastSignIn',
    orderDir: 'desc',
    filter: ''
  }

  ColumnMode = ColumnMode;
  sortType = SortType.single
  timeOutPagination: any;
  timeOutSorting: any;
  timeOutFiltring: any;



  toDate = this.backendService.toDate;

  // Custom class for the row
  getRowClass = (row: any) => {
    return {
      'user-row': true,
    };
  }

  constructor(
    private userInfoService: UserInfoService,
    private backendService: BackendService,
    private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog,
    private titleService: ToolbarTitleService) {
      this.titleService.changeTitle('Tarsio - Paramètres - Gestion des utilisateurs');
     }

  ngOnInit(): void {
    this.userInfoService.currentUser.subscribe(
      (user: any) => {
        this.isAdmin = user.isAdmin;
        if (this.isAdmin) {
          this.loadUsersList();
        }
      });
  }


  /**
   * Load users list to the table
   */
  loadUsersList() {
    this.usersListLoading = true;
    this.usersList = [];
    this.backendService.getUsersList(this.page.orderBy, this.page.orderDir, this.page.offset + 1, this.page.limit,
      this.page.filter).subscribe((usersList: any) => {
        const users = usersList[0].users;
        if (users.length === 0) {
          this.page.count = 0;
          this.usersListLoading = false;
          return;
        }
        this.page.count = usersList[0].total[0].count;
        users.forEach((u: any) => {
          this.usersList.push({
            createdBy: (u.createdByFN ? u.createdByFN : '') + ' ' + (u.createdByLN ? u.createdByLN : ''),
            createdOn: new Date(u.createdOn),
            email: u.email,
            name: u.firstName + ' ' + u.lastName,
            isAdmin: u.isAdmin,
            lastSignIn: new Date(u.lastSignIn),
            id: u._id
          });
        });
        this.usersList = [...this.usersList];
        this.changeDetector.detectChanges();
        this.usersListLoading = false;
      },
        (err: any) => {
          console.error(err);
          this.backendService.showErrorDialog('Impossible de charger la liste des utilisateurs',
            'Essayer à nouveau plus tard');
        });
  }




  /**
   * Ngx data table pagination event
   * @param pageInfo 
   */
  onPage(pageInfo: { count?: number, pageSize?: number, limit?: number, offset?: number }) {
    clearTimeout(this.timeOutPagination);
    this.timeOutPagination = setTimeout(() => {
      this.page.offset = pageInfo.offset;
      this.changeDetector.detectChanges();
      this.loadUsersList();
    }, 100);
  }


  /**
   * Ngx data table sorting event
   * @param sortInfo 
   */
  onSort(sortInfo: { sorts: { dir: string, prop: string }[], column: {}, prevValue: string, newValue: string }) {
    clearTimeout(this.timeOutSorting);
    this.timeOutSorting = setTimeout(() => {
      this.page.orderDir = sortInfo.sorts[0].dir;
      // In accordance with the backend
      if (sortInfo.sorts[0].prop === 'createdBy') {
        this.page.orderBy = 'createdByFN';
      } else if (sortInfo.sorts[0].prop === 'name') {
        this.page.orderBy = 'firstName';
      } else {
        this.page.orderBy = sortInfo.sorts[0].prop;
      }
      // This is a workaround to get paging works properly with sorting
      const currentOffset = this.page.offset;
      this.page.offset = 0;
      this.changeDetector.detectChanges();
      this.page.offset = currentOffset;
      this.loadUsersList();
    }, 100);
  }


  onSearch(event: Event) {
    clearTimeout(this.timeOutFiltring);
    this.timeOutFiltring = setTimeout(() => {
      // Return to page 1
      this.page.offset = 0;
      this.loadUsersList();
      this.changeDetector.detectChanges();
    }, 500);
  }



  /**
   * Open add user dialog
   */
  addUser() {
    const addUserDialog = this.dialog.open(AddUserComponent, {
      width: '500px',
      disableClose: true,
      autoFocus: false,
      data: {}
    });
    addUserDialog.afterClosed().subscribe(newUser => {
      if (newUser) {
        this.loadUsersList();
      }
    });
  }


  /**
   * Open edit user dialog
   * @param userId 
   */
  editUser(userId: string) {
    const editUserDialog = this.dialog.open(EditUserComponent, {
      width: '500px',
      disableClose: true,
      autoFocus: false,
      data: {
        id: userId
      }
    });
    editUserDialog.afterClosed().subscribe((updatedUser: any) => {
      if (updatedUser) {
        if (typeof updatedUser === 'object') {
          // ---
          // This is an update
          // ---
          this.loadUsersList();
          this.backendService.showSuccessDialog('Mise à jour effectuée', 'La mise à jour a été effectué avec succès.');
        }
        if (typeof updatedUser === 'string') {
          // ---
          // This a delete
          // ---
          this.loadUsersList();
          this.backendService.showSuccessDialog('Utilisateur supprimé', '');
        }
      };
    });
  }




}
