export const meetingStatuses = {
  available: {
    fontColor: '#31856e',
    backgroundColor: '#43b799',
    statusLabel: 'Available',
    bookButton: 'Book now',
    bookButtonSecond: 'Book now'
  },
  soon: {
    fontColor: '#b38d36',
    backgroundColor: '#f3bf49',
    statusLabel: 'Meeting starts soon',
    bookButton: 'Book later',
    bookButtonSecond: 'Book'
  },
  inProcess: {
    fontColor: '#8c2a1f',
    backgroundColor: '#c0392b',
    statusLabel: 'Meeting in process',
    bookButton: 'Book later',
    bookButtonSecond: 'Book'
  }
};
export const availableMeetingDurations = [
  {
    label: '15m',
    value: 15
  },
  {
    label: '30m',
    value: 30
  },
  {
    label: '45m',
    value: 45
  },
  {
    label: '1h',
    value: 60
  },
  {
    label: '1h 30m',
    value: 90
  }
];
