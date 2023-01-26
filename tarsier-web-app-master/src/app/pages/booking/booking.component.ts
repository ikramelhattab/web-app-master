
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BackendService } from 'src/app/services/backend.service';
import { ToolbarTitleService } from 'src/app/services/toolbar-title.service';
import { UserInfoService } from 'src/app/services/user-info.service';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})



export class BookingComponent implements OnInit {


  public bookings: Array<any> = [];
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

  ColumnMode = ColumnMode;
  sortType = SortType.single
  timeOutPagination: any;
  timeOutSorting: any;
  timeOutFiltring: any;

  toDate = this.backendService.toDate;

  // Custom class for the row
  getRowClass = (row: any) => {
    return {
      'reserv-row': true,
    };
  }


  constructor(
    private router: Router,
    public dialog: MatDialog,
    private dialogModel: MatDialog,
    private backendService: BackendService,
    private userInfoService: UserInfoService,
    private titleService: ToolbarTitleService,
    private changeDetector: ChangeDetectorRef,
  ) {
    this.titleService.changeTitle('Tarsio - Reservations / Missions');
  }


  ngOnInit(): void {
    // Get reservation list
    this.getReservations();
  }


  /**
   * Open edit perimeter didalog
   * @param BookingId 
   */
  openDetailBooking(BookingId: any) {
  }







  /**
   * The main function in this component
   * Get list of booking with pagination
   */
  getReservations() {
    this.loading = true;
    this.bookings = [];
    this.backendService.getAllReservations(this.page.orderBy, this.page.orderDir, this.page.offset + 1, this.page.limit,
      this.page.filter).subscribe((res: any) => {
        const reservsList = res[0].bookings;

        if (reservsList.length === 0) {
          this.page.count = 0;
          this.loading = false;
          return;
        }

        this.page.count = res[0].total[0].count;
        reservsList.forEach((r: any) => {
          this.bookings.push({
            id: r._id,
            num_reservation: r.num_reservation,
            start: new Date(r.start),
            end: new Date(r.end),
            statut: r.statut,
            createdOn: new Date(r.createdOn),
            responsable: r.responsable,
            typeMission: r.typeMission,
            equipement: r.equipement,
            perimeter: r.perimeter,
            initiateur: r.initiateur
          });
        });

        this.bookings = [...this.bookings];
        this.changeDetector.detectChanges();
        this.loading = false;
      },
        (err: any) => {
          this.loading = false;
          console.error(err);
          this.backendService.showErrorDialog('Impossible de charger la liste des reservations',
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
      this.getReservations();
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
      this.getReservations();
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
      this.getReservations();
      this.changeDetector.detectChanges();
    }, 500);
  }






}
