import { parentPort } from 'worker_threads';
import cron from 'node-cron';
const sleepForMilliSeconds = (ms) => {
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
};

class CronSchedule {
  constructor() {
    this.cronCnt = 0;
    this.cronScheduler = cron.schedule(
      '44 2 * * *',
      // '30 59 10 * * *',
      //   '* 55 9 * * *',
      async () => {
        parentPort?.postMessage('startService!');
        console.log(`active timechecker startTime : ${new Date()}`);
        while (true) {
          if (this.cronCnt < 2) {
            this.cronCnt++;
            await sleepForMilliSeconds(60000);
            console.log(`[!]running : ${this.cronCnt}`);
          } else {
            console.log(`deactive timechecker endTime : ${new Date()}`);
            this.cronScheduler.stop();
            parentPort?.postMessage('endService!');
            break;
          }
        }
      },
      {
        scheduled: false,
      },
    );
  }

  start = () => {
    this.cronScheduler.start();
  };

  stop = () => {
    this.cronScheduler.stop();
  };

  // run = async () => {
  //   let isJobRunning = true;
  //   while (isJobRunning) {
  //     if (this.cronCnt < 10) {
  //       console.log(`[!]START : ${this.cronCnt}`);
  //       await this.start().then(console.log);
  //       console.log(`[!]START END`);
  //     } else {
  //       isJobRunning = false;
  //       console.log(`[!]STOP : ${this.cronCnt}`);
  //       await this.stop();
  //     }
  //   }
  // };
}

(() => {
  const cronSchedule = new CronSchedule();
  cronSchedule.start();
})();
