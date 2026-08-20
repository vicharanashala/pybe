# Installation Guide — Story-Based Lesson Module (Adder)

This package contains the complete, final implementation of the Adder
story-based lesson for PyBe: all source files, the four real story
illustrations, all documentation, the changelog, and this guide —
exactly as approved, with no placeholders and no pending work.

It is laid out with the same folder structure as your cloned `pybe`
repository, so everything below can be copied straight in.

See `CHANGELOG.md` (also at this package's root) for a complete,
file-by-file list of everything new and modified, and why.

---

## 1. What's in this package

```
client/
  src/
    lessons/                    <-- entire folder is new (11 files)
    main.jsx                    <-- MODIFIES your existing file
    styles.css                  <-- MODIFIES your existing file
  public/
    assets/story/adder/         <-- entire folder is new (4 real images)
docs/
  lessons/                      <-- entire folder is new (6 files)
  essential-docs.md             <-- REPLACES your existing file
  product-document.md           <-- REPLACES your existing file
  design-principles.md          <-- REPLACES your existing file
CHANGELOG.md                    <-- new, this package's own record
INSTALLATION_GUIDE.md           <-- this file
```

## 2. Which files are safe to copy in directly (new, no conflict risk)

These are entirely new paths in your repository — copying them in
cannot overwrite anything of yours, because nothing exists at these
paths yet:

```
client/src/lessons/                      (all 11 files)
client/public/assets/story/adder/        (all 4 images)
docs/lessons/                            (all 6 files)
```

## 3. Which files need care (they already exist in your repository)

**Two source files — additive changes only, safe to overwrite if
you haven't edited them yourself:**
- `client/src/main.jsx`
- `client/src/styles.css`

Both were changed *only* by adding new lines — confirmed by `diff`
against the original at every step of this project; no existing line
in either file was removed or rewritten. If you have made no local
edits to these two files since forking, overwriting them with this
package's versions is safe and loses nothing. If you *have* made local
edits, diff this package's copies against yours first and merge by
hand, rather than overwriting blindly.

**Three documentation files — full rewrites:**
- `docs/essential-docs.md`
- `docs/product-document.md`
- `docs/design-principles.md`

These were deliberately rewritten (not appended to) to correct scope
claims in the original PR description — see `CHANGELOG.md` for why.
Overwrite these directly; there's no partial-merge concern since
they're prose documents describing the PR itself, not files you would
have made unrelated edits to.

## 4. How to transfer this package without overwriting unrelated work

From the folder where you extract this ZIP, with `YOUR_PYBE_PATH` set
to your local clone's root:

```bash
# Step 1 — the safe, new-folder copies (do these first, no risk)
cp -r client/src/lessons YOUR_PYBE_PATH/client/src/lessons
cp -r client/public/assets/story/adder YOUR_PYBE_PATH/client/public/assets/story/adder
cp -r docs/lessons YOUR_PYBE_PATH/docs/lessons

# Step 2 — check main.jsx and styles.css for local changes first
diff YOUR_PYBE_PATH/client/src/main.jsx client/src/main.jsx
diff YOUR_PYBE_PATH/client/src/styles.css client/src/styles.css
# If either diff is empty or only shows this package's known additions,
# it's safe to copy directly:
cp client/src/main.jsx YOUR_PYBE_PATH/client/src/main.jsx
cp client/src/styles.css YOUR_PYBE_PATH/client/src/styles.css
# If either diff shows unexpected differences (your own local edits),
# merge by hand instead of overwriting.

# Step 3 — the three rewritten docs
cp docs/essential-docs.md YOUR_PYBE_PATH/docs/essential-docs.md
cp docs/product-document.md YOUR_PYBE_PATH/docs/product-document.md
cp docs/design-principles.md YOUR_PYBE_PATH/docs/design-principles.md
```

If this is a git checkout, `git status` afterward should show exactly:
new files under `client/src/lessons/`, `client/public/assets/story/adder/`,
and `docs/lessons/`; modified files at `client/src/main.jsx`,
`client/src/styles.css`, `docs/essential-docs.md`,
`docs/product-document.md`, `docs/design-principles.md`. Nothing else
in your repository should show as changed.

## 5. How to run the project

```bash
npm run installAll   # from the repository root
npm run seed          # from the repository root
npm run dev           # from the repository root — starts server + client
```

Open the client URL printed in the terminal (Vite's default is
`http://localhost:5173`).

## 6. How to verify the installation

```bash
cd YOUR_PYBE_PATH

# Confirm all 11 lesson source files are present
find client/src/lessons -type f
# Confirm all 4 real images are present
find client/public/assets/story/adder -type f
# Confirm all 6 documentation files are present
find docs/lessons -type f

git status
# Expect exactly the new/modified files listed in section 4 above.
```

## 7. How to verify the Adder lesson appears correctly

1. In the sidebar, confirm a button labeled **"Try: Story-based lesson
   (beta)"** appears above the search box.
2. Click it. The lesson should appear **centered on the page** (not
   pinned to the top-left corner), with the "Back to PyBe" button in
   its own position, top-left, not overlapping anything.
3. The first story scene should show the real illustration of Riya
   crying at her desk, alongside the story text.
4. Click through all four story scenes — each should show its correct
   real illustration (Riya crying → Adder arriving → the number slips
   2 and 3 → the celebratory "SUCCESS!" scene).
5. Answer the 5 comprehension questions, the 3 discovery reflections,
   and the 1 Python multiple-choice step — each should behave exactly
   as described in `docs/lessons/formal-specification.md`.
6. The Summary screen should show a completion badge, "Nice work!",
   the concept name, the final code (`adder(2, 3)`), and a restart
   button that returns you to the first story scene.
7. Click **"Back to PyBe"** at any point — the original mentor UI
   should reappear exactly as you left it, unchanged.

If every step above works, the installation is correct. For anything
that doesn't match, `docs/lessons/error-catalogue.md` documents every
error this module can raise, what causes it, and how to recover.
