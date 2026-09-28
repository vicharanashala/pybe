process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: 'c:/PYBE/pybe/summership-26-prs/Kalyanam Hasith/server/.env' });
const { translateCodeToEnglish } = require('./src/services/debugEngine');

async function test() {
  const code = `def calculate(num1, num2, operator):
  if operator == '+':
    return num1 + num2
  elif operator == '-':
    return num1 - num2
  elif operator == '*':
    return num1 * num2
  elif operator == '/':
    return num1 / num2
  else:
    return None

print(calculate(10, 2, '+'))
print(calculate(10, 2, '-'))
print(calculate(10, 2, '*'))
print(calculate(10, 2, '/'))
print(calculate(10, 2, '^'))`;
  const result = await translateCodeToEnglish(code);
  console.log("FINAL RESULT:", JSON.stringify(result));
}
test();
