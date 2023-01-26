import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay, CalendarView } from 'angular-calendar';
import { addDays, addHours, endOfDay, endOfMonth, isSameDay, isSameHour, isSameMonth, startOfDay, subDays } from 'date-fns';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { BookingDetailsComponent } from 'src/app/pages/booking/booking-details/booking-details.component';
import { BookingEventDialogComponent } from 'src/app/pages/booking/booking-event-dialog/booking-event-dialog.component';
import { BackendService } from 'src/app/services/backend.service';
import { ToolbarTitleService } from 'src/app/services/toolbar-title.service';
import { UserInfoService } from 'src/app/services/user-info.service';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-booking',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './newBooking.component.html',
  styleUrls: ['./newBooking.component.scss'],
})



export class NewBookingComponent implements OnInit {


  public reservations: Array<any> = [];

  reservList: Array<any> = [];

  ColumnMode = ColumnMode;
  sortType = SortType.single
  timeOutPagination: any;
  timeOutSorting: any;
  timeOutFiltring: any;


  // Custom class for the row
  getRowClass = (row: any) => {
    return {
      'reserv-row': true,
    };
  }




  colors: any = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3',
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF',
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA',
    },
  };

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any> | undefined;
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  } | undefined;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = [];

  loadingEvents = false;

  loading = false;

  activeDayIsOpen: boolean = true;


  constructor(
    public dialog: MatDialog,
    private backendService: BackendService,
    private userInfoService: UserInfoService,
    private titleService: ToolbarTitleService,
    private changeDetector: ChangeDetectorRef,
  ) {
    this.titleService.changeTitle('Tarsio - Reservations / Missions – Nouvelle réservation');
  }


  ngOnInit(): void {
    // Get reservation list
    this.loadReservations();
  }
  ///////////////////////////////////////
  /**
   * Load reservations from the backend service
   * our main function!
   */
  loadReservations() {
    this.loadingEvents = true;
    this.events = [];
    const datesRange = this.getDateRange(this.view, this.viewDate);
    this.backendService.getReservations(datesRange.fromDate, datesRange.toDate).subscribe(
      (bookingList: any) => {
        bookingList.forEach((booking: any) => {
          const fromDate = new Date(booking.start);
          const toDate = new Date(booking.end);
          const createdOnDate = new Date(booking.createdOn)
          const fromHour = ('0' + fromDate.getHours()).slice(-2) + ':' + ('0' + fromDate.getMinutes()).slice(-2);
          const toHour = ('0' + toDate.getHours()).slice(-2) + ':' + ('0' + toDate.getMinutes()).slice(-2);
          const fromDay = ('0' + fromDate.getDate()).slice(-2) + '/' + ('0' + (fromDate.getMonth() + 1)).slice(-2) + '/'
            + fromDate.getFullYear();
          const toDay = ('0' + toDate.getDate()).slice(-2) + '/' + ('0' + (toDate.getMonth() + 1)).slice(-2) + '/'
            + toDate.getFullYear();
          this.events.push({
            start: fromDate,
            end: toDate,
            title: (booking.userId ? (booking.userId.firstName + ' ' + booking.userId.lastName) : 'Utilisateur supprimé')
              + '<br>'
              + 'de: ' + fromDay + ' ' + fromHour
              + '<br>'
              + 'à: ' + toDay + ' ' + toHour
              + '<br>'
              + 'Mission: ' + booking.typeMissionId.typeMission
              + '<br>'
              + 'Equipement: ' + booking.equipId.code
              + '<br>'
              + 'Perimétre: ' + booking.perimeterId.code,
            id: booking._id,
            meta: {
              createdBy: booking.userId ? (booking.userId.firstName + ' ' + booking.userId.lastName) : 'Utilisateur supprimé',
              createdOn: createdOnDate,
              user: booking.userId ? (booking.userId.firstName + ' ' + booking.userId.lastName) : 'Utilisateur supprimé',
              userId: booking.userId?._id,
              statut: booking.statut,
              typeMissionId: booking.typeMissionId,
              perimeterId: booking.perimeterId,
              equipId: booking.equipId,
              num_reservation: booking.num_reservation
            },
            cssClass: 'tarsier-event'
          });
        });
        this.refresh.next();
        this.loadingEvents = false;
      },

      (err: any) => {
        console.error(err);
        this.backendService.showErrorDialog('Impossible de charger les reservations!',
          'Veuillez essayer à nouveau plus tard.');
        this.loadingEvents = false;
      }
    );
  }





  /**
   * Day clicked event on month view
   * to view bookings of that day
   */
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }





  /**
   * Day double clicked event on month view
   * to show new booking dialog
   * @param event 
   */
  doubleClickDay(event: any) {
    const clickedDate = new Date(event.date);
    //  Do not dispaly dialog unles it's today or after today
    if (clickedDate.getTime() < new Date().getTime()) {
      if (!isSameDay(clickedDate, new Date())) {
        return;
      }
    }
    const dateStr = clickedDate.getFullYear() + '-' + ('0' + (clickedDate.getMonth() + 1)).slice(-2) + '-'
      + ('0' + clickedDate.getDate()).slice(-2);
    const hourStr = ('0' + clickedDate.getHours()).slice(-2) + ':' + ('0' + clickedDate.getMinutes()).slice(-2);

    const addBookingDialog = this.dialog.open(BookingEventDialogComponent, {
      width: '500px',
      disableClose: true,
      data: {
        startDay: dateStr,
        startHour: hourStr,
        endDay: '',
        endHour: ''
      }
    });
    addBookingDialog.afterClosed().subscribe(addedReservation => {
      if (addedReservation) {
        this.loadReservations();
      }
    });
  }





  /**
   * Hour clicked event on week or day view
   * to show new booking dialog
   * And add a reservation
   * @param event 
   */
  hourClicked(event: any) {
    const clickedDate = new Date(event.date);
    const clickedDateEnd = new Date(clickedDate.getTime() + 60 * 60000);

    // Do not display dialog unless the clicked date is after now
    if (clickedDate.getTime() < new Date().getTime()) {
      if (!isSameHour(clickedDate, new Date())) {
        return;
      }
    }

    const dateStr = clickedDate.getFullYear() + '-' + ('0' + (clickedDate.getMonth() + 1)).slice(-2) + '-'
      + ('0' + clickedDate.getDate()).slice(-2);
    const hourStr = ('0' + clickedDate.getHours()).slice(-2) + ':' + ('0' + clickedDate.getMinutes()).slice(-2);

    const dateStrEnd = clickedDateEnd.getFullYear() + '-' + ('0' + (clickedDateEnd.getMonth() + 1)).slice(-2) + '-'
      + ('0' + clickedDateEnd.getDate()).slice(-2);
    const hourEndStr = ('0' + clickedDateEnd.getHours()).slice(-2) + ':' + ('0' + clickedDateEnd.getMinutes()).slice(-2);

    const addBookingDialog = this.dialog.open(BookingEventDialogComponent, {
      width: '500px',
      disableClose: true,
      data: {
        startDay: dateStr,
        startHour: hourStr,
        endDay: dateStrEnd,
        endHour: hourEndStr,
      }
    });
    addBookingDialog.afterClosed().subscribe(addedReservation => {
      if (addedReservation) {
        this.loadReservations();
      }
    });
  }





  /**
   * If you want drop and resize events on the reservations
   * Todo: use this function later
   * @param param0 
   */
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }







  /**
   * Handle click on the reservation to show reservation dialog details
   * which provide a possibility to cancel the reservation
   * @param action 
   * @param event 
   */
  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    if ('Clicked') {
      // An event clicked! Show event details modal
      const detailsDialog = this.dialog.open(BookingDetailsComponent, {
        width: '500px',
        disableClose: true,
        data: {
          start: event.start,
          end: event.end,
          user: event.meta.user,
          createdBy: event.meta.createdBy,
          createdOn: event.meta.createdOn,
          userId: event.meta.userId, // Pass the userId of the person who have the reservation
          bookingId: event.id,
          statut: event.meta.statut,
          typeMissionId: event.meta.typeMissionId.typeMission,
          perimeterId: event.meta.perimeterId.code,
          equipId: event.meta.equipId.code,
          num_reservation: event.meta.num_reservation,


        }
      });
      detailsDialog.afterClosed().subscribe((deletedBookingId: string) => {
        if (deletedBookingId) {
          // The reservation was deleted
          this.events = this.events.filter(evt => {
            return evt.id !== deletedBookingId;
          });
          this.refresh.next();
          this.backendService.showSuccessDialog('Réservation annulée avec succées', '');
        }
      });
    }
  }





  /**
   * This function is triggered whenever the user change view: 'mois', 'semaine', 'jour'
   * @param view 
   */
  setView(view: CalendarView) {
    this.view = view;
    this.loadReservations();
  }





  /**
   * This function triggers everytime the user clicks on 'précedent', 'suivant'
   */
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
    this.loadReservations();
  }







  /**
   * Get date range of the current view of the calendar
   * @param calView string
   * @param calViewDate Date
   * @returns object {fromDate: Date, toDate: Date}
   */
  getDateRange(calView: string, calViewDate: Date) {
    let fromDate = new Date();
    let toDate = new Date();
    if (calView === 'day') {
      fromDate = new Date(calViewDate.getFullYear(), calViewDate.getMonth(), calViewDate.getDate(), 0, 0, 0, 0);
      toDate = new Date(calViewDate.getFullYear(), calViewDate.getMonth(), calViewDate.getDate(), 23, 59, 59, 999);
      return { fromDate, toDate };
    }
    if (calView === 'week') {
      const d = new Date(calViewDate.getFullYear(), calViewDate.getMonth(), calViewDate.getDate(), 0, 0, 0, 0);
      const day = calViewDate.getDay();
      const diffToMonday = calViewDate.getDate() - day + (day == 0 ? -6 : 1);
      fromDate = new Date(d.setDate(diffToMonday));
      toDate = new Date(d.setDate(diffToMonday + 7));
      return { fromDate, toDate };
    }
    // calView === 'month'
    fromDate = new Date(calViewDate.getFullYear(), calViewDate.getMonth(), 1, 0, 0, 0, 0);
    toDate = new Date(calViewDate.getFullYear(), calViewDate.getMonth() + 1, 0);
    // Add a margin of week because the calendar view display days from previous and after month
    fromDate.setDate(fromDate.getDate() - 7);
    toDate.setDate(toDate.getDate() + 7);
    return { fromDate, toDate };
  }






  /**
   * This policy method is used to apply specifc style to hour cells before today on the calendar
   * @param param0 
   */
  applyWeekDateSelectionPolicy({ hourColumns }: { hourColumns: any }) {
    hourColumns.forEach((dayColumn: any) => {
      dayColumn.hours.forEach((hour: any) => {
        hour.segments.forEach((segment: any) => {
          if (segment.date.getTime() < new Date().getTime()) {
            if (!isSameHour(segment.date, new Date())) {
              segment.cssClass = 'disabled-date';
            }
          }
        });
      });
    });
  }

}