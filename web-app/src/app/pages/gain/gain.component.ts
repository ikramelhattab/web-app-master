import { Component, Host, ViewChild, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { ToolbarTitleService } from 'src/app/services/toolbar-title.service';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';

import { MatDialogRef } from '@angular/material/dialog';


import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

var htmlToPdfMake = require("html-to-pdfmake");
import { MatDialog } from '@angular/material/dialog';
import { ParetoGainComponent } from './ParetoGains/pareto_gain.component';

@Component({
  selector: 'app-gain',
  templateUrl: './gain.component.html',
  styleUrls: ['./gain.component.scss']
})
export class GainComponent implements OnInit {

  ParetoGainDialog?: MatDialogRef<ParetoGainComponent>;
  perimeters: Array<any> = [];
  tyMissionsList: Array<any> = [];
  gainList: Array<any> = [];
  leaks: Array<any> = [];
  GainsPDF:Array<any> = [];
  loading = false;

  // For pagination and ordering
  page: any = {
    limit: 5, // number of items by page
    count: 0, // Total numbers of items
    offset: 0, // page number
    orderBy: 'createdOn',
    orderDir: 'desc',
    filter: ''
  }
  choosenEndDate = '';
  choosenStartDate = '';
  public choosenPeri = 'all';
  public choosenTypeMiss = 'all';
  ColumnMode = ColumnMode;
  sortType = SortType.single
  timeOutPagination: any;
  timeOutSorting: any;
  timeOutFiltring: any;

  totalCostLeak = 0;
  totalCostAction = 0;
  totalGain = 0;
  totalGainCo2 = 0;

  toDate = this.backendService.toDate;

  // Custom class for the row
  getRowClass = (row: any) => {
    return {
      'gain-row': true,
    };
  }

  @ViewChild('htmlData', { static: false }) htmlData: any;


  constructor(private backendService: BackendService,
    private titleService: ToolbarTitleService,
    private changeDetector: ChangeDetectorRef,
    private dialogModel: MatDialog) {
    this.titleService.changeTitle('Tarsio - Gains');
  }




  ngOnInit(): void {
    this.getGains(this.choosenStartDate, this.choosenEndDate, this.choosenPeri, this.choosenTypeMiss);
    this.backendService.getActivatedTypeMission().subscribe((res: any) => {
      this.tyMissionsList = res;
    });

    this.backendService.getActivatedPeris().subscribe((res: any) => {
      this.perimeters = res;
    });
  }



  getGains(dateStartStr: string, dateEndStr: string, perimeter: string, tyMission: string) {
    this.loading = true;
    this.gainList = [];

    this.totalCostLeak = 0;
    this.totalCostAction = 0;
    this.totalGain = 0;
    this.totalGainCo2 = 0;

    const dateStartSplit = dateStartStr.split('-');
    const dateEndSplit = dateEndStr.split('-');
    const startDate = new Date(Number(dateStartSplit[0]), Number(dateStartSplit[1]) - 1, Number(dateStartSplit[2]));
    const endDate = new Date(Number(dateEndSplit[0]), Number(dateEndSplit[1]) - 1, Number(dateEndSplit[2]));

    this.backendService.getAllLeaks(this.page.orderBy, this.page.orderDir, this.page.offset + 1, this.page.limit,
      startDate, endDate, perimeter, tyMission, 'all', 'all', '').subscribe((res: any) => {
        const gains = res[0].leaks;

        if (gains.length === 0) {
          this.page.count = 0;
          this.loading = false;
          return;
        }

        this.page.count = res[0].total[0].count;
        this.totalCostLeak =  res[0].totalGain[0].totalCout;
        this.totalCostAction = res[0].totalGain[0].totalActionCost;
        this.totalGain = res[0].totalGain[0].totalGain;
        gains.forEach((g: any) => {
          this.backendService.getFacteur(g.equipId, g.createdOn).subscribe((f: any) => {
            this.totalGainCo2 += g.finalGain * f;
          }, (err: any) => {
            // TODO: show error toast
            console.error(err);
          });
        });
        this.leaks = [...gains];
        this.changeDetector.detectChanges();
        this.loading = false;
      }, (err: any) => {
        this.loading = false;
        console.error(err);
        this.backendService.showErrorDialog('Impossible de charger la liste des gains',
          'Essayer à nouveau plus tard');
      });
  }





  onStartDateChange() {
    this.page.offset = 0;
    this.getGains(this.choosenStartDate, this.choosenEndDate, this.choosenPeri, this.choosenTypeMiss);
  }


  onEndDateChange() {
    this.page.offset = 0;
    this.getGains(this.choosenStartDate, this.choosenEndDate, this.choosenPeri, this.choosenTypeMiss);
  }

  onTypeMissChange() {
    this.page.offset = 0;
    this.getGains(this.choosenStartDate, this.choosenEndDate, this.choosenPeri, this.choosenTypeMiss);
  }

  onPerimeterChange() {
    this.page.offset = 0;
    this.getGains(this.choosenStartDate, this.choosenEndDate, this.choosenPeri, this.choosenTypeMiss);
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
      this.getGains(this.choosenStartDate, this.choosenEndDate, this.choosenPeri, this.choosenTypeMiss);
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
      this.getGains(this.choosenStartDate, this.choosenEndDate, this.choosenPeri, this.choosenTypeMiss);
    }, 100);
  }



  public ParetoGains(): void {
    this.ParetoGainDialog = this.dialogModel.open(ParetoGainComponent);
  }


  public CumuleGains(): void {
  }




  //Print Page
  printThisPage() {
    window.print();
  }



  public openPDF(dateStartStr: string, dateEndStr: string,perimeter: string, tyMission: string) {
 
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
    
    this.backendService.getAllLeaksInPdf(startdate, endDate,perimeter, tyMission,'all', 'all', '').subscribe((res: any) => {
      this.GainsPDF = res;
 
    
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
      
      <table class="table table-striped" style="font-size:12px;">
        <thead>
          <tr>
            <th>Mission</th>
            <th>Nom Fuite</th>
            <th>Périmetre</th>
            <th>Type Mission</th>
            <th>Gain(€ /an)</th>
            <th>Action</th>
            <th>Date Cloture</th>
          </tr>
        </thead>
        <tbody>`;

    for (let i = 0; i < this.GainsPDF.length; i++) {
      pdfContent +=
        `<tr>
            <td>${this.GainsPDF[i].num_reservation}</td>
            <td>${this.GainsPDF[i].leakName}</td>
            <td>${this.GainsPDF[i].perimeterCode}</td>
            <td>${this.GainsPDF[i].typeMission}</td>
            <td>${this.GainsPDF[i].leakGain}</td>
            <td>${this.GainsPDF[i].actionDesc}</td>
            <td>${toDate(this.GainsPDF[i].actionDelai)}</td>
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