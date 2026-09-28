process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: 'c:/PYBE/pybe/summership-26-prs/Kalyanam Hasith/server/.env' });
const { translateCodeToEnglish } = require('c:/PYBE/pybe/summership-26-prs/Kalyanam Hasith/server/src/services/debugEngine');

async function test() {
  const code = `# Goal: Extract the last three user preferences from the list.
preferences = ['reading', 'hiking', 'swimming', 'fishing', 'cycling']
print(preferences[-3:10])`;

  const result = await translateCodeToEnglish(code);
  console.log("FINAL RESULT:\n", result);
}
test();
