# Content File Grammar

This document defines the exact structure of the `.md` content file (e.g. `module.md`). Parse the content file according to this grammar exactly — do not infer structure from examples alone.

---

## 1. File = Sequence of Beats

A content file is a sequence of **Beat blocks**. Each Beat block has three parts, always in this order:

1. A **Beat Header** line.
2. A **left-pane** block.
3. A **right-pane** block.

Beats are separated by the next Beat Header line. There is no other top-level structure in the file.

---

## 2. Beat Header

Format:

```
# Beat <N> of <M>
```

- `<N>` is the 1-indexed beat number (integer).
- `<M>` is the total number of beats in this module (integer, same value on every beat header in the file).
- The header may use either `#` or `##` — both mean the same thing (start of a new beat). Treat any line matching `# Beat <N> of <M>` or `## Beat <N> of <M>` as a new Beat Header, regardless of which `#` level is used.
- `<M>` (the total beat count) should be read from this header, not hard-coded — use it to render "Beat {N} of {M}" in the Beat Indicator (Zone A of the layout).

---

## 3. left-pane Block

Format:

```
left-pane : {
    type : "image" | "text",
    <field>: <value>
}
```

- `type` is always either `"image"` or `"text"`. There is no third type.
- **If `type` is `"image"`:** the object has a `src` field, a string path (e.g. `"/assets/image-1.png"`). Render this as an image per the Asset Handling rule in `agent-instructions.md` (currently: a labeled placeholder, since these files don't exist yet).
- **If `type` is `"text"`:** the object has a `content` field, containing an HTML string wrapped in backticks (`` ` ``), not double quotes. Render the HTML inside `content` directly into the Left Section, applying the Design System's tag mapping rules.
- The object uses `key : value` pairs separated by commas, loosely JS-object-like — but it is not valid JSON (unquoted keys, trailing content in backticks). Parse it as: read `type`, then read whichever of `src` / `content` is present.

---

## 4. right-pane Block

Format:

````
right-pane :
```html
<...HTML content...>
```
````

- Always introduced by the literal line `right-pane :` (a colon, optionally followed by whitespace).
- Always followed by a fenced code block explicitly marked ` ```html `.
- Everything between the opening ` ```html ` and the closing ` ``` ` is the raw HTML to render in the Right Section's Zone B (Main Content).
- This HTML may contain standard tags (mapped per Design System Section 1) and custom `<z-...>` tags (mapped per Design System Section 2). Apply both sets of mapping rules to this block.
- Copy the text content inside these tags verbatim into the rendered output. Do not rewrite or summarize any of it.

---

## 5. Parsing Order Per Beat

For each Beat block, extract in this order:
1. `N` and `M` from the Beat Header.
2. The `left-pane` object → determine `type`, then extract `src` or `content`.
3. The `right-pane` HTML block → extract the raw HTML string between the ` ```html ` fence markers.

Store these three pieces of data (N, left-pane data, right-pane HTML) as one Beat object. The full parsed module is an ordered array of Beat objects, indexed by `N`.

---

## 6. Known Deviations to Tolerate

Content files were hand-written and may contain minor inconsistencies that do not change meaning. Tolerate the following without treating them as parse errors:
- Extra or missing blank lines between blocks.
- `#` vs `##` on the Beat Header.
- Inconsistent HTML attribute assignment (e.g., parsing `style:"..."` as if it were standard `style="..."`).
- Inconsistent indentation.
