import { OnInit, ChangeDetectorRef } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ToolbarTitleService } from 'src/app/services/toolbar-title.service';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { MatDialog } from '@angular/material/dialog';
import { UserInfoService } from 'src/app/services/user-info.service';
import { ActionDialogComponent } from '../booking/reservation-details/action-dialog/action-dialog.component';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

var htmlToPdfMake = require("html-to-pdfmake");

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})


export class ActionsComponent implements OnInit {

  @ViewChild('htmlData', { static: false }) htmlData: any;
  public allAct: Array<any> = [];
  public leaks: Array<any> = [];
  public ActionsPDF: Array<any> = [];

  choosenEndDate = '';
  choosenStartDate = '';
  public choosenPeri = 'all';
  public choosenTypeMiss = 'all';
  public choosenTypeAction = 'all';
  public choosenActionStatut = 'all';
  piloteModel = '';

  // For pagination and ordering
  page: any = {
    limit: 6, // number of items by page
    count: 0, // Total numbers of items
    offset: 0, // page number
    orderBy: 'createdOn',
    orderDir: 'desc',
    filter: ''
  };
  perimeters: Array<any> = [];
  tyMission: Array<any> = [];
  ColumnMode = ColumnMode;
  sortType = SortType.single
  timeOutPagination: any;
  timeOutSorting: any;
  timeOutFiltring: any;
  loading = false;

  currentUserId = '';
  isAdmin = false;


  // Custom class for the row
  getRowClass = (row: any) => {
    return {
      'reserv-row': true,
    };
  }

  toDate = this.backendService.toDate;


  constructor(
    private backendService: BackendService,
    private titleService: ToolbarTitleService,
    private changeDetector: ChangeDetectorRef,
    private dialogModel: MatDialog,
    private userService: UserInfoService) {
    this.titleService.changeTitle('Tarsio - Actions');
    this.userService.currentUser.subscribe((user: any) => {
      this.currentUserId = user._id;
      this.isAdmin = user.isAdmin;
    });
  }



  ngOnInit(): void {
    this.getAllActions(this.choosenStartDate, this.choosenEndDate, this.choosenPeri, this.choosenTypeMiss,
      this.piloteModel, this.choosenActionStatut, this.choosenTypeAction);

    this.backendService.getActivatedTypeMission().subscribe((res: any) => {
      this.tyMission = res;
    });
    this.backendService.getActivatedPeris().subscribe((res: any) => {
      this.perimeters = res;
    });
  }






  /**
   * The main function in this component
   * Get actions list with pagination ordering and filtring
   * @param dateStartStr 
   * @param dateEndStr 
   * @param perimeter 
   * @param Tymission 
   * @param pilote 
   * @param statut 
   * @param typeAction 
   */
  getAllActions(dateStartStr: string, dateEndStr: string, perimeter: string, Tymission: string,
    pilote: string, statut: string, typeAction: string) {

    this.loading = true;

    this.leaks = [];
    this.allAct = [];


    const dateStartSplit = dateStartStr.split('-');
    const dateEndSplit = dateEndStr.split('-');
    const startDate = new Date(Number(dateStartSplit[0]), Number(dateStartSplit[1]) - 1, Number(dateStartSplit[2]));
    const endDate = new Date(Number(dateEndSplit[0]), Number(dateEndSplit[1]) - 1, Number(dateEndSplit[2]))

    // Call the API
    this.backendService.getAllLeaks(this.page.orderBy, this.page.orderDir, this.page.offset + 1, this.page.limit,
      startDate, endDate, perimeter, Tymission, statut, typeAction, pilote).subscribe((res: any) => {
        const actions = res[0].leaks;

        if (actions.length === 0) {
          this.page.count = 0;
          this.loading = false;
          return;
        }
        this.page.count = res[0].total[0].count;
        this.leaks = [...actions];
        this.changeDetector.detectChanges();
        this.loading = false;
      }, (err: any) => {
        this.loading = false;
        console.error(err);
        this.backendService.showErrorDialog('Impossible de charger la liste des actions',
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
      this.getAllActions(this.choosenStartDate, this.choosenEndDate, this.choosenPeri, this.choosenTypeMiss,
        this.piloteModel, this.choosenActionStatut, this.choosenTypeAction);
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
      this.page.offset = 0;
      this.changeDetector.detectChanges();
      this.getAllActions(this.choosenStartDate, this.choosenEndDate, this.choosenPeri, this.choosenTypeMiss,
        this.piloteModel, this.choosenActionStatut, this.choosenTypeAction);
    }, 100);
  }



  /**
   * Search event on pilote
   * @param event 
   */
  onPiloteSearch(event: Event) {
    clearTimeout(this.timeOutFiltring);
    this.timeOutFiltring = setTimeout(() => {
      // Return to page 1
      this.page.offset = 0;
      this.getAllActions(this.choosenStartDate, this.choosenEndDate, this.choosenPeri, this.choosenTypeMiss,
        this.piloteModel, this.choosenActionStatut, this.choosenTypeAction);
      this.changeDetector.detectChanges();
    }, 500);
  }



  /**
   * Change event on start date
   */
  onStartDateChange() {
    this.page.offset = 0;
    this.getAllActions(this.choosenStartDate, this.choosenEndDate, this.choosenPeri, this.choosenTypeMiss,
      this.piloteModel, this.choosenActionStatut, this.choosenTypeAction);
  }


  /**
   * Change event on end date
   */
  onEndDateChange() {
    this.page.offset = 0;
    this.getAllActions(this.choosenStartDate, this.choosenEndDate, this.choosenPeri, this.choosenTypeMiss,
      this.piloteModel, this.choosenActionStatut, this.choosenTypeAction);
  }


  /**
   * Change event on typeMission
   */
  onTypeMissChange() {
    this.page.offset = 0;
    this.getAllActions(this.choosenStartDate, this.choosenEndDate, this.choosenPeri, this.choosenTypeMiss,
      this.piloteModel, this.choosenActionStatut, this.choosenTypeAction);
  }


  /**
   * Change event on perimeter
   */
  onPerimeterChange() {
    this.page.offset = 0;
    this.getAllActions(this.choosenStartDate, this.choosenEndDate, this.choosenPeri, this.choosenTypeMiss,
      this.piloteModel, this.choosenActionStatut, this.choosenTypeAction);
  }


  /**
   * Change event on action statut
   */
  onActStatutChange() {
    this.page.offset = 0;
    this.getAllActions(this.choosenStartDate, this.choosenEndDate, this.choosenPeri, this.choosenTypeMiss,
      this.piloteModel, this.choosenActionStatut, this.choosenTypeAction);
  }


  /**
   * Change event on action type
   */
  onActTypeChange() {
    this.page.offset = 0;
    this.getAllActions(this.choosenStartDate, this.choosenEndDate, this.choosenPeri, this.choosenTypeMiss,
      this.piloteModel, this.choosenActionStatut, this.choosenTypeAction);
  }





  /**
   * Open dialog to edit actions details
   * @param event 
   * @param row 
   */
  openEditActionDialog(event: Event, row: any) {
    event.stopPropagation();
    const rowToPass = [];
    rowToPass[13] = row.actionPilote;
    rowToPass[14] = this.backendService.inputDateFormat(new Date(row.actionDelai));
    rowToPass[15] = row.actionDesc;
    rowToPass[16] = row.actionCost;
    rowToPass[17] = row.actionStatut;


    const editDialog = this.dialogModel.open(ActionDialogComponent, {
      width: '500px',
      data: rowToPass,
      disableClose: true
    });

    editDialog.afterClosed().subscribe((editedRow: any) => {
      if (editedRow) {
        let apiRow = [];
        apiRow[13] = editedRow.pilote;
        apiRow[14] = editedRow.delais;
        apiRow[15] = editedRow.description;
        apiRow[16] = editedRow.cout;
        apiRow[17] = editedRow.statut;
        apiRow[19] = row._id;
        this.backendService.updateLeak(apiRow).subscribe((updatedRow: any) => {
          // TODO: show success toast instead
          this.backendService.showSuccessDialog('Action mise à jour avec succès', '');
          this.getAllActions(this.choosenStartDate, this.choosenEndDate, this.choosenPeri, this.choosenTypeMiss,
            this.piloteModel, this.choosenActionStatut, this.choosenTypeAction);
        }, (err: any) => {
          console.error('Error on updating action');
          console.error(err);
        });
      }
    });
  }



  /**
   * Print page
   */
  printThisPage() {
    window.print();
  }


  /**
   * Download PDF
   * 
   */
  openPDF(dateStartStr: string, dateEndStr: string, perimeter: string, Tymission: string,
    pilote: string, statut: string, typeAction: string) {
    let toDate = this.backendService.toDate;
    const dateStartSplit = dateStartStr.split('-');
    const startdate = new Date(Number(dateStartSplit[0]), Number(dateStartSplit[1]) - 1, Number(dateStartSplit[2]));
    const dateEndSplit = dateEndStr.split('-');
    const endDate = new Date(Number(dateEndSplit[0]), Number(dateEndSplit[1]) - 1, Number(dateEndSplit[2]));

    if (this.choosenPeri === 'all') {
      this.choosenPeri = 'Tout';
    }
    if (this.choosenTypeMiss === 'all') {
      this.choosenTypeMiss = 'Tout';
    }
    if (this.choosenTypeAction === 'all') {
      this.choosenTypeAction = 'Tout';
    }
    if (this.choosenActionStatut === 'all') {
      this.choosenActionStatut = 'Tout';
    }

    if (this.piloteModel === '') {
      this.piloteModel = '';
    }


    this.backendService.getAllLeaksInPdf(startdate, endDate, perimeter, Tymission, statut, typeAction, pilote).subscribe((res: any) => {

      this.ActionsPDF = res;

      let pdfContent = `
    <div #htmlData  class="htmlData" style="display:none;">
    <br>
    <br>
    <div class="d-flex justify-content-between" style="font-size:12px;">
    <b> Périmètre: </b> ${this.choosenPeri}  
    <b> Type Mission: </b> ${this.choosenTypeMiss}   
    </div> 
    <div class="d-flex justify-content-between" style="font-size:12px;">
        <b>  Pilote:  </b>  ${this.piloteModel} 
        <b> Statut: </b>  ${this.choosenActionStatut} 
        <b> Type d'action: </b>  ${this.choosenTypeAction}  
        </div>
        <div class="d-flex justify-content-between" style="font-size:12px;">
        <b> Date début: </b>${this.choosenStartDate}
        <b> Date fin: </b> ${this.choosenEndDate}
      </div>
      <br>

      <div class="leak-table-container">
      <table id="table" class="table table-striped" style="font-size:12px;">
      <thead>
        <tr>
          <th>Mission</th>
          <th>Nom Fuite</th>
          <th>Cout (€ /an)</th>
          <th>Action</th>
          <th>Pilote</th>
          <th>Date Cible</th>
          <th >Coût Réparation (€)</th>
          <th >Statut</th>
        </tr>
      </thead>
      <tbody>`;
      for (let i = 0; i < this.ActionsPDF.length; i++) {

        //
        pdfContent +=
          ` <tr>
            <td>${this.ActionsPDF[i].num_reservation}</td>
            <td>${this.ActionsPDF[i].leakName}</td>
            <td>${this.ActionsPDF[i].leakCost}</td>
            <td>${this.ActionsPDF[i].actionDesc}</td>
            <td>${this.ActionsPDF[i].actionPilote}</td>
            <td>${toDate(this.ActionsPDF[i].actionDelai)}</td>
            <td>${this.ActionsPDF[i].actionCost}</td>
            <td>${this.ActionsPDF[i].actionStatut}</td>
          </tr>`;
      }

      pdfContent += `</tbody></table></div></div></div>`;
      this.htmlData.nativeElement.innerHTML = pdfContent;


      const pdfTable = this.htmlData.nativeElement;

      var html = htmlToPdfMake(pdfTable.innerHTML);
      //{imagesByReference:true} 

      const documentDefinition = { content: html };
      pdfMake.createPdf(documentDefinition).open();

    });
  }

}