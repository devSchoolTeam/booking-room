import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from './components/event-block/event-block.component';
import { TimeMeasureComponent } from './components/time-measure/time-measure.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [EventComponent, TimeMeasureComponent],
  exports: [EventComponent, TimeMeasureComponent]
})
export class SharedModule { }
