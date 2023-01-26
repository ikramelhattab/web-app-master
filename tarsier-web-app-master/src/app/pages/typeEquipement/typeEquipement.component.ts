import { OnInit, NgZone, Sanitizer, SecurityContext, ChangeDetectorRef } from '@angular/core';
import { AfterViewInit, Component, ViewChild } from '@angular/core';

import { Router, ActivatedRoute, Data } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { typeEquipementDialogComponent } from './typeEquipement-dialog/typeEquipement-dialog.component';
import { EditTypeEquipementDialogComponent } from './edit-dialog/edit-dialog.component';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToolbarTitleService } from 'src/app/services/toolbar-title.service';

import { BackendService } from '../../services/backend.service';

import { MatDialogRef } from '@angular/material/dialog';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';

import { UserInfoService } from 'src/app/services/user-info.service';


@Component({
  selector: 'app-perimeters',
  templateUrl: './typeEquipement.component.html',
  styleUrls: ['./typeEquipement.component.scss']
})



export class TypeEquipementComponent {
  isAdmin = false;

  public typeequips: Array<any> = [];

  typeEquiLoading = false;
  page: any = {
    limit: 8, // number of items by page
    count: 0, // Total numbers of items
    offset: 0, // page number
    orderBy: 'lastSignIn',
    orderDir: 'desc',
    filter: ''
  }
  ColumnMode = ColumnMode;
  sortType = SortType.single;
  timeOutPagination: any;
  timeOutSorting: any;
  timeOutFiltring: any;


  // Custom class for the row
  getRowClass = (row: any) => {
    return {
      'typeequi-row': true,
    };
  }

  addTypeEquiDialog?: MatDialogRef<typeEquipementDialogComponent>;
  editTypeEquiDialog?: MatDialogRef<EditTypeEquipementDialogComponent>;


  constructor(
    private dialogModel: MatDialog,
    public formBuilder: FormBuilder,
    private backendService: BackendService,
    private userInfoService: UserInfoService,
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
    this.titleService.changeTitle('Tarsio - Paramètres - Types d\'équipement');
  }


  ngOnInit(): void {
    this.getTypeEquipe();
  }


  /**
   * The main function in this component
   * Get list of equipement type with pagination
   */
  getTypeEquipe() {
    
    this.typeEquiLoading = true;
    this.typeequips = [];
    this.backendService.GetAllTypeEquip(this.page.orderBy, this.page.orderDir, this.page.offset + 1, this.page.limit,
      this.page.filter).subscribe((res: any) => {
        const typeEquipList = res[0].typeequips;
        if (typeEquipList.length === 0) {
          this.page.count = 0;
          this.typeEquiLoading = false;
          return;
        }
        this.page.count = res[0].total[0].count;
        typeEquipList.forEach((t: any) => {
          this.typeequips.push({
            typeEquip: t.typeEquip,
            description: t.description,
            statut: t.statut,
            id: t._id
          });
        });
        this.typeequips = [...this.typeequips];
        this.changeDetector.detectChanges();
        this.typeEquiLoading = false;
      }, (err: any) => {
        this.typeEquiLoading = false;
        console.error(err);
        this.backendService.showErrorDialog('Impossible de charger la liste des types d\'équipement',
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
      this.getTypeEquipe();
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
      this.getTypeEquipe();
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
      this.getTypeEquipe();
      this.changeDetector.detectChanges();
    }, 500);
  }



  dialog() {
    const addTypeEquiDialog = this.dialogModel.open(typeEquipementDialogComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true
    });
    addTypeEquiDialog.afterClosed().subscribe((newTEquip: any) => {
      if (newTEquip) {
        this.getTypeEquipe();
      }
    });
  }



  /**
   * Open edit type equipement dialog
   * @param TypeequipRow 
   */
  Editdialog(TypeequipRow: string) {
    const editTypeEquiDialog = this.dialogModel.open(EditTypeEquipementDialogComponent, {
      width: '500px',
      disableClose: true,
      autoFocus: false,
      data: TypeequipRow
    });
    editTypeEquiDialog.afterClosed().subscribe((updatedtyEq: any) => {
      if (updatedtyEq) {
        // This is an update
        this.getTypeEquipe();
      }
    });
  }

}