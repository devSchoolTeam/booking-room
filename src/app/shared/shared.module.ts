import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from './components/event-block/event-block.component';
import { TimeMeasureComponent } from './components/time-measure/time-measure.component';
import { PopupComponent } from './components/popup/popup.component';
import { EventInfoComponent } from './components/event-info/event-info.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    EventComponent,
    TimeMeasureComponent,
    PopupComponent,
    EventInfoComponent
  ],
  exports: [
    EventComponent,
    TimeMeasureComponent,
    PopupComponent,
    EventInfoComponent
  ]
})
export class SharedModule {}
