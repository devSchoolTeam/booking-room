import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeMeasureComponent } from './components/time-measure/time-measure.component';
import { PopupComponent } from './components/popup/popup.component';
import { EventInfoComponent } from './components/event-info/event-info.component';

@NgModule({
  imports: [CommonModule],
  declarations: [

    TimeMeasureComponent,
    PopupComponent,
    EventInfoComponent
  ],
  exports: [
    TimeMeasureComponent,
    PopupComponent,
    EventInfoComponent
  ]
})
export class SharedModule {}
