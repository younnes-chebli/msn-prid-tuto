import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MemberService } from '../../services/member.service';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import * as _ from 'lodash-es';
import { Member, Phone, Role } from 'src/app/models/member';
import { differenceInCalendarYears, differenceInYears, sub } from 'date-fns';
import { plainToInstance } from 'class-transformer';

@Component({
    selector: 'app-edit-member-mat',
    templateUrl: './edit-member.component.html',
    styleUrls: ['./edit-member.component.css']
})
export class EditMemberComponent {
    public frm!: FormGroup;
    public frmPhone!: FormGroup;
    public ctlPseudo!: FormControl;
    public ctlFullName!: FormControl;
    public ctlPassword!: FormControl;
    public ctlBirthDate!: FormControl;
    public ctlRole!: FormControl;
    public ctlPhoneType!: FormControl;
    public ctlPhoneNumber!: FormControl;
    public isNew: boolean;
    public maxDate = sub(new Date(), { years: 18 });
    public phones!: Phone[];

    constructor(public dialogRef: MatDialogRef<EditMemberComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { member: Member; isNew: boolean; },
        private fb: FormBuilder,
        private memberService: MemberService
    ) {
        this.ctlPseudo = this.fb.control('', [
            Validators.required,
            Validators.minLength(3),
            this.forbiddenValue('abc')
        ], [this.pseudoUsed()]);
        this.ctlPassword = this.fb.control('', data.isNew ? [Validators.required, Validators.minLength(3)] : []);
        this.ctlFullName = this.fb.control(null, [Validators.minLength(3)]);
        this.ctlBirthDate = this.fb.control(null, [this.validateBirthDate()]);
        this.ctlRole = this.fb.control(Role.Member, []);

        this.frm = this.fb.group({
            pseudo: this.ctlPseudo,
            password: this.ctlPassword,
            fullName: this.ctlFullName,
            birthDate: this.ctlBirthDate,
            role: this.ctlRole
        });

        this.ctlPhoneType = this.fb.control('', [Validators.minLength(3)]);
        this.ctlPhoneNumber = this.fb.control('', [this.phoneNumberUnique(), Validators.minLength(3)]);
        this.frmPhone = this.fb.group({
            type: this.ctlPhoneType,
            number: this.ctlPhoneNumber
        });

        this.isNew = data.isNew;
        this.frm.patchValue(data.member);
        this.phones = plainToInstance(Phone, data.member.phones);
    }

    // Validateur bidon qui vérifie que la valeur est différente
    forbiddenValue(val: string): any {
        return (ctl: FormControl) => {
            if (ctl.value === val) {
                return { forbiddenValue: { currentValue: ctl.value, forbiddenValue: val } };
            }
            return null;
        };
    }

    phoneNumberUnique(): any {
        return (ctl: FormControl) => {
            return this.phones?.length < 3 && this.phones?.find(p => p.number == ctl.value) ? { phoneNumberUnique: true } : null;
        };
    }

    validateBirthDate(): any {
        return (ctl: FormControl) => {
            const birthDate: Date = ctl.value;
            const today = new Date();
            if (today < birthDate)
                return { futureBorn: true }
            var age = differenceInYears(today, birthDate);
            if (age < 18)
                return { tooYoung: true };
            return null;
        };
    }

    // Validateur asynchrone qui vérifie si le pseudo n'est pas déjà utilisé par un autre membre
    pseudoUsed(): any {
        let timeout: NodeJS.Timeout;
        return (ctl: FormControl) => {
            clearTimeout(timeout);
            const pseudo = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    if (ctl.pristine) {
                        resolve(null);
                    } else {
                        this.memberService.getById(pseudo).subscribe(member => {
                            resolve(member ? { pseudoUsed: true } : null);
                        });
                    }
                }, 300);
            });
        };
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    update() {
        const data = this.frm.value;
        data.phones = this.phones;
        this.dialogRef.close(data);
    }

    cancel() {
        this.dialogRef.close();
    }

    phoneAdd() {
        if (!this.phones) {
            this.phones = [];
        }
        this.phones.push(this.frmPhone.value);
        this.frmPhone.reset();
        this.frm.markAsDirty();
    }

    phoneDelete(phone: Phone) {
        _.remove(this.phones, phone);
        this.frm.markAsDirty();
    }
}
