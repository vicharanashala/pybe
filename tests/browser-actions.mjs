// Use a real pointer for authored controls that intentionally keep moving.
// DOM scrolling keeps the target in view without waiting for its animation to stop.
export async function clickMovingElement(page, locator) {
  await locator.evaluate((el) =>
    el.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  const box = await locator.boundingBox();
  if (!box) throw new Error("The story control is not visible.");
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}
export async function dragMovingElement(page, source, target) {
  await source.evaluate((el) =>
    el.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  const from = await source.boundingBox();
  if (!from) throw new Error("The dragged story item is not visible.");
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    from.x + from.width / 2 + 14,
    from.y + from.height / 2,
    { steps: 6 },
  );
  await target.evaluate((el) =>
    el.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  const to = await target.boundingBox();
  if (!to) throw new Error("The story drop target is not visible.");
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, {
    steps: 18,
  });
  await page.mouse.move(to.x + to.width / 2 + 2, to.y + to.height / 2, {
    steps: 2,
  });
  await page.mouse.up();
}
