import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { LoaderComponent } from './components/loader/loader.component';
import { EventBlockComponent } from './components/event-block/event-block.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ButtonComponent, LoaderComponent, EventBlockComponent],
  exports: [ButtonComponent, LoaderComponent, EventBlockComponent]
})
export class SharedModule { }
