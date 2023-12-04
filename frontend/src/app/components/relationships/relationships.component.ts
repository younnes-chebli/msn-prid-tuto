import { Component, OnInit } from '@angular/core';

import { Member } from '../../models/member';
import { MemberService } from '../../services/member.service';
import * as _ from 'lodash-es';
import { Friend } from 'src/app/models/friend';

@Component({
    templateUrl: 'relationships.component.html',
    styleUrls: ['relationships.component.css']
})
export class RelationshipsComponent implements OnInit {
    members: Friend[] = [];
    membersBackup: Friend[] = [];
    filter: string = "";

    constructor(private userService: MemberService) {
    }

    ngOnInit() {
        this.refresh();
    }

    refresh() {
        this.userService.getMembersWithRelationship().subscribe(users => {
            this.members = users;
            this.membersBackup = _.cloneDeep(users);
            this.applyFilter();
        });
    }

    follow(member: Friend) {
        // immediate frontend refresh
        switch (member.relationship) {
            case 'none':
                member.relationship = 'followee';
                break;
            case 'follower':
                member.relationship = 'mutual';
                break;
        }
        // async backend refresh
        this.userService.follow(member.pseudo!).subscribe(_ => this.refresh());
    }

    drop(member: Friend) {
        // immediate frontend refresh
        switch (member.relationship) {
            case 'mutual':
                member.relationship = 'follower';
                break;
            case 'followee':
                member.relationship = 'none';
                break;
        }
        // async backend refresh
        this.userService.unfollow(member.pseudo!).subscribe(_ => this.refresh());
    }

    applyFilter() {
        this.members = _.filter(this.membersBackup, m => {
            const str = (m.pseudo + ' ' + m.fullName).toLowerCase();
            return str.includes(this.filter);
        });
    }
}
