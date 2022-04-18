import dotenv from 'dotenv';

dotenv.config();

function callEnv(key, defaulValue = undefined) {
  const value = process.env[key] || defaulValue;
  if (value === null) {
    throw new Error(`[ ${key} ] value is null`);
  }
  return value;
}

const config = {
  naverId: callEnv('NAVER_ID'),
  naverPassword: callEnv('NAVER_PASSWORD'),
  pocketmonMain: callEnv('POCKET_MON_MAIN'),
  pocketmonSub: callEnv('POCKET_MON_SUB'),
  testMain: callEnv('TEST_MAIN'),
  testSub: callEnv('TEST_SUB'),
  testSub2: callEnv('TEST_SUB2'),
};

export default config;
