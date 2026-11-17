export interface RunResult {
  stdout: string;
  error: string | null;
  success: boolean;
}

export interface TestResult {
  description: string;
  passed: boolean;
  error: string | null;
}

export interface CodingTest {
  description: string;
  testCode?: string;
  expectedStdout?: string;
}
