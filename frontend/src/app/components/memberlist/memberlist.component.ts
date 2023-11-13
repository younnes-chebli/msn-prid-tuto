import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';
import { Member } from '../../models/member';
import { MemberService } from '../../services/member.service';
import { EditMemberComponent } from '../edit-member/edit-member.component';
import { StateService } from 'src/app/services/state.service';
import { MatTableState } from 'src/app/helpers/mattable.state';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { plainToClass } from 'class-transformer';
import { format, formatISO } from 'date-fns';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
    selector: 'app-memberlist',
    templateUrl: './memberlist.component.html',
    styleUrls: ['./memberlist.component.css']
})
export class MemberListComponent implements AfterViewInit, OnDestroy {
    displayedColumns: string[] = ['pseudo', 'fullName', 'birthDate', 'role', 'actions'];
    dataSource: MatTableDataSource<Member> = new MatTableDataSource();
    filter: string = '';
    state: MatTableState;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private memberService: MemberService,
        private stateService: StateService,
        private authService: AuthenticationService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar
    ) {
        this.state = this.stateService.memberListState;
    }

    ngAfterViewInit(): void {
        // lie le datasource au sorter et au paginator
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // définit le predicat qui doit être utilisé pour filtrer les membres
        this.dataSource.filterPredicate = (data: Member, filter: string) => {
            const str = data.pseudo + ' ' + data.fullName + ' ' + (data.birthDate ? format(data.birthDate!, 'dd/MM/yyyy') : '') + ' ' + data.roleAsString;
            return str.toLowerCase().includes(filter);
        };
        // établit les liens entre le data source et l'état de telle sorte que chaque fois que 
        // le tri ou la pagination est modifié l'état soit automatiquement mis à jour
        this.state.bind(this.dataSource);
        // récupère les données 
        this.refresh();
    }

    refresh() {
        this.memberService.getAll().subscribe(members => {
            // assigne les données récupérées au datasource
            this.dataSource.data = members;
            // restaure l'état du datasource (tri et pagination) à partir du state
            this.state.restoreState(this.dataSource);
            // restaure l'état du filtre à partir du state
            this.filter = this.state.filter;
        });
    }

    // appelée chaque fois que le filtre est modifié par l'utilisateur
    filterChanged(e: KeyboardEvent) {
        const filterValue = (e.target as HTMLInputElement).value;
        // applique le filtre au datasource (et provoque l'utilisation du filterPredicate)
        this.dataSource.filter = filterValue.trim().toLowerCase();
        // sauve le nouveau filtre dans le state
        this.state.filter = this.dataSource.filter;
        // comme le filtre est modifié, les données aussi et on réinitialise la pagination
        // en se mettant sur la première page
        if (this.dataSource.paginator)
            this.dataSource.paginator.firstPage();
    }

    // appelée quand on clique sur le bouton "edit" d'un membre
    edit(member: Member) {
        const dlg = this.dialog.open(EditMemberComponent, { data: { member, isNew: false } });
        dlg.beforeClosed().subscribe(res => {
            if (res) {
                _.assign(member, res);
                this.memberService.update(member).subscribe(res => {
                    if (!res) {
                        this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
                        this.refresh();
                    }
                });
            }
        });
    }

    // appelée quand on clique sur le bouton "delete" d'un membre
    delete(member: Member) {
        const backup = this.dataSource.data;
        this.dataSource.data = _.filter(this.dataSource.data, m => m.pseudo !== member.pseudo);
        const snackBarRef = this.snackBar.open(`Member '${member.pseudo}' will be deleted`, 'Undo', { duration: 10000 });
        snackBarRef.afterDismissed().subscribe(res => {
            if (!res.dismissedByAction)
                this.memberService.delete(member).subscribe();
            else
                this.dataSource.data = backup;
        });
    }

    isLoggedMember(member: Member): boolean {
        return this.authService.currentUser?.pseudo == member.pseudo;
    }

    // appelée quand on clique sur le bouton "new member"
    create() {
        const member = new Member();
        const dlg = this.dialog.open(EditMemberComponent, { data: { member, isNew: true } });
        dlg.beforeClosed().subscribe(res => {
            if (res) {
                res = plainToClass(Member, res);
                this.dataSource.data = [...this.dataSource.data, res];
                this.memberService.add(res).subscribe(res => {
                    if (!res) {
                        this.snackBar.open(`There was an error at the server. The member has not been created! Please try again.`, 'Dismiss', { duration: 10000 });
                        this.refresh();
                    }
                });
            }
        });
    }

    ngOnDestroy(): void {
        this.snackBar.dismiss();
    }
}
