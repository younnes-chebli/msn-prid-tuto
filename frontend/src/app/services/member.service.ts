import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Member } from '../models/member';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { Friend } from '../models/friend';

@Injectable({ providedIn: 'root' })
export class MemberService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getAll(): Observable<Member[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/members`).pipe(
            map(res => plainToInstance(Member, res))
        );
    }

    getById(pseudo: string) {
        return this.http.get<Member>(`${this.baseUrl}api/members/${pseudo}`).pipe(
            map(m => plainToInstance(Member, m)),
            catchError(err => of(null))
        );
    }

    public update(m: Member): Observable<boolean> {
        return this.http.put<Member>(`${this.baseUrl}api/members`, m).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public delete(m: Member): Observable<boolean> {
        return this.http.delete<boolean>(`${this.baseUrl}api/members/${m.pseudo}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public add(m: Member): Observable<boolean> {
        return this.http.post<Member>(`${this.baseUrl}api/members`, m).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public getMembersWithRelationship(): Observable<Friend[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/members/rels`).pipe(
            map(res => plainToInstance(Friend, res)),
            catchError(err => {
                console.error(err);
                return of([]);
            })
        );
    }

    public follow(followee: string): Observable<boolean> {
        return this.http.post(`${this.baseUrl}api/members/follow/${followee}`, null).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public unfollow(followee: string) {
        return this.http.post(`${this.baseUrl}api/members/unfollow/${followee}`, null).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }
}
