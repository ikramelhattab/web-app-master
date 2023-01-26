import { ChangeDetectorRef } from '@angular/core';
import { Component } from '@angular/core';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { MatDialog } from '@angular/material/dialog';
import { EquipementDialogComponent } from './equipements-dialog/equipement-dialog.component';
import { EditEquipDialogComponent } from './edit-dialog/edit-dialog.component';
import { FormBuilder } from "@angular/forms";
import { BackendService } from '../../services/backend.service';
import { MatDialogRef } from '@angular/material/dialog';
import { UserInfoService } from 'src/app/services/user-info.service';
import { ToolbarTitleService } from 'src/app/services/toolbar-title.service';
import { EqpImgModalComponent } from './eqp-img-modal/eqp-img-modal.component';


@Component({
  selector: 'app-equipements',
  templateUrl: './equipements.component.html',
  styleUrls: ['./equipements.component.scss']
})



export class EquipementsComponent {

  isAdmin = false;

  public equipements: Array<any> = [];

  // For pagination and ordering
  page: any = {
    limit: 8, // number of items by page
    count: 0, // Total numbers of items
    offset: 0, // page number
    orderBy: 'code',
    orderDir: 'desc',
    filter: ''
  }

  ColumnMode = ColumnMode;
  sortType = SortType.single
  timeOutPagination: any;
  timeOutSorting: any;
  timeOutFiltring: any;


  equipListLoading = false;
  toDate = this.backendService.toDate;

  // Custom class for the row
  getRowClass = (row: any) => {
    return {
      'user-row': true,
    };
  }
  addEquipDialog?: MatDialogRef<EquipementDialogComponent>;
  editEquipDialog?: MatDialogRef<EditEquipDialogComponent>;


  constructor(
    private dialogModel: MatDialog,
    public formBuilder: FormBuilder,
    private backendService: BackendService,
    private changeDetector: ChangeDetectorRef,
    private userInfoService: UserInfoService,
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
    this.titleService.changeTitle('Tarsio - Paramètres - Équipements');
  }


  ngOnInit(): void {
    // Fill the table
    this.getEquipements();
  }



  /**
   * Load equipements list to the table
   */
  getEquipements() {
    this.equipListLoading = true;
    this.equipements = [];
    this.backendService.GetAllEquip(this.page.orderBy, this.page.orderDir, this.page.offset + 1, this.page.limit, this.page.filter)
      .subscribe((res: any) => {
        const equipsList = res[0].equipements;
        if (equipsList.length === 0) {
          this.page.count = 0;
          this.equipListLoading = false;
          return;
        }
        this.page.count = res[0].total[0].count;

        equipsList.forEach((e: any) => {
          this.equipements.push({
            //   createdBy: (u.createdByFN ? u.createdByFN : '') + ' ' + (u.createdByLN ? u.createdByLN : ''),
            code: e.code,
            description: e.description,
            typeEquipId: e.typeEquip,
            statut: e.statut,
            facteur: e.facteur,
            photoUrl: e.photoUrl,
            id: e._id
          });

        });
        this.equipements = [...this.equipements];
        this.changeDetector.detectChanges();
        this.equipListLoading = false;
      },
        (err: any) => {
          console.error(err);
          this.backendService.showErrorDialog('Impossible de charger la liste des equipements',
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
      this.getEquipements();
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
      if (sortInfo.sorts[0].prop === 'typeEquipId') {
        this.page.orderBy = 'typeEquip.typeEquip'
      } else {
        this.page.orderBy = sortInfo.sorts[0].prop;
      }

      // This is a workaround to get paging works properly with sorting
      const currentOffset = this.page.offset;
      this.page.offset = 0;
      this.changeDetector.detectChanges();
      this.page.offset = currentOffset;
      this.getEquipements();
    }, 100);
  }


  onSearch(event: Event) {
    clearTimeout(this.timeOutFiltring);
    this.timeOutFiltring = setTimeout(() => {
      // Return to page 1
      this.page.offset = 0;
      this.getEquipements();
      this.changeDetector.detectChanges();
    }, 100);
  }


  dialog() {
    const addEquipDialog = this.dialogModel.open(EquipementDialogComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true
    });
    addEquipDialog.afterClosed().subscribe((newPeri: any) => {
      if (newPeri) {
        this.getEquipements();
      }
    });
  }

  /**
 * Open edit type equipement dialog
 * @param eqpRow 
 */
  Editdialog(eqpRow: any) {
    const editEquipDialog = this.dialogModel.open(EditEquipDialogComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
      data: {
        eqp: eqpRow,
      }
    });
    editEquipDialog.afterClosed().subscribe((updatedEq: any) => {
      if (updatedEq) {
        // ---
        // This is an update
        // ---
        this.getEquipements();

      };
    });
  }



  /**
   * Open equipement image
   * @param eqp 
   */
  onEqpImgClick(eqp: any) {
    const planDialog = this.dialogModel.open(EqpImgModalComponent, {
      data: eqp,
    });
  }


}