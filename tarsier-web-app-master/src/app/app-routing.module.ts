import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './containers/layout/layout.component';
import { AuthGuard } from './guards/auth.guard';
import { BookingComponent } from './pages/booking/booking.component';
import { GainComponent } from './pages/gain/gain.component';
import { LeaksComponent } from './pages/leaks/leaks.component';
import { ActionsComponent } from './pages/actions/actions.component';
import { LoginComponent } from './pages/login/login.component';
import { UsersSettingsComponent } from './pages/users-settings/users-settings.component';
import { PerimetersComponent } from './pages/perimeters/perimeters.component';
import { TypeEquipementComponent } from './pages/typeEquipement/typeEquipement.component';
import { TypesMissionComponent } from './pages/typesMission/typesMission.component';
import { FreqContrComponent } from './pages/frequenceContr/frequenceContr.component';
import { EquipementsComponent } from './pages/equipements/equipements.component';
import { NewBookingComponent } from './pages/booking/newBooking/newBooking.component';
import { ReservationDetailsComponent } from './pages/booking/reservation-details/reservation-details.component';
import { EnterPasswordComponent } from './pages/login/enter-password/enter-password.component';
import { CreatePasswordComponent } from './pages/login/create-password/create-password.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'bookings',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'enter-password',
    component: EnterPasswordComponent
  },
  {
    path: 'create-password',
    component: CreatePasswordComponent
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'bookings',
        component: BookingComponent
      },
      {
        path: 'addBooking',
        component: NewBookingComponent
      },
      {
        path: 'reservationDetails',
        component: ReservationDetailsComponent
      },
      {
        path: 'gain',
        component: GainComponent
      },
      {
        path: 'leaks',
        component: LeaksComponent
      },
      {
        path: 'actions',
        component: ActionsComponent
      },
      {
        path: 'perimeters',
        component: PerimetersComponent
      },
      {
        path: 'equipements',
        component: EquipementsComponent
      },
      {
        path: 'typeEquipement',
        component: TypeEquipementComponent
      },
      {
        path: 'typesMission',
        component: TypesMissionComponent
      },
      {
        path: 'FrequenceControle',
        component: FreqContrComponent
      },
      {
        path: 'users-settings',
        component: UsersSettingsComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
