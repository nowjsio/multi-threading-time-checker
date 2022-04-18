import path from 'path';
import Tesseract, { createWorker } from 'tesseract.js';
process.env.TESSDATA_PREFIX =
  '/usr/local/Cellar/tesseract/5.1.0/share/tessdata';
const __dirname = path.resolve();
const worker = createWorker();

const extractNum = async (imageName) => {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  await worker.setParameters({
    tessedit_ocr_engine_mode: Tesseract.OEM.TESSERACT_ONLY,
    tessedit_char_whitelist: '0123456789',
    // tessedit_pageseg_mode: Tesseract.PSM.SINGLE_WORD,
  });
  const {
    data: { text },
  } = await worker.recognize(path.resolve(__dirname, 'capture', imageName));
  //   console.log(text);
  const result = text
    .split('')
    .filter((idx) => idx !== ' ' && idx !== '\n')
    .slice(0, 9);
  //   const rep = text.replace(/\n/g, '');
  //   console.log(rep);
  await worker.terminate();
  return result;
};

const parseXpath = (num) => {
  if (typeof num === 'string') {
    return num;
  }
  switch (num) {
    case 0:
      return '//*[@id="keyboard"]/table/tbody/tr[1]/td[1]/button';
    case 1:
      return '//*[@id="keyboard"]/table/tbody/tr[1]/td[2]/button';
    case 2:
      return '//*[@id="keyboard"]/table/tbody/tr[1]/td[3]/button';
    case 3:
      return '//*[@id="keyboard"]/table/tbody/tr[2]/td[1]/button';
    case 4:
      return '//*[@id="keyboard"]/table/tbody/tr[2]/td[2]/button';
    case 5:
      return '//*[@id="keyboard"]/table/tbody/tr[2]/td[3]/button';
    case 6:
      return '//*[@id="keyboard"]/table/tbody/tr[3]/td[1]/button';
    case 7:
      return '//*[@id="keyboard"]/table/tbody/tr[3]/td[2]/button';
    case 8:
      return '//*[@id="keyboard"]/table/tbody/tr[3]/td[3]/button';
    default:
      throw new Error('not supported');
  }
};

export const getButtonXElementList = async (imageName) => {
  const extractedNum = await extractNum(imageName);
  let passwordZeroXpath = extractedNum.indexOf('0');
  let passwordTwoXpath = extractedNum.indexOf('2');
  if (passwordZeroXpath == -1) {
    passwordZeroXpath = '//*[@id="keyboard"]/table/tbody/tr[4]/td[2]/button';
  }
  if (passwordTwoXpath == -1) {
    passwordTwoXpath = '//*[@id="keyboard"]/table/tbody/tr[4]/td[2]/button';
  }

  const resultZeroXapth = parseXpath(passwordZeroXpath);
  const resultTwoXpath = parseXpath(passwordTwoXpath);
  const resultList = [];
  resultList.push(resultZeroXapth);
  resultList.push(resultZeroXapth);
  resultList.push(resultTwoXpath);
  resultList.push(resultTwoXpath);
  resultList.push(resultZeroXapth);
  resultList.push(resultZeroXapth);
  return resultList;
};

// (async () => {
//   const result = await buttonXElementList();
//   console.log(result);
// })();
