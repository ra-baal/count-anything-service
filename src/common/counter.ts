export type Counter = {
  id: string;
  name: string;
  value: number;
  userId: number
};

export type CounterEvents = {
  counterid: string;
  eventdate: string,
  value: number
};
