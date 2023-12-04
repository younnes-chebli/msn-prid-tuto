import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutes } from '../routing/app.routing';

import { AppComponent } from '../components/app/app.component';
import { NavMenuComponent } from '../components/nav-menu/nav-menu.component';
import { HomeComponent } from '../components/home/home.component';
import { CounterComponent } from '../components/counter/counter.component';
import { CounterStatelessComponent } from '../components/counter-stateless/counter-stateless.component';
import { CounterParentComponent } from '../components/counter-stateless/counter-parent.component';
import { FetchDataComponent } from '../components/fetch-data/fetch-data.component';
import { MemberListComponent } from '../components/memberlist/memberlist.component';
import { RestrictedComponent } from '../components/restricted/restricted.component';
import { UnknownComponent } from '../components/unknown/unknown.component';
import { JwtInterceptor } from '../interceptors/jwt.interceptor';
import { LoginComponent } from '../components/login/login.component';
import { EditNumberComponent } from '../components/number/edit-number.component';
import { NumberGroupComponent } from '../components/number/number-group.component';
import { NumbersContainerComponent } from '../components/number/numbers-container.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SetFocusDirective } from '../directives/setfocus.directive';
import { EditMemberComponent } from '../components/edit-member/edit-member.component';
import { SharedModule } from './shared.module';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { fr } from 'date-fns/locale';
import { RelationshipsComponent } from '../components/relationships/relationships.component';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    CounterStatelessComponent,
    CounterParentComponent,
    FetchDataComponent,
    MemberListComponent,
    LoginComponent,
    UnknownComponent,
    RestrictedComponent,
    EditNumberComponent,
    NumberGroupComponent,
    NumbersContainerComponent,
    SetFocusDirective,
    EditMemberComponent,
    RelationshipsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutes,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: fr },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['dd/MM/yyyy'],
        },
        display: {
          dateInput: 'dd/MM/yyyy',
          monthYearLabel: 'MMM yyyy',
          dateA11yLabel: 'dd/MM/yyyy',
          monthYearA11yLabel: 'MMM yyyy',
        },
      },
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
