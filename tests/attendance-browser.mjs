import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
export async function verifyAttendance(page, origin) {
  const source = await readFile(
    new URL(
      "../case-studies/string-processing-attendance-cleaner/string-manipulation-case-study/case-study.md",
      import.meta.url,
    ),
    "utf8",
  );
  await page.goto(`${origin}/#study/story-1bb2d0ced20d2774`);
  const article = page.locator(".authored-reading");
  await article.waitFor();
  assert.deepEqual(
    await article.locator("h2").allTextContents(),
    [...source.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim()),
  );
  assert.equal(await article.locator("pre code").count(), 3);
  assert.equal(await article.locator("table tbody tr").count(), 5);
  assert.equal(
    await article.locator('[data-language="python"]').textContent(),
    source
      .match(/```python\r?\n([\s\S]*?)\r?\n```/)[1]
      .replaceAll("\r\n", "\n"),
  );
  await article
    .getByRole("button", { name: "Mark this story as explored", exact: true })
    .click();
  await page.waitForFunction(() =>
    JSON.parse(
      localStorage.getItem("pybe-original-library") || "{}",
    ).completed?.includes("story-1bb2d0ced20d2774"),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
    true,
  );
  await page.setViewportSize({ width: 1280, height: 720 });
  console.log(
    "Messy Attendance passed: unchanged written story, all six sections, five-row concept map, exact Python example/output, shared completion and mobile width.",
  );
}
