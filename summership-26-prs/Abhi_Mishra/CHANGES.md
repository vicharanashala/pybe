# What was fixed and improved

## Bugs fixed
1. API and offline data disagreed: `plots.json` asked "customers" for the pie and "revenue by product" for the bar,
   while the charts and tables showed the opposite. Now one source of truth in `shared/`.
2. The correct answer button was always marked with a different icon (`↗` vs `◌`) before you clicked. Each chart now has its own icon.
3. Option buttons were always in the same order as the questions, so clicking left to right won. Questions and options are shuffled.
4. Wrong pick switched the data table to the wrong chart's data and instantly ended the game, so nobody saw why it was wrong. Now the question's own data is drawn with the chosen chart, with an explanation.
5. The deal-closed and deal-rejected screens had no CSS at all (`.meeting-outcome`, `.outcome-copy`, `.handshake`, `.exit-note`). Added.
6. `.data-table` was defined twice (card in meeting.css, table in plots.css) and the styles collided. Table renamed `.source-table`.
7. Top bar showed an empty label on the win/lose screens.
8. Scatter question used `xPosition` 1 to 10 vs revenue (not a relationship). It now plots weekly product usage vs months stayed, one dot per customer, unsorted so it can never look like a line chart.
9. "Cumulative" area chart used daily website visits that fall on Sunday. It is now a stacked area of revenue by product (adds up to monthly revenue).
10. Growth column (5, 8, 12 ...) matched nothing. It is now real month-over-month revenue growth.
11. Boxplot image said Q3 = 53.5 but the data gives 51.0. All images are now produced by running the shown code.
12. Y-axis said "Revenue in dollars" for values in $K.
13. Stray `"` in the scatter pitch text, and `plt.line()`/`plt.box()` in fallback code that do not exist.
14. Quiz asked about `plt.hist()`, which the game never teaches. Quiz now tests what was taught.
15. `npm start` did not serve the client. It now does after `npm run build`.
16. `"latest"` dependencies pinned, unused `framer-motion` removed, 9 MB of PNG scenes became 0.4 MB WebP.
17. Completion screen showed made-up skill percentages. They now come from the real quiz answers.

## Learning improvements
Wrong-chart visuals, "why" text per chart, highlighted key line + copy button in code, quiz tips, retry from the failed question, optional investor patience mode.
