export class BookingTime {
  public interval: number;
  constructor(public start: Date, public end: Date) {
    this.interval = this.end.getTime() - this.start.getTime();
  }
}
