import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { ForgotPasswordComponent } from './features/forgot-password/forgot-password.component';
import { ResetCodeVerificationComponent } from './features/reset-code-verification/reset-code-verification.component';
import { PasswordResetComponent } from './features/password-reset/password-reset.component';
import { EventsComponent } from './features/events/events.component';
import { SingleEventComponent } from './features/events/single-event/single-event.component';
import { EventListComponent } from './features/events/event-list/event-list.component';
import { AttendeeComponent } from './features/attendee/attendee.component';
import { AttendeeProfileComponent } from './features/attendee/attendee-profile/attendee-profile.component';
import { AttendeeLogoutComponent } from './features/attendee/attendee-logout/attendee-logout.component';
import { AdminComponent } from './features/admin/admin.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { AdminProfileComponent } from './features/admin/admin-profile/admin-profile.component';
import { AdminLogoutComponent } from './features/admin/admin-logout/admin-logout.component';
import { OrganizerComponent } from './features/organizer/organizer.component';
import { OrganizerDashboardComponent } from './features/organizer/organizer-dashboard/organizer-dashboard.component';
import { OrganizerProfileComponent } from './features/organizer/organizer-profile/organizer-profile.component';
import { OrganizerLogoutComponent } from './features/organizer/organizer-logout/organizer-logout.component';
import { PageNotFoundComponent } from './features/page-not-found/page-not-found.component';
import { OrganizerEventsComponent } from './features/organizer/organizer-events/organizer-events.component';
import { AdminOrganizersComponent } from './features/admin/admin-organizers/admin-organizers.component';
import { AdminAttendeesComponent } from './features/admin/admin-attendees/admin-attendees.component';
import { AdminEventsComponent } from './features/admin/admin-events/admin-events.component';
import { AdminNotificationsComponent } from './features/admin/admin-notifications/admin-notifications.component';
import { AdminAdminsComponent } from './features/admin/admin-admins/admin-admins.component';
import { AdminUsersComponent } from './features/admin/admin-users/admin-users.component';
import { OrganizerCalendarComponent } from './features/organizer/organizer-calendar/organizer-calendar.component';
import { AttendeeDashboardComponent } from './features/attendee/attendee-dashboard/attendee-dashboard.component';
import { AttendeeEventsComponent } from './features/attendee/attendee-events/attendee-events.component';
import { AttendeeCalendarComponent } from './features/attendee/attendee-calendar/attendee-calendar.component';
import { OrganizerMessagesComponent } from './features/organizer/organizer-messages/organizer-messages.component';
import { AttendeeMessagesComponent } from './features/attendee/attendee-messages/attendee-messages.component';
import { AdminCategoriesComponent } from './features/admin/admin-categories/admin-categories.component';
import { TicketsComponent } from './features/tickets/tickets.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-code/verify', component: ResetCodeVerificationComponent },
  { path: 'password-reset', component: PasswordResetComponent },
  { path: 'tickets', component: TicketsComponent },
  {
    path: 'events', component: EventsComponent, children: [
      { path: ':id', component: SingleEventComponent },
      { path: '', component: EventListComponent },
    ]
  },
  {
    path: 'attendee', component: AttendeeComponent, children: [
      { path: 'dashboard', component: AttendeeDashboardComponent },
      { path: 'events', component: AttendeeEventsComponent },
      { path: 'calendar', component: AttendeeCalendarComponent },
      { path: 'messages', component: AttendeeMessagesComponent },
      { path: 'profile', component: AttendeeProfileComponent },
      { path: 'logout', component: AttendeeLogoutComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },
  {
    path: 'organizer', component: OrganizerComponent, children: [
      { path: 'dashboard', component: OrganizerDashboardComponent },
      { path: 'events', component: OrganizerEventsComponent },
      { path: 'calendar', component: OrganizerCalendarComponent },
      { path: 'messages', component: OrganizerMessagesComponent },
      { path: 'profile', component: OrganizerProfileComponent },
      { path: 'logout', component: OrganizerLogoutComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },
  {
    path: 'admin', component: AdminComponent, children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'admins', component: AdminAdminsComponent },
      { path: 'organizers', component: AdminOrganizersComponent },
      { path: 'attendees', component: AdminAttendeesComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'events', component: AdminEventsComponent },
      { path: 'categories', component: AdminCategoriesComponent },
      { path: 'notifications', component: AdminNotificationsComponent },
      { path: 'profile', component: AdminProfileComponent },
      { path: 'logout', component: AdminLogoutComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];
