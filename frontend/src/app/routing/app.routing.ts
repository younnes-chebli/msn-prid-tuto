import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from '../components/home/home.component';
import { CounterComponent } from '../components/counter/counter.component';
import { CounterParentComponent } from '../components/counter-stateless/counter-parent.component';
import { FetchDataComponent } from '../components/fetch-data/fetch-data.component';
import { MemberListComponent } from '../components/memberlist/memberlist.component';
import { RestrictedComponent } from '../components/restricted/restricted.component';
import { LoginComponent } from '../components/login/login.component';
import { UnknownComponent } from '../components/unknown/unknown.component';
import { AuthGuard } from '../services/auth.guard';
import { Role } from '../models/member';
import { NumbersContainerComponent } from '../components/number/numbers-container.component';
import { RelationshipsComponent } from '../components/relationships/relationships.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'counter', component: CounterComponent },
    { path: 'counter-stateless', component: CounterParentComponent },
    { path: 'fetch-data', component: FetchDataComponent },
    {
        path: 'members',
        component: MemberListComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
    },
    {
        path: 'friends',
        component: RelationshipsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'numbers',
        component: NumbersContainerComponent
    },
    { path: 'restricted', component: RestrictedComponent },
    { path: '**', component: UnknownComponent }
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
