export const meetingStatuses = {
  available: {
    class: 'available',
    statusLabel: 'Available',
    bookButton: 'Book now',
    bookButtonSecond: 'Book now'
  },
  soon: {
    class: 'soon',
    statusLabel: 'Meeting starts soon',
    bookButton: 'Book later',
    bookButtonSecond: 'Book'
  },
  inProcess: {
    class: 'inprocess',
    statusLabel: 'Meeting in process',
    bookButton: 'Book later',
    bookButtonSecond: 'Book'
  }
};
export const availableMeetingDurations = [
  {
    label: '15m',
    value: 900000,
    blockHeight: 50
  },
  {
    label: '30m',
    value: 1800000,
    blockHeight: 100
  },
  {
    label: '45m',
    value: 2700000,
    blockHeight: 150

  },
  {
    label: '1h',
    value: 3600000,
    blockHeight: 200
  },
  {
    label: '1h 30m',
    value: 5400000,
    blockHeight: 300
  }
];
