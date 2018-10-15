import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventBlockComponent } from './components/event-block/event-block.component';
import { TimeMeasureComponent } from './components/time-measure/time-measure.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [EventBlockComponent, TimeMeasureComponent],
  exports: [EventBlockComponent]
})
export class SharedModule { }
