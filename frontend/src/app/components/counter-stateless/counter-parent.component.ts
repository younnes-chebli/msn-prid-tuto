import { Component, OnInit } from '@angular/core';
import { CounterService } from 'src/app/services/counter.service';

@Component({
    selector: 'app-counter-parent',
    template: `
    <h1>Counter Parent</h1>
    <button class="btn btn-primary" (click)="resetCounter()">Reset</button>
    <app-counter-stateless></app-counter-stateless>
    <app-counter-stateless></app-counter-stateless>
    `
})

export class CounterParentComponent {
    constructor(private counterService: CounterService) { }

    resetCounter() {
        this.counterService.reset();
    }
}
