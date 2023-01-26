import { Component, Host, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets, ChartPoint } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { BackendService } from 'src/app/services/backend.service';
import { ToolbarTitleService } from 'src/app/services/toolbar-title.service';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-gain',
  templateUrl: './pareto_gain.component.html',
  styleUrls: ['./pareto_gain.component.scss']
})


export class ParetoGainComponent implements OnInit {

  emptyData = false;
  loadingChart = false;

  choosenStartDate = '';
  choosenEndDate = '';

  perimeters: Array<any> = [];
  periList: Array<any> = [];
  // ----
  // Gain charts
  // ----
  public gainData: Array<any> = [];
  totalGain = 0;
  public gainTotalData:any;

  public gainChartLabels: Label[] = [];

  public gainChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    maintainAspectRatio: false,
    annotation: {}
  };

  public gainChartColours: Color[] = [
    { // blue
      backgroundColor: Array(31).fill('#182a5a'),
    },
  ];

  public gainChartLegend = true;
  public gainChartType: ChartType = 'bar';
  public gainChartPlugins = [];
  public gainLabel: any = [''];


  public gainChartDataSets: ChartDataSets[] = [];



  // ----
  // Filter stuffs
  // ----
  chartView = 'hour';
  choosenPlan = 'all';
  choosenDay = '';
  choosenMonth = new Date();
  choosenYear = new Date();
  possibleMonths: Array<{ value: Date, label: string }> = [];
  possibleYears: Array<any> = [];




  constructor(private backendService: BackendService,
    private titleService: ToolbarTitleService,
    public dialogRef: MatDialogRef<ParetoGainComponent>,
  ) {

    this.titleService.changeTitle('Tarsio - Gains');

    this.choosenStartDate = this.backendService.inputDateFormat(new Date()) as string;
    this.choosenEndDate = this.backendService.inputDateFormat(new Date()) as string;

  }



  ngOnInit(): void {

    this.backendService.getActivatedPeris().subscribe((res: any) => {
      this.perimeters = res;

      for (let i = 0; i < this.perimeters.length; i++) {
        this.periList.push(this.perimeters[i].code);
        // this.gainChartLabels = this.periList;
      }
    });

    this.getGainData(this.choosenStartDate, this.choosenEndDate);
  }



  /**
   * Our main function to get chart data
   * @param dateStartStr 
   * @param dateEndStr 
   */
  getGainData(dateStartStr: string, dateEndStr: string) {

    this.gainData = [];
    this.periList = [];

this.gainTotalData=0;
    this.totalGain = 0;


    // Init charts
    this.emptyData = false;
    this.loadingChart = true;


    for (let i = 0; i < this.perimeters.length; i++) {
      this.periList.push(this.perimeters[i].code);
      this.gainChartLabels = this.periList;

      const dateStartSplit = dateStartStr.split('-');
      const startdate = new Date(Number(dateStartSplit[0]), Number(dateStartSplit[1]) - 1, Number(dateStartSplit[2]));
      const dateEndSplit = dateEndStr.split('-');
      const endDate = new Date(Number(dateEndSplit[0]), Number(dateEndSplit[1]) - 1, Number(dateEndSplit[2]));

      this.backendService.getGainData(startdate, endDate).subscribe((res: any) => {
        const costGroup = res[0];

        this.totalGain = res[0].totalGain;

        this.gainTotalData += res[0].totalGain[i].totalGain;
        this.gainData.push(res[0].totalGain[i].totalGain);

        // Draw charts
        this.gainChartDataSets = [{
          data:  this.gainData, label: res[0].totalGain[i]._id.code
        }];
        this.loadingChart = false;
      }, error => {
        console.error(error);
        this.backendService.showErrorDialog('Une erreur inattendue est survenue', 'Veuillez réessayer plus tard.');
        this.loadingChart = false;
      });
    }
  }


  /**
 * Filter history date change event
 */
  onStartDateChange() {
    this.getGainData(this.choosenStartDate, this.choosenEndDate);
  }

  onEndDateChange() {
    this.getGainData(this.choosenStartDate, this.choosenEndDate);
  }


}