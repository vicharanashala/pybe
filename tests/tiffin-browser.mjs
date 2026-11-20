import assert from "node:assert/strict";
import { readAuthoredData } from "../tools/lesson-data.mjs";
export async function verifyTiffin(page, origin) {
  const pages = await readAuthoredData(
    "case-studies/functions-and-closures-tiffin-trail/tiffin trail-case study/src/TiffinTrail.jsx",
    "PAGES",
    { format: "script", loader: "jsx" },
  );
  await page.goto(`${origin}/#study/story-e11815652818ebf2`);
  const s = page.locator(".authored-story");
  for (const data of pages) {
    await s.getByRole("heading", { name: data.title, exact: true }).waitFor();
    const next = s.getByRole("button", { name: "Next stop", exact: true });
    if (data.type === "predict") {
      assert.equal(await next.isDisabled(), true);
      await s
        .getByRole("button", {
          name: data.choices.find((_, i) => i !== data.correctIndex),
          exact: false,
        })
        .click();
      await s.getByText(data.explanation, { exact: true }).waitFor();
    }
    if (data.type === "concept") {
      assert.equal(await next.isDisabled(), true);
      await s
        .getByRole("button", { name: "I understand this idea", exact: true })
        .click();
    }
    if (data.type === "code") {
      const inputs = s.locator("input");
      for (let n = 0; n < (await inputs.count()); n++)
        await inputs.nth(n).fill("incorrect");
      await s.getByRole("button", { name: /Check/ }).click();
      assert.equal(await next.isDisabled(), true);
      const specs = Object.values(data.blanks);
      for (let n = 0; n < specs.length; n++)
        await inputs.nth(n).fill(specs[n].accept[0]);
      await s.getByRole("button", { name: /Check/ }).click();
      assert.equal(await next.isDisabled(), false);
    }
    if (data.type === "bughunt") {
      await s
        .getByText(data.lines[data.buggyIndex].trim(), { exact: false })
        .last()
        .click();
      await s.getByText(data.bugExplanation, { exact: false }).waitFor();
    }
    if (data.type === "capstone") {
      await s
        .getByRole("button", { name: "Run full delivery", exact: true })
        .click();
      await s.getByText("Tiffin Trail complete!", { exact: true }).waitFor();
      for (const line of data.outputLines)
        await s.getByText("> " + line, { exact: true }).waitFor();
    }
    if (data.type !== "capstone") await next.click();
  }
  assert.doesNotMatch(
    await s.locator("#root").innerText(),
    /\bXP\b|badge earned|Claim .*badge/,
  );
  await page.waitForFunction(() =>
    JSON.parse(
      localStorage.getItem("pybe-original-library") || "{}",
    ).completed?.includes("story-e11815652818ebf2"),
  );
  await s.getByRole("button", { name: "Restart trail", exact: true }).click();
  await s.getByRole("heading", { name: pages[0].title, exact: true }).waitFor();
  console.log(
    "Tiffin Trail passed: all fifteen original stops, narrative illustrations, three predictions, four concept acknowledgments, three blank-building exercises, bug hunt, capstone output and replay without XP or badges.",
  );
}
