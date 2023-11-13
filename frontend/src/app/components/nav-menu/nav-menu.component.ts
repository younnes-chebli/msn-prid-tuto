import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from 'src/app/models/member';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
    isExpanded = false;

    constructor(
        private router: Router,
        public authenticationService: AuthenticationService
    ) { }

    get currentUser() {
        return this.authenticationService.currentUser;
    }

    get isAdmin() {
        return this.currentUser && this.currentUser.role === Role.Admin;
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

    collapse() {
        this.isExpanded = false;
    }

    toggle() {
        this.isExpanded = !this.isExpanded;
    }
}
