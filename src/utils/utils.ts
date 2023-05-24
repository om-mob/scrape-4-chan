export const sleep = (s: number) =>
  new Promise((resolve) => setTimeout(resolve, s * 1000));

export const waitFor = (queue: any[], checkDuration = 2, msg = "") =>
  new Promise((resolve) => {
    const interval = setInterval(() => {
      if (!queue.length) {
        resolve("done");
        clearInterval(interval);
      }
      if (msg) console.log(msg);
    }, checkDuration * 1000);
  });

export function removeItem<T>(arr: Array<T>, value: T): Array<T> {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

export class WaitingQueue {
  processes: Array<any>;
  readonly capacity: number;
  readonly drainNumber: number

  constructor(capacity: number = 10, drainNumber: number | null = null) {
    this.processes = [];
    this.capacity = capacity;
    if (drainNumber == null) this.drainNumber = Math.round(capacity / 2)
    else this.drainNumber = drainNumber
  }

  async add(process: any) {
    if (this.processes.length >= this.capacity)
        while (this.processes.length > this.drainNumber) await sleep(2);

    this.processes.push(process);
    }
}

const wq: { [key: string]: any; processing: any[] } = {
  processing: [],
  capacity: 10,
  async add(process: any) {
    while (this.processing.length >= this.capacity) await sleep(2);
    this.processing.push(process);
  },
};


export const format_date = (date: Date) => {
  const today = date;
  const yyyy = today.getFullYear();
  let mm = (today.getMonth() + 1).toString(); // Months start at 0!
  let dd = today.getDate().toString();

  dd = parseInt(dd) < 10? '0' + dd : dd;
  mm = parseInt(mm) < 10? '0' + mm : mm;

  return `${yyyy}/${mm}/${dd}`;
}
