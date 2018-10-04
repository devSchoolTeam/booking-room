import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventBlockComponent } from './components/event-block/event-block.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [EventBlockComponent],
  exports: [EventBlockComponent]
})
export class SharedModule { }
