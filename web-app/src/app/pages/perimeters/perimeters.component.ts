import { OnInit, NgZone, Sanitizer, SecurityContext, ChangeDetectorRef } from '@angular/core';
import { AfterViewInit, Component, ViewChild } from '@angular/core';

import { Router, ActivatedRoute, Data, Route } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NewPerimeterDialogComponent } from './new-perimeter-dialog/new-perimeter-dialog.component';
import { EditPeriDialogComponent } from './edit-dialog/edit-dialog.component';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { BackendService } from '../../services/backend.service';

import { MatDialogRef } from '@angular/material/dialog';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { UserInfoService } from 'src/app/services/user-info.service';
import { PlanDialogComponent } from './plan-dialog/plan-dialog.component';
import { ToolbarTitleService } from 'src/app/services/toolbar-title.service';


@Component({
  selector: 'app-perimeters',
  templateUrl: './perimeters.component.html',
  styleUrls: ['./perimeters.component.scss']
})



export class PerimetersComponent {

  isAdmin = false;
  public perimeters: Array<any> = [];
  periLoading = false;
  page: any = {
    limit: 8, // number of items by page
    count: 0, // Total numbers of items
    offset: 0, // page number
    orderBy: 'createdOn',
    orderDir: 'desc',
    filter: ''
  }

  ColumnMode = ColumnMode;
  sortType = SortType.single;
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
    private dialogModel: MatDialog,
    public formBuilder: FormBuilder,
    private backendService: BackendService,
    private changeDetector: ChangeDetectorRef,
    private titleService: ToolbarTitleService
  ) {
    this.userInfoService.currentUser.subscribe(
      (user: any) => {
        if (user.isAdmin) {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
      });

    this.titleService.changeTitle('Tarsio - Paramètres - Périmètres');
  }


  ngOnInit(): void {
    this.getPeremeters();
  }



  /**
   * The main function in this component
   * Get list of perimétre with pagination
   */
  getPeremeters() {
    this.periLoading = true;
    this.perimeters = [];
    this.backendService.GetAllPeri(this.page.orderBy, this.page.orderDir, this.page.offset + 1, this.page.limit,
      this.page.filter).subscribe((res: any) => {
        const periList = res[0].perimeters;
        if (periList.length === 0) {
          this.page.count = 0;
          this.periLoading = false;
          return;
        }
        this.page.count = res[0].total[0].count;
        periList.forEach((p: any) => {
          this.perimeters.push({
            code: p.code,
            description: p.description,
            createdOn: new Date(p.createdOn),
            updatedOn: new Date(p.updatedOn),
            statut: p.statut,
            photoUrl: p.photoUrl,
            thumbUrl: p.thumbUrl,
            id: p._id
          });
        });
        this.perimeters = [...this.perimeters];
        this.changeDetector.detectChanges();
        this.periLoading = false;
      }, (err: any) => {
        this.periLoading = false;
        console.error(err);
        this.backendService.showErrorDialog('Impossible de charger la liste des périmètres',
          'Veuillez réessayer plus tard.');
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
      this.getPeremeters();
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
      this.page.orderBy = sortInfo.sorts[0].prop;

      // This is a workaround to get paging works properly with sorting
      const currentOffset = this.page.offset;
      this.page.offset = 0;
      this.changeDetector.detectChanges();
      this.page.offset = currentOffset;
      this.getPeremeters();
    }, 100);
  }


  /**
   * Filtering event
   * @param event 
   */
  onSearch(event: Event) {
    clearTimeout(this.timeOutFiltring);
    this.timeOutFiltring = setTimeout(() => {
      // Return to page 1
      this.page.offset = 0;
      this.getPeremeters();
      this.changeDetector.detectChanges();
    }, 500);
  }


  /**
   * Open add new perimeter dialog
   */
  openAddDialog() {
    const addPeriDialog = this.dialogModel.open(NewPerimeterDialogComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true
    });
    addPeriDialog.afterClosed().subscribe((newPeri: any) => {
      if (newPeri) {
        this.getPeremeters();
      }
    });
  }


  /**
   * Open edit perimeter dialog
   *    * @param perimeter 
   */
  openEditDialog(perimeter: any) {
    const editPeriDialog = this.dialogModel.open(EditPeriDialogComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
      data: perimeter
    });
    editPeriDialog.afterClosed().subscribe((updatedPeri: any) => {
      if (updatedPeri) {
        this.getPeremeters();
      }
    })
  }



  showPlan(perimeter: any) {
    const planDialog = this.dialogModel.open(PlanDialogComponent, {
      data: perimeter,
    });
  }

}