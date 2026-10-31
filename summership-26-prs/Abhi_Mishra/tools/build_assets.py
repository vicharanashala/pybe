"""Rebuild the Python snippets and chart images from shared/*.json.

    python tools/build_assets.py

Outputs
  shared/code/<id>.py                       runnable Matplotlib snippet shown in "Show code"
  client/src/images/charts/<q>__<c>.webp    question <q> drawn with chart type <c>
                                            (q == c is the correct chart, produced by running the snippet)
Requires: matplotlib, numpy, pillow.
"""
import io, json, pathlib, textwrap
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from cycler import cycler
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SHARED, CODE_DIR = ROOT / "shared", ROOT / "shared" / "code"
OUT = ROOT / "client" / "src" / "images" / "charts"
CODE_DIR.mkdir(parents=True, exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)

case = json.loads((SHARED / "caseStudy.json").read_text(encoding="utf-8"))
plots = json.loads((SHARED / "plots.json").read_text(encoding="utf-8"))
DATA = case["datasets"]
IDS = [p["id"] for p in plots]
LABEL = {p["id"]: p["label"] for p in plots}
SUBJECT = {"line": "monthly revenue", "pie": "revenue by product", "scatter": "usage and months stayed",
           "bar": "conversion by region", "box": "contract values", "area": "revenue by product"}

TEAL, CORAL, GOLD, PURPLE, MINT, DEEP = "#0d8b82", "#ee755f", "#efb34b", "#8874c9", "#63b7b0", "#236b75"
STYLE = {
    "figure.figsize": (6.6, 3.9), "figure.dpi": 110, "figure.facecolor": "#fffaf1", "axes.facecolor": "#fffaf1",
    "savefig.facecolor": "#fffaf1", "savefig.bbox": "tight", "savefig.pad_inches": 0.15,
    "axes.edgecolor": "#23364055", "axes.labelcolor": "#233640", "text.color": "#233640",
    "xtick.color": "#233640", "ytick.color": "#233640", "axes.spines.top": False, "axes.spines.right": False,
    "axes.grid": True, "axes.grid.axis": "y", "grid.color": "#233640", "grid.alpha": 0.12, "axes.axisbelow": True, "axes.titleweight": "bold",
    "axes.titlesize": 12, "font.size": 10, "axes.prop_cycle": cycler(color=[TEAL, CORAL, GOLD, PURPLE, MINT, DEEP]),
    "boxplot.boxprops.color": DEEP, "boxplot.whiskerprops.color": DEEP, "boxplot.capprops.color": DEEP,
    "boxplot.medianprops.color": CORAL, "boxplot.medianprops.linewidth": 2,
    "boxplot.flierprops.marker": "o", "boxplot.flierprops.markerfacecolor": CORAL,
    "boxplot.flierprops.markeredgecolor": CORAL, "boxplot.meanprops.marker": "^",
    "boxplot.meanprops.markerfacecolor": TEAL, "boxplot.meanprops.markeredgecolor": TEAL,
    "boxplot.meanprops.markersize": 8,
}

def lst(values, indent=0):
    text = json.dumps(values)
    if len(text) <= 62:
        return text
    pad = " " * indent
    return "[" + textwrap.fill(text[1:-1], 66, subsequent_indent=pad + " ").strip() + "]"

def col(ds, i):
    return [r[i] for r in DATA[ds]["rows"]]

def snippets():
    area = DATA["area"]
    series = {c: col("area", i + 1) for i, c in enumerate(area["columns"][1:])}
    names = list(series)
    return {
"line": f'''import matplotlib.pyplot as plt

months = {lst(col("line", 0))}
revenue = {lst(col("line", 1))}  # in $K

plt.plot(months, revenue, marker="o")

plt.title("NovaTech monthly revenue")
plt.xlabel("Month")
plt.ylabel("Revenue ($K)")
plt.ylim(0, 50)

plt.show()
''',
"pie": f'''import matplotlib.pyplot as plt

products = {lst(col("pie", 0))}
revenue = {lst(col("pie", 1))}  # first-half revenue in $K

plt.pie(revenue, labels=products, autopct="%1.0f%%")

plt.title("Revenue by product (Jan to Jun)")

plt.show()
''',
"scatter": f'''import matplotlib.pyplot as plt

usage = {lst(col("scatter", 0), 9)}  # weekly usage in hours, one value per customer
months = {lst(col("scatter", 1), 10)}  # months each customer has stayed

plt.scatter(usage, months)

plt.title("Weekly usage vs months stayed")
plt.xlabel("Weekly usage (hours)")
plt.ylabel("Months as a customer")

plt.show()
''',
"bar": f'''import matplotlib.pyplot as plt

regions = {lst(col("bar", 0))}
conversion = {lst(col("bar", 1))}  # trial-to-paid rate in %

plt.bar(regions, conversion)

plt.title("Trial-to-paid conversion by region")
plt.xlabel("Region")
plt.ylabel("Trial to paid (%)")

plt.show()
''',
"box": f'''import matplotlib.pyplot as plt

contracts = {lst(col("box", 1), 12)}  # contract value per customer, in $K

plt.boxplot(contracts, showmeans=True)  # green triangle = mean

plt.title("Contract value per customer")
plt.ylabel("Contract value ($K)")
plt.xticks([1], ["All customers"])

plt.show()
''',
"area": "import matplotlib.pyplot as plt\n\nmonths = " + lst(col("area", 0)) + "\n" + "".join(
    f"{n.lower().replace(' ', '_')} = {lst(v)}\n" for n, v in series.items()) + f'''
plt.stackplot(months, {", ".join(n.lower().replace(" ", "_") for n in names)},
              labels={json.dumps(names)})

plt.legend(loc="upper left")
plt.title("Revenue by product")
plt.xlabel("Month")
plt.ylabel("Revenue ($K)")

plt.show()
''',
    }

def save(name):
    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    plt.close("all")
    buf.seek(0)
    Image.open(buf).convert("RGB").save(OUT / f"{name}.webp", "WEBP", quality=88, method=6)

def norm(ds):
    cols, rows = DATA[ds]["columns"], DATA[ds]["rows"]
    if ds == "scatter":
        return dict(kind="xy", xs=[r[0] for r in rows], ys=[r[1] for r in rows], xlabel=cols[0], ylabel=cols[1])
    if ds == "area":
        return dict(kind="cat", labels=[r[0] for r in rows], values=[sum(r[1:]) for r in rows], xlabel=cols[0], ylabel="Total revenue ($K)")
    return dict(kind="cat", labels=[r[0] for r in rows], values=[r[1] for r in rows], xlabel=cols[0], ylabel=cols[1])

def positions(d):
    """x positions + tick setter that keeps 30 labels readable."""
    if d["kind"] == "xy":
        return d["xs"], d["ys"], None
    n = len(d["labels"])
    xs = list(range(n))
    step = 1 if n <= 10 else 5
    ticks = (xs[::step], d["labels"][::step])
    return xs, d["values"], ticks

def wrong(chart, ds):
    d = norm(ds)
    xs, ys, ticks = positions(d)
    fig, ax = plt.subplots()
    if chart == "line":
        ax.plot(xs, ys, marker="o")
    elif chart == "bar":
        ax.bar(xs, ys, width=0.7 if len(xs) < 12 else 0.8)
    elif chart == "scatter":
        ax.scatter(xs, ys)
    elif chart == "area":
        pairs = sorted(zip(xs, ys))
        ax.fill_between([a for a, _ in pairs], [b for _, b in pairs], alpha=0.85)
    elif chart == "box":
        ax.boxplot(ys, showmeans=True)
        ax.set_xticks([1], ["All values"])
        ax.set_ylabel(d["ylabel"])
        ax.set_title(f"Boxplot of {SUBJECT[ds]}")
        return
    elif chart == "pie":
        ax.grid(False)
        labels = d["labels"] if d["kind"] == "cat" else [f"{x}h" for x in d["xs"]]
        ax.pie(ys, labels=labels, autopct="%1.0f%%" if len(ys) <= 10 else None, textprops={"fontsize": 8})
        ax.set_title(f"Pie chart of {SUBJECT[ds]}")
        return
    if ticks:
        ax.set_xticks(*ticks)
    ax.set_xlabel(d["xlabel"])
    ax.set_ylabel(d["ylabel"])
    ax.set_title(f"{LABEL[chart]} of {SUBJECT[ds]}")

def main():
    plt.rcParams.update(STYLE)
    code = snippets()
    real_show = plt.show
    plt.show = lambda *a, **k: None
    for pid, text in code.items():
        key = next(p["keyCall"] for p in plots if p["id"] == pid)
        assert key in text, f"{pid}: keyCall {key} missing"
        (CODE_DIR / f"{pid}.py").write_text(text, encoding="utf-8")
        plt.close("all")
        exec(compile(text, f"{pid}.py", "exec"), {"__name__": "__main__"})
        save(f"{pid}__{pid}")
        for chart in IDS:
            if chart != pid:
                plt.close("all")
                wrong(chart, pid)
                save(f"{pid}__{chart}")
    plt.show = real_show
    print(f"wrote {len(code)} snippets and {len(list(OUT.glob('*.webp')))} chart images")

if __name__ == "__main__":
    main()
