import { OnInit, NgZone, Sanitizer, SecurityContext, ChangeDetectorRef } from '@angular/core';
import { AfterViewInit, Component, ViewChild } from '@angular/core';

import { Router, ActivatedRoute, Data } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TypesMissionDialogComponent } from './typesMission-dialog/typesMission-dialog.component';
import { EditTypesMissionDialogComponent } from './edit-dialog/edit-dialog.component';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToolbarTitleService } from 'src/app/services/toolbar-title.service';

import { BackendService } from '../../services/backend.service';

import { MatDialogRef } from '@angular/material/dialog';

import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { UserInfoService } from 'src/app/services/user-info.service';

@Component({
  selector: 'app-perimeters',
  templateUrl: './typesMission.component.html',
  styleUrls: ['./typesMission.component.scss']
})



export class TypesMissionComponent {
  isAdmin = false;

  public typesmissions: Array<any> = [];
  typeMissionLoading = false;
  page: any = {
    limit: 8, // number of items by page
    count: 0, // Total numbers of items
    offset: 0, // page number
    orderBy: 'typeMission',
    orderDir: 'asc',
    filter: ''
  }

  ColumnMode = ColumnMode;
  sortType = SortType.single;
  timeOutPagination: any;
  timeOutSorting: any;
  timeOutFiltring: any;

  toDate = this.backendService.toDate;


  addTypesMissionDialog?: MatDialogRef<TypesMissionDialogComponent>;
  editTypesMissionDialog?: MatDialogRef<EditTypesMissionDialogComponent>;



  // Custom class for the row
  getRowClass = (row: any) => {
    return {
      'typemission-row': true,
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
    this.titleService.changeTitle('Tarsio - Paramètres - Types de mission');

  }


  ngOnInit(): void {
    this.getTypeMissions();
  }




  /**
     * The main function in this component
     * Get list of perimétre with pagination
     */
  getTypeMissions() {
    this.typeMissionLoading = true;
    this.typesmissions = [];
    this.backendService.GetAllTypesMission(this.page.orderBy, this.page.orderDir, this.page.offset + 1, this.page.limit,
      this.page.filter).subscribe((res: any) => {
        const missionList = res[0].typesmissions;
        if (missionList.length === 0) {
          this.page.count = 0;
          this.typeMissionLoading = false;
          return;
        }
        this.page.count = res[0].total[0].count;
        missionList.forEach((m: any) => {
          this.typesmissions.push({
            typeMission: m.typeMission,
            description: m.description,
            statut: m.statut,
            id: m._id
          });
        });

        this.typesmissions = [...this.typesmissions];
        this.changeDetector.detectChanges();
        this.typeMissionLoading = false;
      }, (err: any) => {
        this.typeMissionLoading = false;
        console.error(err);
        this.backendService.showErrorDialog('Impossible de charger la liste des types Mission',
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
      this.getTypeMissions();
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
      this.getTypeMissions();
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
      this.getTypeMissions();
      this.changeDetector.detectChanges();
    }, 500);
  }



  onStatutChange(event: any, row: any) {
    const newStatut = event.target.value;
    this.backendService.updateTypeMission(row.id, newStatut).subscribe(
      (updatedTypeM: any) => { },
      (err: any) => {
        console.error(err);
        this.backendService.showErrorDialog('Impossible de mettre à jour le type de mission',
          'Une erreur inattendue est survenue, Veuillez réesseyer ultérieurement');
      }
    );
  }


}