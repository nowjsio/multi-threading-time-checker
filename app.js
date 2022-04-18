// Worker thread
import { Worker } from 'worker_threads';
import os from 'os';
// const threadLength = 4;
const threadLength = os.cpus().length - 2;
const timeChecker = new Worker('./timecheck.js');
timeChecker.on('message', (msg) => {
  console.log('a message is sent by serviceWorker! : ', msg);
  if (msg.includes('startService')) {
    console.log(`[startTimeChecker]:  ${msg}`);
    for (let q = 0; q < threadLength; q++) {
      const serviceWorker = new Worker('./service.js', { workerData: q });
      serviceWorker.on('message', (msg) => {
        console.log('a message is sent by serviceWorker! : ', msg);
        if (msg.includes('success')) {
          process.exit(1);
        } else if (msg.includes('unknown')) {
          serviceWorker.terminate();
        }
      });

      serviceWorker.on('error', (err) => {
        console.error(err);
      });

      serviceWorker.on('exit', () => {
        console.log('exited!');
      });
    }
  } else if (msg.includes('endService')) {
    console.log(`[endTimeChecker]: ${msg}`);
    process.exit(1);
  }
});
