---
sdk: streamlit
app_port: 7860
emoji: 📚
colorFrom: indigo
colorTo: purple
pinned: true
license: mit
short_description: Turn any programming PDF into a curiosity-driven tutor.
---

# TinyTeach

> Turn any programming-language PDF into a personal tutor that teaches through
> curiosity-driven case studies + a learning roadmap — 100 % free, runs on a free
> HuggingFace Space.

TinyTeach reads your book, indexes it locally with FAISS, and asks a small LLM to
generate **5–8 case studies** and a **roadmap** for any topic you ask. Every
case study is grounded in your book (we don't hallucinate), anchored in a
cross-domain real-world analogy, and paired with starter code, expected output,
progressive hints, and a surprising fun-fact.

---

## ✨ Features

- **Drop in any programming PDF** — Python, Java, C++, Rust, Go, whatever. The
  retrieval core is language-agnostic; language behaviour lives in the prompt
  template registry.
- **5–8 progressive case studies** per topic, sorted novice → intermediate →
  advanced, each teaching exactly one concept.
- **Cross-domain real-world analogies** — every case study ships with a vivid
  analogy from history, biology, art, or daily life (think saree-weaving for
  decorators, library card-catalogues for hash maps).
- **Verifiable fun-facts** with a number, a date, or a name.
- **A learning roadmap** with milestones → mapped case studies → success
  criteria, topologically ordered.
- **Pluggable LLM** — pick from 4 free providers in the sidebar:
  HuggingFace Inference Router, HuggingFace Local (Space-RAM-gated), Groq free
  tier, or Ollama (local).
- **Grounded — never hallucinates** — if your topic isn't in the book, the app
  tells you so explicitly. No plausible-but-wrong output.
- **Downloads** — case studies + roadmap as JSON (machine) and Markdown (human).
- **Zero infra** — runs on a free HuggingFace Space.

---

## 🚀 Try it

### On the live Space

Open the Space URL → upload a PDF → wait for the green "Ready" badge → type a
topic → press **Generate**.

### Locally

```bash
git clone <this-repo> tinyteach
cd tinyteach
python -m venv .venv
. .venv/Scripts/Activate.ps1        # PowerShell; on macOS/Linux: . .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env                # optional: add HF_TOKEN or GROQ_API_TOKEN
streamlit run app.py                # opens at http://localhost:8501
```

The HF Inference Router works **without an API key** at low traffic. If you
hit rate limits, set `LLM_API_TOKEN` in `.env` (or paste an HF token in the
sidebar).

---

## 🏗 How it works

```
Upload PDF
   │
   ▼
[Parser]  ──►  [Chunker]  ──►  [Embedder]  ──►  [FAISS]  (data/indices/<book_id>/)
                                                  │
Topic ──► [Embedder] ──► [Retriever k=8] ─────────┤
                                                  ▼
                                          [PromptBuilder]
                                                  │
                                                  ▼
                                    [LLMProvider.generate]
                                                  │
                                                  ▼
                                        [JSONValidator]
                                                  │
                                                  ▼
                                [Case studies (5–8) + Roadmap]
```

The full architecture, invariants, and design rationale live in
[`PROJECT_BLUEPRINT.md`](./PROJECT_BLUEPRINT.md).

---

## ⚙️ Configuration

All knobs are in `.env` (copy from `.env.example`). The most useful:

| Key | Default | Notes |
|---|---|---|
| `LLM_PROVIDER` | `hf_inference` | `hf_inference` \| `hf_local` \| `groq` \| `ollama` |
| `LLM_MODEL` | `mistralai/Mistral-7B-Instruct-v0.3` | Any HF router-compatible model |
| `LLM_TEMPERATURE` | `0.3` | Set `0` for deterministic |
| `LLM_MAX_TOKENS` | `1800` | |
| `LLM_API_TOKEN` | _empty_ | Free HF tier works without one |
| `PROMPT_LANGUAGE` | `python` | `python` \| `java` \| `cpp` \| `generic` |
| `PROMPT_VERSION` | `v1` | Prompt registry version |
| `CHUNK_SIZE` | `800` | Characters per chunk |
| `CHUNK_OVERLAP` | `120` | |
| `RETRIEVAL_TOP_K` | `8` | |
| `RETRIEVAL_MIN_SCORE` | `0.25` | Below this, the topic is "not in book" |

The Streamlit sidebar mirrors the LLM / language keys and **hot-rebuilds** the
teaching service on the next generation.

---

## 🛠 Tech stack

| Layer | Choice | Why |
|---|---|---|
| PDF parsing | `PyMuPDF` | Fast, MIT, no Java |
| Chunking | `langchain-text-splitters` | Battle-tested |
| Embeddings | `sentence-transformers/all-MiniLM-L6-v2` (384-d) | ~80 MB, CPU |
| Vector store | `FAISS` (CPU) | Local, no server, free |
| LLM (default) | HF Inference Router (`router.huggingface.co/v1/chat/completions`) | Free, OpenAI-compatible |
| Frontend | `Streamlit` | One Python file UI |
| Hosting | HuggingFace Spaces (free CPU) | Zero infra |

Everything is pinned in `requirements.txt` (versions chosen to fit on the free
16 GB Space and to avoid known CVEs).

---

## 🧪 Development

```bash
pytest -q                    # all 254 tests
pytest -q -m "not slow"      # 235 fast tests in ~5 s
ruff check .                 # lint
ruff format .                # format
```

Test layout:

```
tests/
├── unit/          # pure-function tests (parsers, chunkers, schemas, prompts, UI state, …)
└── integration/   # end-to-end on a fixture PDF + AppTest smoke tests
```

The 254 tests cover everything from the JSON validator to the Streamlit state
machine to the schema-retry loop in the generation facade.

---

## 📚 Documentation

- [`PROJECT_BLUEPRINT.md`](./PROJECT_BLUEPRINT.md) — full spec, invariants, design patterns, phase plan
- [`context.md`](./context.md) — living state tracker (what's done, what's next, compatibility patches)
- `docs/EXTENDING.md` — how to add a new language or a new LLM (Phase 8)

---

## 📄 License

MIT. Free to use, modify, and deploy.
