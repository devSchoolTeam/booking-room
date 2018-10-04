import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/loader/loader.component';
import { EventBlockComponent } from './components/event-block/event-block.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [LoaderComponent, EventBlockComponent],
  exports: [LoaderComponent, EventBlockComponent]
})
export class SharedModule { }
