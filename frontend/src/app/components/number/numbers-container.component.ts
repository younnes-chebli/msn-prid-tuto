import { Component } from '@angular/core';
import { NumberGroup } from 'src/app/models/edit-number';

@Component({
    selector: 'group-container',
    templateUrl: './numbers-container.component.html'
})
export class NumbersContainerComponent {
    groups: NumberGroup[] = [
        new NumberGroup("Group1", 3),
        new NumberGroup("Group2", 1),
        new NumberGroup("Group3", 2)
    ];

    get grandTotal(): number {
        return this.groups.reduce((sum, group) => sum + group.total, 0);
    }

    askDuplicate(group: NumberGroup) {
        this.groups.push(group.clone());
    }

    askDelete(group: NumberGroup) {
        this.groups.splice(this.groups.findIndex(g => g == group), 1);
    }
}
