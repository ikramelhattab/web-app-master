import { OnInit } from '@angular/core';
import { Component, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserInfoService } from 'src/app/services/user-info.service';
import { BackendService } from '../../services/backend.service';
import { ToolbarTitleService } from 'src/app/services/toolbar-title.service';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { MatDialogRef } from '@angular/material/dialog';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

var htmlToPdfMake = require("html-to-pdfmake");




@Component({
  selector: 'app-leaks',
  templateUrl: './leaks.component.html',
  styleUrls: ['./leaks.component.scss']
})

export class LeaksComponent implements OnInit {


  choosenStartDate = '';
  choosenEndDate = '';
  public leaks: Array<any> = [];
  public allLeaks: Array<any> = [];
  public LeaksPDF: Array<any> = [];

  @ViewChild('htmlData') htmlData!: ElementRef;
  perimeters: Array<any> = [];
  tyMissionsList: Array<any> = [];
  public choosenPeri = 'all';
  public choosenTypeMiss = 'all';
  loading = false;

  totalCost = 0;
  totalEmissionCo2 = 0;

  // For pagination and ordering
  page: any = {
    limit: 5, // number of items by page
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


  /**
    * Parse date and return date string with the format dd/mm/yyyy hh:mm
    */
  toDate = this.backendService.toDate;

  // Custom class for the row
  getRowClass = (row: any) => {
    return {
      'reserv-row': true,
    };
  }


  constructor(
    private backendService: BackendService,
    private userInfoService: UserInfoService,
    private titleService: ToolbarTitleService,
    private changeDetector: ChangeDetectorRef,
    private dialogModel: MatDialog,

  ) {
    this.titleService.changeTitle('Tarsio - Fuites');
  }


  ngOnInit(): void {


    this.backendService.getActivatedTypeMission().subscribe((res: any) => {
      this.tyMissionsList = res;
    });


    this.backendService.getActivatedPeris().subscribe((res: any) => {
      this.perimeters = res;
    });


    // Get leaks list
    this.getLeaks(this.choosenStartDate, this.choosenEndDate, this.choosenPeri, this.choosenTypeMiss);
   
  }


  //Print Page
  printThisPage() {
    window.print();
  }


  /**
   * Filter history date change event
   */
  onStartDateChange() {
    this.page.offset = 0;
    this.getLeaks(this.choosenStartDate, this.choosenEndDate, this.choosenPeri, this.choosenTypeMiss);
  }

  onEndDateChange() {
    this.page.offset = 0;
    this.getLeaks(this.choosenStartDate, this.choosenEndDate, this.choosenPeri, this.choosenTypeMiss);
  }

  onTypeMissChange() {
    this.page.offset = 0;
    this.getLeaks(this.choosenStartDate, this.choosenEndDate, this.choosenPeri, this.choosenTypeMiss);
  }

  onPerimeterChange() {
    this.page.offset = 0;
    this.getLeaks(this.choosenStartDate, this.choosenEndDate, this.choosenPeri, this.choosenTypeMiss);
  }






  /**
  * The main function in this component
  * Get list of leak with pagination
  * @param dateStartStr 
  * @param perimeter 
  * @param tyMission
  */

  getLeaks(dateStartStr: string, dateEndStr: string, perimeter: string, tyMission: string) {

    this.loading = true;

    this.leaks = [];
    this.allLeaks = [];

    this.totalCost = 0;
    this.totalEmissionCo2 = 0;

    const dateStartSplit = dateStartStr.split('-');
    const startdate = new Date(Number(dateStartSplit[0]), Number(dateStartSplit[1]) - 1, Number(dateStartSplit[2]));
    const dateEndSplit = dateEndStr.split('-');
    const endDate = new Date(Number(dateEndSplit[0]), Number(dateEndSplit[1]) - 1, Number(dateEndSplit[2]));
    // Call API
    this.backendService.getAllLeaks(this.page.orderBy, this.page.orderDir, this.page.offset + 1, this.page.limit,
      startdate, endDate, perimeter, tyMission, 'all', 'all', '').subscribe((res: any) => {
        const leaksList = res[0].leaks;

        if (leaksList.length === 0) {
          this.page.count = 0;
          this.loading = false;
          return;
        }

        this.page.count = res[0].total[0].count;
        this.totalCost = res[0].totalGain[0].totalCout
        this.totalEmissionCo2 = res[0].totalGain[0].totalEmissionCo2;
        this.leaks = [...leaksList];

        this.changeDetector.detectChanges();
        this.loading = false;
      }, (err: any) => {
        this.loading = false;
        console.error(err);
        this.backendService.showErrorDialog('Impossible de charger la liste des fuites',
          'Veuillez réessayer plus tard');
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
      this.getLeaks(this.choosenStartDate, this.choosenEndDate, this.choosenPeri, this.choosenTypeMiss);
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
      this.getLeaks(this.choosenStartDate, this.choosenEndDate, this.choosenPeri, this.choosenTypeMiss);
    }, 100);
  }


  /**
   * Download PDF
   */
  openPDF(dateStartStr: string, dateEndStr: string,perimeter: string, tyMission: string) {
    
    const dateStartSplit = dateStartStr.split('-');
    const startdate = new Date(Number(dateStartSplit[0]), Number(dateStartSplit[1]) - 1, Number(dateStartSplit[2]));
    const dateEndSplit = dateEndStr.split('-');
    const endDate = new Date(Number(dateEndSplit[0]), Number(dateEndSplit[1]) - 1, Number(dateEndSplit[2]));
    let toDate = this.backendService.toDate;

    if( this.choosenPeri === 'all'){
      this.choosenPeri='Tout';
    }
    if( this.choosenTypeMiss === 'all'){
      this.choosenTypeMiss='Tout';
    }
    // <div> <img src="assets/safran-logo.png" width="120px"></div>
    this.backendService.getAllLeaksInPdf(startdate, endDate,perimeter, tyMission,'all', 'all', '').subscribe((res: any) => {
      this.LeaksPDF = res;
 
    let pdfContent = `
    <div #htmlData class="htmlData" style="display:none;">
      <br>
      <br>
      <div class="d-flex justify-content-between" style="font-size:12px;">
        <b> Périmètre: </b>  ${this.choosenPeri}  
        <b> Type Mission: </b> ${this.choosenTypeMiss}    
        </div> 
        <div class="d-flex justify-content-between" style="font-size:12px;">
        <b> Date début: </b>${this.choosenStartDate}
        <b> Date fin: </b> ${this.choosenEndDate}
      </div>
      <br>
      <div class="leak-table-container">
      <table id="table" class="table table-striped" style="font-size:12px;" >
      <thead>
        <tr>
          <th>Nom Fuite</th>
          <th>Type</th>
          <th>Périmètre (€ /an)</th>
          <th>Numéro Reservation </th>
          <th>Coût (€) </th>
          <th>Emission CO2 (kg)</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody> `;

    for (let i = 0; i < this.LeaksPDF.length; i++) {

      pdfContent += `
        <tr>
          <td>${this.LeaksPDF[i].leakName} </td>
          <td>${this.LeaksPDF[i].typeMission} </td>
          <td>${this.LeaksPDF[i].perimeterCode} </td>
          <td>${this.LeaksPDF[i].num_reservation} </td>
          <td>${this.LeaksPDF[i].leakCost} </td>
          <td>${this.LeaksPDF[i].leakCo2.toFixed(2)} </td>
          <td>${this.LeaksPDF[i].actionStatut} </td>
        </tr>`;
    }

    pdfContent += `</tbody> </table></div> </div> </div>`;
    this.htmlData.nativeElement.innerHTML = pdfContent;

    const pdfTable = this.htmlData.nativeElement;

    var html = htmlToPdfMake(pdfTable.innerHTML);

    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).open();

   });
  }


}