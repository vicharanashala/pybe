import assert from "node:assert/strict";
export async function verifyMagicLogic(page, origin) {
  await page.goto(`${origin}/#study/story-6c4e74eb56c56740`);
  const s = page.locator(".authored-story");
  await s
    .getByRole("button", { name: "Board the Hogwarts Express", exact: true })
    .click();
  const draw = async (shape) => {
    const canvas = s.locator("canvas");
    await canvas.scrollIntoViewIfNeeded();
    const b = await canvas.boundingBox();
    const points =
      shape === "circle"
        ? Array.from({ length: 33 }, (_, i) => [
            0.5 + 0.28 * Math.cos((i * Math.PI) / 16),
            0.5 + 0.28 * Math.sin((i * Math.PI) / 16),
          ])
        : shape === "zigzag"
          ? [
              [0.2, 0.75],
              [0.35, 0.2],
              [0.5, 0.75],
              [0.65, 0.2],
              [0.8, 0.75],
            ]
          : shape === "vertical"
            ? [
                [0.5, 0.2],
                [0.5, 0.8],
              ]
            : shape === "arc"
              ? [
                  [0.2, 0.7],
                  [0.3, 0.45],
                  [0.4, 0.3],
                  [0.5, 0.25],
                  [0.6, 0.3],
                  [0.7, 0.45],
                  [0.8, 0.7],
                ]
              : [
                  [0.2, 0.5],
                  [0.8, 0.5],
                ];
    await page.mouse.move(
      b.x + b.width * points[0][0],
      b.y + b.height * points[0][1],
    );
    await page.mouse.down();
    for (const [x, y] of points.slice(1))
      await page.mouse.move(b.x + b.width * x, b.y + b.height * y, {
        steps: 8,
      });
    await page.mouse.up();
  };
  for (const title of [
    "The Train Duel",
    "The Sorting Ceremony",
    "Defense Against the Dark Arts",
    "The Potions Dungeon",
    "First Flying Class",
  ]) {
    console.log("Magic lesson", title);
    await s.getByRole("heading", { name: title, exact: true }).waitFor();
    assert.equal(
      await s.getByText("Concept Breakdown", { exact: true }).count(),
      0,
    );
    await s
      .getByRole("button", { name: "Start Activity", exact: true })
      .click();
    if (title === "The Train Duel") {
      await s.locator("canvas").waitFor();
      const attacking = (await s.locator("main").innerText()).includes(
        "Opponent is attacking!",
      );
      await draw(attacking ? "horizontal" : "circle");
      assert.equal(
        await s
          .getByRole("button", { name: "See the Code", exact: true })
          .count(),
        0,
      );
      await draw(attacking ? "circle" : "horizontal");
    } else if (title === "The Sorting Ceremony")
      await s.getByRole("button", { name: "Wise", exact: true }).click();
    else if (title === "Defense Against the Dark Arts") {
      await s.locator("canvas").waitFor();
      const text = await s.locator("main").innerText();
      const creature =
        text.match(/A wild (Boggart|Dementor|Pixie)/)?.[1] ||
        text.match(/(?:Creature:|Facing:)\s*(Boggart|Dementor|Pixie)/)?.[1];
      if (!creature) console.log("Creature text", text);
      assert.ok(creature);
      await draw("circle");
      assert.equal(
        await s
          .getByRole("button", { name: "See the Code", exact: true })
          .count(),
        0,
      );
      await draw(
        creature === "Boggart"
          ? "zigzag"
          : creature === "Dementor"
            ? "arc"
            : "vertical",
      );
    } else if (title === "The Potions Dungeon") {
      await s
        .getByRole("button", { name: "Add Moonstone", exact: true })
        .click();
      await s
        .getByText(
          "The potion exploded! Adjust the conditions and try again.",
          { exact: true },
        )
        .waitFor();
      await s.getByRole("button", { name: "Heat", exact: true }).click();
      await page.waitForFunction(() => {
        const root = document.querySelector(".authored-story").shadowRoot;
        return /8[3-6]°/.test(root.querySelector("main").innerText);
      });
      await s.getByRole("button", { name: "Heat", exact: true }).click();
      await page.waitForFunction(() => {
        const root = document.querySelector(".authored-story").shadowRoot;
        return !!root.querySelector(".bg-purple-500");
      });
      await s
        .getByRole("button", { name: "Add Moonstone", exact: true })
        .click();
    } else {
      const up = s.getByRole("button", { name: '"UP!"', exact: true });
      for (let attempt = 0; attempt < 8; attempt++) {
        await up.scrollIntoViewIfNeeded();
        const b = await up.boundingBox();
        await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
        await page.waitForFunction(() => {
          const root = document.querySelector(".authored-story").shadowRoot;
          const ring = root.querySelector(".border-blue-500");
          return (
            ring &&
            parseFloat(ring.style.width) > 193 &&
            parseFloat(ring.style.width) < 207
          );
        });
        await page.mouse.down();
        await page.mouse.up();
        await page.waitForTimeout(200);
        if (
          await s
            .getByRole("button", { name: "See the Code", exact: true })
            .count()
        )
          break;
        await s.getByRole("button", { name: "Try Again", exact: true }).click();
      }
    }
    await s.getByRole("button", { name: "See the Code", exact: true }).click();
    await s.getByText("Concept Breakdown", { exact: true }).waitFor();
    await s
      .getByRole("button", {
        name:
          title === "First Flying Class" ? "Finish Chapter" : "Next Chapter",
        exact: true,
      })
      .click();
  }
  await s
    .getByRole("heading", { name: "Journey Complete!", exact: true })
    .waitFor();
  assert.doesNotMatch(
    await s.locator("#root").innerText(),
    /Python Master|XP|🏆/,
  );
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
    true,
  );
  console.log(
    "Magic of Logic passed: five authored stories, real spell drawing, retry, trait match, nested potion conditions, broom timing, late code explanations and mobile width without a mastery award.",
  );
}
