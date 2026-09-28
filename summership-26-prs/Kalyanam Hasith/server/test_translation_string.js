process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: 'c:/PYBE/pybe/summership-26-prs/Kalyanam Hasith/server/.env' });
const { translateCodeToEnglish } = require('c:/PYBE/pybe/summership-26-prs/Kalyanam Hasith/server/src/services/debugEngine');

async function test() {
  const code = `def compare_answer(user_input):
  answers = {"What is 2 + 2": "4", "What is 5 - 1": "4"}
  if user_input == answers['What is 2 + 2']:
    return True
  else:
    return False
print(compare_answer("What is 2 + 2"))`;

  const result = await translateCodeToEnglish(code);
  console.log("FINAL RESULT:\n", result);
}
test();
