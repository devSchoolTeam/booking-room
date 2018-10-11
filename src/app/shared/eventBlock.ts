export class EventBlock {
  public title: string;
  public status: string;
  public attendees: Array <string>;
  public description: string;
  public creator: string;
  start: Date;
  end: Date;
  duration: number;
  fromStart: number;
  private startTime: Date;

  constructor(event, currentTime: Date) {
    this.startTime = new Date(currentTime.getFullYear(), currentTime.getMonth(),
      currentTime.getDate(),
      9,
      0,
      0
    );
    this.creator = event.creator.email;
    this.attendees = event.attendees;
    this.description = event.description;
    this.status = '';
    this.title = event.summary;
    this.start = new Date(event.start.dateTime);
    this.end = new Date(event.end.dateTime);
    this.duration = new Date(event.end.dateTime).getTime() - new Date(event.start.dateTime).getTime();
    this.fromStart = new Date(event.start.dateTime).getTime() - this.startTime.getTime();
  }
}
