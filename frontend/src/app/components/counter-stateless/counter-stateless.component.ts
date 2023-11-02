import { Component, OnDestroy } from '@angular/core';
import { CounterService } from 'src/app/services/counter.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-counter-stateless',
    templateUrl: './counter-stateless.component.html',
})
export class CounterStatelessComponent implements OnDestroy {

    currentCount: number = 0;
    subscription: Subscription;
    log: string[] = [];

    constructor(private counterService: CounterService) {
        this.subscription = counterService.counter$.subscribe(count => {
            this.currentCount = count;
            if (count > 0) {
                this.log.push(`Counter was set to ${count}`);
            } else {
                this.log = [];
            }
        });
    }

    public incrementCounter() {
        this.counterService.increment();
    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        this.subscription.unsubscribe();
    }
}
