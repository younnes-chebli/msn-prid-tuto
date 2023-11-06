import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EditNumber, NumberGroup } from 'src/app/models/edit-number';

@Component({
    selector: 'number-group',
    templateUrl: './number-group.component.html'
})
export class NumberGroupComponent {
    @Input() group!: NumberGroup;
    @Output() askDuplicate: EventEmitter<void> = new EventEmitter<void>();
    @Output() askDelete: EventEmitter<void> = new EventEmitter<void>();
    countChanges: number = 0;

    numberChanged(number: EditNumber) {
        this.countChanges++;
    }

    duplicate() {
        this.askDuplicate.emit();
    }

    delete() {
        this.askDelete.emit();
    }
}
