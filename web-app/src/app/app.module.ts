import { APP_INITIALIZER, Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutComponent } from './containers/layout/layout.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { BookingComponent } from './pages/booking/booking.component';
import { GainComponent } from './pages/gain/gain.component';
import { ParetoGainComponent } from './pages/gain/ParetoGains/pareto_gain.component';

import { LeaksComponent } from './pages/leaks/leaks.component';
import { ActionsComponent } from './pages/actions/actions.component';
import { LoginComponent } from './pages/login/login.component';
import { PerimetersComponent } from './pages/perimeters/perimeters.component';
import { TypeEquipementComponent } from './pages/typeEquipement/typeEquipement.component';
import { TypesMissionComponent } from './pages/typesMission/typesMission.component';
import { FreqContrComponent } from './pages/frequenceContr/frequenceContr.component';
import { EquipementsComponent } from './pages/equipements/equipements.component';

import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialDialogComponent } from './containers/material-dialog/material-dialog.component';
import { PreloadFactory, PreloadService } from './services/preload.service';
import { UsersSettingsComponent } from './pages/users-settings/users-settings.component';
import { CalendarDateFormatter, CalendarModule, CalendarNativeDateFormatter, DateAdapter, DateFormatterParams } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { BookingEventDialogComponent } from './pages/booking/booking-event-dialog/booking-event-dialog.component';
import { BookingDetailsComponent } from './pages/booking/booking-details/booking-details.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AddUserComponent } from './pages/users-settings/add-user/add-user.component';
import { EditUserComponent } from './pages/users-settings/edit-user/edit-user.component';
import { ActionDialogComponent } from './pages/booking/reservation-details/action-dialog/action-dialog.component';

import { EditPeriDialogComponent } from './pages/perimeters/edit-dialog/edit-dialog.component';
import { NewPerimeterDialogComponent } from './pages/perimeters/new-perimeter-dialog/new-perimeter-dialog.component';

import { EquipementDialogComponent } from './pages/equipements/equipements-dialog/equipement-dialog.component';
import { EditEquipDialogComponent } from './pages/equipements/edit-dialog/edit-dialog.component';


import { EditTypeEquipementDialogComponent } from './pages/typeEquipement/edit-dialog/edit-dialog.component';
import { typeEquipementDialogComponent } from './pages/typeEquipement/typeEquipement-dialog/typeEquipement-dialog.component';

import { EditTypesMissionDialogComponent } from './pages/typesMission/edit-dialog/edit-dialog.component';
import { TypesMissionDialogComponent } from './pages/typesMission/typesMission-dialog/typesMission-dialog.component';

import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { ChartsModule } from 'ng2-charts';

import { NewBookingComponent } from './pages/booking/newBooking/newBooking.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { EditDialogComponent } from './pages/booking/reservation-details/edit-dialog/edit-dialog.component';

import { PlanDialogComponent } from './pages/perimeters/plan-dialog/plan-dialog.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';

import { ReservationDetailsComponent } from './pages/booking/reservation-details/reservation-details.component';
import { MatCardModule } from '@angular/material/card';
import { EnterPasswordComponent } from './pages/login/enter-password/enter-password.component';
import { CreatePasswordComponent } from './pages/login/create-password/create-password.component';
import { EqpImgModalComponent } from './pages/equipements/eqp-img-modal/eqp-img-modal.component';

import { ToastrModule } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


registerLocaleData(localeFr);

@Injectable()
class CustomDateFormatter extends CalendarNativeDateFormatter {
  public dayViewHour({ date, locale }: DateFormatterParams): string {
    // change this to return a different date format
    return new Intl.DateTimeFormat(locale, { hour: 'numeric' }).format(date);
  }
}

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    BookingComponent,
    GainComponent,
    LeaksComponent,
    ActionsComponent,
    LoginComponent,
    MaterialDialogComponent,
    UsersSettingsComponent,
    BookingEventDialogComponent,
    BookingDetailsComponent,
    PerimetersComponent,
    TypesMissionComponent,
    EquipementsComponent,
    FreqContrComponent,
    AddUserComponent,
    EditUserComponent,
    ActionDialogComponent,
    NewPerimeterDialogComponent,
    EditDialogComponent,
    EditPeriDialogComponent,
    PlanDialogComponent,
    typeEquipementDialogComponent,
    EditTypeEquipementDialogComponent,
    TypesMissionDialogComponent,
    EditTypesMissionDialogComponent,
    EquipementDialogComponent,
    EditEquipDialogComponent,
    TypeEquipementComponent,
    NewBookingComponent,
    ReservationDetailsComponent,
    EnterPasswordComponent,
    CreatePasswordComponent,
    EqpImgModalComponent,
    ParetoGainComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    MatTabsModule,
    MatIconModule,
    NgxDatatableModule,
    Ng2SearchPipeModule,
    ChartsModule,
    NgxPaginationModule,
    CommonModule,
    NgxImageZoomModule,
    MatCardModule,
    ToastrModule.forRoot(),
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,

  ],


  providers: [
    // Make sure preload service will run every time the app load
    {
      provide: APP_INITIALIZER,
      useFactory: PreloadFactory,
      deps: [PreloadService],
      multi: true
    },
    // Use french hours formatter
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
