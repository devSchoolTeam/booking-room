import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.sass']
})
export class ButtonComponent implements OnInit {
  @Input() public text: string;
  @Input() public backgroundColor: string;
  @Input() public fontColor: string;
  @Input() public classList: string;
  @Input () public disabled;
  @Input () public loading = false;
  @Input () public width;
  @Input() public fontSize;
  @Output() public buttonClick = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  public onClick() {
    this.buttonClick.emit();
  }
}
