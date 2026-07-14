# TinyTeach — Project Blueprint

> A free, customisable, web-based tiny LLM that ingests any computer-language PDF book and generates curiosity-driven case-study questions + a learning roadmap for any topic.

---

## Table of Contents

1. [Vision & Goals](#1-vision--goals)
2. [Invariants (Non-Negotiable Truths)](#2-invariants-non-negotiable-truths)
3. [Quality Bar for Case Studies](#3-quality-bar-for-case-studies)
4. [Architecture Overview](#4-architecture-overview)
5. [SOLID Principles Applied](#5-solid-principles-applied)
6. [Gang-of-Four Design Patterns Applied](#6-gang-of-four-design-patterns-applied)
7. [Grokking System-Design Ideas Applied](#7-grokking-system-design-ideas-applied)
8. [Tech Stack & Justification](#8-tech-stack--justification)
8.5. [Performance & SLA Budgets](#85-performance--sla-budgets)
9. [Repository Layout](#9-repository-layout)
10. [Configuration & Customisation](#10-configuration--customisation)
11. [Error-Logging Strategy](#11-error-logging-strategy)
12. [The Prompts (Locked, Production-Grade)](#12-the-prompts-locked-production-grade)
13. [Phase-Wise Build Plan](#13-phase-wise-build-plan)
14. [Coding Standards](#14-coding-standards)
15. [Testing Strategy](#15-testing-strategy)
16. [Deployment (Free)](#16-deployment-free)
17. [Extending to Other Languages](#17-extending-to-other-languages)
18. [Anti-Hallucination Guardrails for the Coding AI](#18-anti-hallucination-guardrails-for-the-coding-ai)

---

## 1. Vision & Goals

**Vision.** Turn any well-formed PDF of a programming book into a personal tutor that teaches through *case studies so vivid the learner can't help but remember them* — the way the golden ratio shows up in sunflowers, the way a saree is woven on a pit-loom in Varanasi, or why a prison's air-conditioner hum tells you its age.

**Primary goals**
- G1: Upload a PDF → system indexes it for retrieval.
- G2: Enter a topic → system generates 5-8 progressive case studies that teach the topic end-to-end.
- G3: For each case study, provide (a) scenario, (b) task, (c) starter code, (d) expected output, (e) a real-world analogy, (f) a surprising fun-fact, (g) progressive hints, (h) the learning objective.
- G4: Generate an ordered learning roadmap (milestones → mapped case studies → success criteria).
- G5: All case studies grounded *only* in the uploaded book — refuse to hallucinate.
- G6: Customisable LLM (model, temperature, max-tokens, prompt style) without code changes.
- G7: Language-agnostic — drop in any language book, swap one prompt template, done.
- G8: 100 % free for the user and the creator.
- G9: Every error path is logged to disk with full context.

**Non-goals**
- N1: Not a general chatbot. The model is told to answer *only* from the uploaded book.
- N2: Not a fine-tuning pipeline (RAG is sufficient and keeps the project free).
- N3: Not multi-user / not authenticated. Single-user Streamlit app.

---

## 2. Invariants (Non-Negotiable Truths)

Any agent or human coding this project MUST preserve these. **If a change breaks one, the change is wrong.**

### Functional invariants

- **I-1 Groundedness.** Every generated case study MUST trace back to ≥ 1 chunk in the uploaded book. If no chunk covers the topic, the system returns `TOPIC_NOT_IN_BOOK` — never invents.
- **I-2 One-concept-per-case.** Each case study teaches exactly one programming concept. Multi-concept teaching is rejected.
- **I-3 Mandatory real-world analogy.** Every case study includes `real_world_analogy`. If absent, the response is rejected by the JSON validator and retried once.
- **I-4 Mandatory fun-fact.** Every case study includes `fun_fact` — a verifiable, surprising cross-domain fact.
- **I-5 Progressive difficulty.** Case studies are sorted `novice → intermediate → advanced`. Skipping difficulty is rejected.
- **I-6 Strict JSON output.** LLM returns JSON only — no prose outside the JSON block. Schema is validated before use.
- **I-7 Roadmap ordering.** Roadmaps are topologically ordered; each milestone has a `case_study_index` pointing into the generated case studies.
- **I-8 Idempotent ingestion.** Re-uploading the same book with the same fingerprint reuses the existing index; it does NOT re-embed.
- **I-9 Topic gate.** If the topic is absent from the book, the system returns a structured "topic not covered" message — never generates plausible-looking but unsupported content.
- **I-10 Language-agnostic core.** The RAG core knows nothing about Python. Language behaviour lives in the prompt-template registry only.

### Operational invariants

- **I-11 Zero cost.** No code path may require a paid API, a paid cloud service, or a GPU.
- **I-12 Customisable LLM.** Switching the LLM is a config change (`.env` / UI dropdown), never a code change.
- **I-13 Logged errors.** Every unhandled exception is captured with timestamp, traceback, user-context (book id, topic), and stack frame.
- **I-14 Deterministic outputs allowed.** `temperature = 0` is a first-class config; users may opt into it.
- **I-15 Stateless UI state.** Streamlit re-runs are idempotent — the index is loaded from disk, not rebuilt.
- **I-16 PII-safe logging.** Uploaded PDF text is never written to logs (only the file name and size).
- **I-17 Bounded memory.** Chunk size and overlap are fixed at config time — no runtime allocation surprises.
- **I-18 Failure is loud, never silent.** Silent `except: pass` is forbidden in production code (lint rule).

---

## 3. Quality Bar for Case Studies

This is the soul of the product. The prompt must enforce this.

### Examples of the bar

| Concept | Pass-grade analogy | Pass-grade fun-fact |
|---|---|---|
| Recursion | How Russian nesting dolls reveal themselves one layer at a time | The Ackermann function grows so fast it overflows at A(4) for any practical stack size |
| Hash maps | How a library's Dewey-decimal card catalogue points to a shelf in O(1) lookups | Python's `dict` switches from open-addressing to a compact layout once it exceeds 2/3 load — a detail Linus Torvalds once asked about on the mailing list |
| Loops | The rotating prayer wheels of a Tibetan monastery, where the same mantra returns endlessly | The first for-loop was invented by Ada Lovelace in 1843 for Bernoulli numbers |
| Generators | A vending machine that produces one item per coin instead of stocking the whole warehouse | Python's generator protocol was added in PEP 255 by Tim Peters, who deliberately removed the `send()` proposal's earlier complexity |
| Decorators | How a saree's zari border is woven last to frame the cloth without re-weaving it | The `@` syntax is a direct port of Java's annotation idea, introduced by Guido in 2003 for cleaner wrap-up of `classmethod` / `staticmethod` |

### What we explicitly REJECT
- "Imagine you have a list of numbers" — boring, generic.
- Real-world analogies that are *in the same domain* (e.g. another programming concept as the analogy).
- Fun-facts that are wrong or unverifiable.
- Case studies where the scenario is unrelated to the task.

---

## 4. Architecture Overview

```
┌────────────────────────────────────────────────────────────────────┐
│                          Streamlit UI (app.py)                     │
│   ┌───────────────┐  ┌──────────────────┐  ┌─────────────────┐    │
│   │ Upload Book   │  │ Enter Topic      │  │ Pick LLM        │    │
│   └───────────────┘  └──────────────────┘  └─────────────────┘    │
└─────────────────────────┬──────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────────────┐
│                  Teaching Facade  (teaching_service.py)            │
│   ┌──────────────────────┐      ┌────────────────────────┐         │
│   │  CaseStudyService    │      │   RoadmapService       │         │
│   └──────────────────────┘      └────────────────────────┘         │
└──────┬──────────────────────────────────────────┬──────────────────┘
       │                                          │
       ▼                                          ▼
┌─────────────────────┐                ┌──────────────────────────┐
│  RetrievalFacade    │                │   GenerationFacade       │
│  (retriever.py)     │                │   (generator.py)         │
└──────┬──────────────┘                └──────────┬───────────────┘
       │                                          │
       ▼                                          ▼
┌─────────────────────┐                ┌──────────────────────────┐
│  VectorStore        │                │   LLMProvider (Strategy) │
│  (FAISS repo)       │                │   • HF Inference (free)  │
│                     │                │   • HF Local model       │
└──────┬──────────────┘                │   • Groq (free tier)      │
       │                               │   • Ollama (local)       │
       ▼                               └──────────────────────────┘
┌─────────────────────┐
│ IngestionPipeline   │
│ (Chain of Resp.)    │
│  Parser → Chunker → │
│  Embedder → Indexer │
└─────────────────────┘
```

Data flow at runtime
```
Upload PDF
   │
   ▼
[Parser]  ──►  [Chunker]  ──►  [Embedder]  ──►  [FAISS]
                                                  │
Enter Topic ──► [Embedder] ──► [Retriever k=8] ───┤
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
                                       [CaseStudy + Roadmap]
```

---

## 5. SOLID Principles Applied

| Principle | Applied to this project |
|---|---|
| **S — Single Responsibility** | `PDFParser`, `Chunker`, `Embedder`, `Retriever`, `LLMProvider`, `PromptBuilder`, `JSONValidator`, `Logger` — each is one class, one job. The `app.py` UI never reaches into the model directly. |
| **O — Open/Closed** | Adding a new LLM provider = add a class that implements `LLMProvider`. Adding a new language = add a file in `prompts/languages/`. Zero edits to existing code. |
| **L — Liskov Substitution** | Any `LLMProvider` subclass must be drop-in: same `generate(system, user) -> str` signature, same exception types. Any `Chunker` subclass must return `list[Chunk]`. |
| **I — Interface Segregation** | `LLMProvider` only has the methods the orchestrator needs (`generate`, `name`, `is_available`). It doesn't expose token-counting, batching etc. unless needed. |
| **D — Dependency Inversion** | High-level modules (`TeachingService`) depend on the `LLMProvider` and `Retriever` *protocols* — never on concrete `HuggingFaceProvider`. Wired in `config/container.py`. |

---

## 6. Gang-of-Four Design Patterns Applied

| Pattern | Where | Why |
|---|---|---|
| **Strategy** | `LLMProvider`, `PDFParser`, `Chunker`, `Embedder` | Pick at runtime (HF, Groq, Ollama …), swap without rewrites. |
| **Factory** | `LLMProviderFactory.from_name("hf")`, `EmbedderFactory.from_config()` | Centralised construction, hides config detail. |
| **Builder** | `PromptBuilder` (system + context + topic → final prompt) | Step-by-step assembly of complex prompts. |
| **Template Method** | `BaseLanguagePrompt` — concrete `PythonPrompt`, `JavaPrompt`, etc. override the `system_block()` and `user_template()` methods. | Reuse RAG plumbing, vary only prompt. |
| **Facade** | `TeachingService`, `RetrievalFacade`, `IngestionFacade` | One entry per layer; callers don't see parsers / chunkers / etc. |
| **Chain of Responsibility** | `IngestionPipeline` — `Parser → Chunker → Embedder → Indexer` | Each step hands off to the next; new step = drop in a handler. |
| **Decorator** | `@with_retry`, `@with_cache`, `@with_logging` wrap any `LLMProvider` | Adds behaviour without subclassing. |
| **Repository** | `VectorStoreRepository` (FAISS-backed) hides persistence. | Easy to swap to Chroma / Weaviate later. |
| **Singleton** | `get_embedder()` returns a lazy-loaded, once-built embedder. | Model loads once; reused across requests. |
| **Observer** | `LogObserver` and `ProgressObserver` subscribe to pipeline events. | Decouples logging from the pipeline. |
| **Adapter** | `PDFParserAdapter` — `PyMuPDFAdapter`, `pdfplumberAdapter`, `UnstructuredAdapter`. | Common interface over different libs. |
| **Command** | Each pipeline step is a `Command` object with `.execute()` / `.undo()`. | Supports re-runs, retries, partial progress. |
| **State** | `AppState` enum: `EMPTY → INGESTING → READY → QUERYING → ERROR`. | UI greys out actions based on state. |

---

## 7. Grokking System-Design Ideas Applied

Even though it's a single-user app, the same ideas scale later.

| Idea | How it's used |
|---|---|
| **Cache-aside** | FAISS index is cached on disk; reload avoids re-embedding. Embeddings cached by book-fingerprint SHA-256. |
| **Lazy loading** | Embedder model, FAISS index, LLM client loaded on first use, then cached. |
| **Rate-limit awareness** | Decorator `@with_retry_and_backoff` for free-tier APIs (respect 429s). |
| **Bounded resources** | Chunk size, top-k, max-tokens — all in config; never hard-coded. |
| **Idempotency keys** | Ingestion keyed by `(filename, size, sha256)` — re-uploads are no-ops. |
| **Backpressure** | Streamlit progress bar reflects each pipeline step; long steps surface a spinner, not silent hang. |
| **Graceful degradation** | If `LLMProvider.is_available()` returns `False`, fall back to next provider in the priority list. |
| **Observability** | Structured logs (`logs/app.log`, `logs/errors.log`) — every error includes a correlation id. |
| **Stateless workers** | Each request is reproducible from `(book_id, topic, llm_config)` — no hidden state. |
| **Versioned prompt registry** | Prompts live under `src/generation/prompts/<lang>/v<n>.md`. Old versions never deleted. |

---

## 8. Tech Stack & Justification

| Layer | Choice | Why (free) |
|---|---|---|
| PDF parsing | `PyMuPDF` (`fitz`) | Fast, no Java deps, MIT license. |
| Chunking | `langchain-text-splitters` | Battle-tested `RecursiveCharacterTextSplitter`. |
| Embeddings | `sentence-transformers/all-MiniLM-L6-v2` (384-d, ~80 MB) | Runs on CPU, free. |
| Vector store | `FAISS` (CPU) | Local, no server, free, scales to ~1 M chunks per index. |
| LLM (default) | `mistralai/Mistral-7B-Instruct-v0.3` via **HF Inference API — router endpoint**, OpenAI-compatible | Free tier, optional token. Uses `https://router.huggingface.co/v1/chat/completions`. |
| LLM (alt 1) | `Qwen/Qwen2.5-1.5B-Instruct` loaded **directly in the HF Space** | Zero API cost; **risks OOM on the free 16 GB Space** — opt-in only, see §16. |
| LLM (alt 2) | Groq free tier (`llama-3.1-8b-instant`) | Fastest free tier; needs free API key. |
| LLM (alt 3) | Ollama (`gemma3:1b` etc.) — local | For power users; needs local install. |
| LLM (alt 4) | OpenAI-compatible client (`openai` Python SDK with `base_url` override) | Lets us hit HF router + Groq + any OpenAI-compatible endpoint with one client. |
| Frontend | `Streamlit` | One Python file UI; deploys to HF Spaces for free. |
| Hosting | **HuggingFace Spaces** (free CPU tier) | Zero infra cost. |
| Logging | `logging` + `RotatingFileHandler` + JSON formatter | Stdlib, free. |
| Config | `pydantic-settings` + `.env` | Type-safe, overridable. |
| Tests | `pytest` + `pytest-mock` | Stdlib-quality, free. |
| Lint / format | `ruff` + `black` | One config, no friction. |

### 8.1 Free-Tier Rate-Limit Budgets

Per-provider soft caps. The `@with_retry_and_backoff` decorator (Phase 3) MUST respect these — when a 429 arrives, it backs off for the listed cool-down. Users may override per-provider in `.env`.

| Provider | Req/min (free) | Tokens/min (free) | Cool-down on 429 |
|---|---|---|---|
| `hf_inference` (router) | ~30 | ~30 K input + ~10 K output | 60 s |
| `hf_local` | unlimited (local) | limited by RAM | n/a |
| `groq` | 30 | 20 K | 30 s |
| `ollama` | unlimited (local) | unlimited | n/a |

A token-bucket semaphore (size = `req/min`) lives in `providers/decorators.py`. Every `LLMProvider.generate()` call must acquire it; on timeout, raise `ProviderUnavailableError` → UI asks user to retry.

---

## 8.5. Performance & SLA Budgets

Measured on a free HF Space (2 vCPU, 16 GB RAM, cold start included).

| Operation | Target | Hard limit (alert in log) |
|---|---|---|
| App cold start → first interactive UI | < 25 s | 45 s |
| PDF upload (10 MB) → index ready | < 45 s | 90 s |
| Topic → first case study visible | < 15 s (HF inference) / < 30 s (HF local) | 60 s |
| Topic → full set (5–8 studies + roadmap) | < 60 s | 180 s |
| Embedding 1 K chunks | < 20 s | 60 s |
| FAISS search (k=8, 10 K chunks) | < 200 ms | 1 s |
| RAM footprint (default config) | < 4 GB | 8 GB |

These numbers go into `tests/perf/test_sla.py` as soft assertions (`pytest.skip` if the env is slower). They are *informational*, not gatekeeping — free hardware varies.

---

## 9. Repository Layout

```
tinyteach/
│
├── README.md
├── PROJECT_BLUEPRINT.md             # ← this file
├── requirements.txt
├── pyproject.toml                   # ruff + black + pytest config
├── .env.example
├── .gitignore
│
├── app.py                           # Streamlit entry
│
├── src/
│   ├── __init__.py
│   │
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py              # pydantic settings
│   │   ├── constants.py             # invariants, defaults, magic numbers
│   │   └── container.py             # DI wiring (singleton-ish builders)
│   │
│   ├── domain/                      # pure dataclasses, no I/O
│   │   ├── book.py                  # Book, BookFingerprint
│   │   ├── chunk.py                 # Chunk
│   │   ├── case_study.py            # CaseStudy, CaseStudySet
│   │   ├── roadmap.py               # Roadmap, Milestone
│   │   ├── topic.py                 # Topic query
│   │   └── errors.py                # custom exceptions
│   │
│   ├── ingestion/
│   │   ├── __init__.py
│   │   ├── pipeline.py              # IngestionPipeline (Chain + Facade)
│   │   ├── parsers/
│   │   │   ├── base.py              # PDFParser (ABC)
│   │   │   ├── pymupdf_parser.py    # Adapter
│   │   │   └── pdfplumber_parser.py # Adapter
│   │   ├── chunkers/
│   │   │   ├── base.py              # Chunker (ABC)
│   │   │   └── recursive_chunker.py
│   │   ├── embedders/
│   │   │   ├── base.py              # Embedder (ABC)
│   │   │   └── sentence_transformer_embedder.py
│   │   └── indexers/
│   │       ├── base.py              # Indexer (ABC)
│   │       └── faiss_indexer.py
│   │
│   ├── retrieval/
│   │   ├── __init__.py
│   │   ├── vector_store.py          # FAISS repository (Singleton)
│   │   ├── retriever.py             # RetrievalFacade
│   │   └── relevance.py             # threshold / re-rank
│   │
│   ├── generation/
│   │   ├── __init__.py
│   │   ├── providers/
│   │   │   ├── base.py              # LLMProvider (ABC)
│   │   │   ├── hf_inference.py      # HF Inference API
│   │   │   ├── hf_local.py          # model loaded in-process
│   │   │   ├── groq_provider.py
│   │   │   ├── ollama_provider.py
│   │   │   ├── factory.py           # LLMProviderFactory
│   │   │   └── decorators.py        # @with_retry, @with_cache, @with_logging
│   │   ├── prompts/
│   │   │   ├── base.py              # BaseLanguagePrompt (Template Method)
│   │   │   ├── registry.py          # PromptRegistry
│   │   │   ├── languages/
│   │   │   │   ├── python.py
│   │   │   │   ├── java.py
│   │   │   │   ├── cpp.py
│   │   │   │   └── generic.py
│   │   │   ├── builder.py           # PromptBuilder
│   │   │   └── few_shots.py         # few-shot libraries
│   │   ├── validator.py             # JSONValidator (pydantic)
│   │   ├── generator.py             # GenerationFacade
│   │   └── schemas.py               # pydantic models for output
│   │
│   ├── teaching/
│   │   ├── __init__.py
│   │   ├── teaching_service.py      # Top-level Facade
│   │   ├── case_study_service.py
│   │   └── roadmap_service.py
│   │
│   ├── observability/
│   │   ├── __init__.py
│   │   ├── logger.py                # configure_logging()
│   │   ├── correlation.py           # correlation-id per request
│   │   └── log_observer.py          # Observer for pipeline events
│   │
│   ├── ui/
│   │   ├── __init__.py
│   │   ├── components.py            # render_upload, render_topic, ...
│   │   ├── state.py                 # AppState (State pattern)
│   │   └── view_models.py           # UI-facing DTOs
│   │
│   └── utils/
│       ├── hashing.py               # sha256 helpers
│       ├── text_utils.py            # cleaning, normalisation
│       └── time_utils.py
│
├── data/                            # gitignored, runtime
│   ├── uploads/
│   ├── indices/
│   └── logs/
│       ├── app.log                  # rotation, info+
│       ├── errors.log               # rotation, error+ (with traceback)
│       └── ingest.log               # ingestion audit trail
│
├── tests/
│   ├── conftest.py
│   ├── unit/
│   │   ├── test_chunker.py
│   │   ├── test_embedder.py
│   │   ├── test_validator.py
│   │   └── test_prompt_builder.py
│   └── integration/
│       ├── test_ingestion_pipeline.py
│       ├── test_retrieval.py
│       └── test_generation.py
│
└── docs/
    ├── PROMPTS.md                   # raw prompt text + versioning policy
    ├── ARCHITECTURE.md              # diagrams in Mermaid
    └── EXTENDING.md                 # how to add a language / LLM
```

---

## 10. Configuration & Customisation

`.env.example`

```ini
# ---- Embedding ----
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
EMBEDDING_DEVICE=cpu
EMBEDDING_BATCH_SIZE=32

# ---- Chunking ----
CHUNK_SIZE=800
CHUNK_OVERLAP=120

# ---- Retrieval ----
RETRIEVAL_TOP_K=8
RETRIEVAL_MIN_SCORE=0.25

# ---- LLM ----
LLM_PROVIDER=hf_inference          # hf_inference | hf_local | groq | ollama
LLM_MODEL=mistralai/Mistral-7B-Instruct-v0.3
LLM_TEMPERATURE=0.3
LLM_MAX_TOKENS=1800
LLM_API_TOKEN=                      # only needed for non-free tiers; HF has anonymous free tier

# ---- Prompt ----
PROMPT_LANGUAGE=python              # python | java | cpp | generic
PROMPT_VERSION=v1

# ---- App ----
APP_DATA_DIR=./data
APP_LOG_LEVEL=INFO
APP_LOG_RETENTION_DAYS=14

# ---- Generation guards ----
GEN_MAX_RETRIES=2                   # one retry on schema failure
GEN_DETERMINISTIC=false             # if true, sets temperature=0
```

Customisation guarantees
- A user with no Python knowledge can edit `LLM_PROVIDER`, `LLM_MODEL`, `PROMPT_LANGUAGE` in `.env`.
- The Streamlit sidebar exposes the same keys as widgets — changes hot-reload (when possible) or prompt a restart.

---

## 11. Error-Logging Strategy

Three rotating log files, all under `data/logs/`:

| File | Level | Content | Rotation |
|---|---|---|---|
| `app.log` | INFO+ | Lifecycle events (upload, ingest, query) | 2 MB × 5 |
| `errors.log` | ERROR+ | Uncaught exceptions + traceback + correlation-id | 2 MB × 10 |
| `ingest.log` | INFO+ | Per-chunk / per-PDF audit trail | 2 MB × 5 |

Each error line is JSON with:
```json
{
  "ts": "2026-07-08T14:33:21.124Z",
  "level": "ERROR",
  "corr_id": "ab12cd34",
  "where": "teaching.case_study_service.generate",
  "book_id": "sha256:9af...",
  "topic": "recursion",
  "llm_provider": "hf_inference",
  "model": "Mistral-7B-Instruct-v0.3",
  "exception_type": "GenerationSchemaError",
  "message": "missing key 'real_world_analogy'",
  "traceback": "Traceback (most recent call last): ..."
}
```

**Where errors are caught**
| Layer | Behaviour |
|---|---|
| Ingestion | Per-stage exceptions caught by the pipeline. Pipeline aborts on first hard error, logs `traceback + stage + book_id`. Soft errors (empty page) → log WARN, continue. |
| Retrieval | Empty index / topic out-of-scope → return structured `TOPIC_NOT_IN_BOOK`. Never hallucinate. |
| Generation | JSON validation failure → `GEN_MAX_RETRIES` × retry; on final failure raise `GenerationFailed`; UI shows "Couldn't generate — see log". |
| UI | All uncaught Streamlit exceptions wrapped by a top-level `try/except` that writes to `errors.log` and shows a user-friendly error. **No silent failures.** |

Custom exception hierarchy (in `domain/errors.py`):
```
TinyTeachError
 ├── IngestionError
 │    ├── ParserError
 │    ├── ChunkerError
 │    ├── EmbedderError
 │    └── IndexerError
 ├── RetrievalError
 │    ├── IndexMissingError
 │    └── TopicNotInBookError
 ├── GenerationError
 │    ├── ProviderUnavailableError
 │    ├── GenerationSchemaError
 │    └── GenerationTimeoutError
 └── ConfigError
```

---

## 12. The Prompts (Locked, Production-Grade)

> These prompts are LOCKED — do NOT edit at code time. Vary them only via the prompt-version registry.

### 12.1 Case-Study Generation (SYSTEM)

```
You are TinyTeach, an expert programming tutor who teaches exclusively through vivid,
real-world case studies. Your mission is to make every programming concept unforgettable
by anchoring it in a fascinating, surprising phenomenon from a different domain.

ABSOLUTE RULES (violating any is a failure):
1. Use ONLY the provided "Book Context". If the Book Context does not cover the topic,
   reply with EXACTLY this token and nothing else: "TOPIC_NOT_IN_BOOK".
2. Each case study teaches EXACTLY ONE programming concept. Do not bundle multiple.
3. Every case study MUST include a "real_world_analogy" — a vivid cross-domain
   connection from history, biology, art, mathematics, or daily life that makes the
   concept click in <30 seconds of reading.
4. Every case study MUST include a "fun_fact" — a surprising, verifiable fact the
   learner probably does not know. Prefer facts with a number, a date, or a name.
5. Order the case studies in three ascending tiers: novice → intermediate → advanced.
   No skipping difficulty. No duplicates.
6. Output STRICT JSON only. No prose before or after the JSON. **No markdown
   fences (```, ```json, etc.) — the consumer is a strict parser, not a human.
   If you ignore this rule, your output will be REJECTED and you will be asked to
   re-emit without fences.** No trailing commas. No comments.
7. Use double-quoted JSON strings. Escape newlines as \n.
8. The "starter_code" must be syntactically valid for the target language.
   The "expected_output" must be exactly what the reference solution prints.
9. "hints" array must contain 1-3 hints from gentle to specific. NEVER give the
   final solution.
10. The "scenario" must intrigue. The reader should feel "wait, what?" before
    reading the task.
```

### 12.2 Case-Study Generation (USER template)

```
Topic: "{topic}"
Target language: "{language}"
Book fingerprint: "{book_id}"
Book chunks (ranked by relevance, top-K={top_k}):
--- BEGIN BOOK CONTEXT ---
{context_chunks}
--- END BOOK CONTEXT ---

Generate 5 to 8 case studies that together teach "{topic}" from first principles
to mastery. The case studies MUST be derivable ONLY from the Book Context above.
If {topic} is not covered, reply EXACTLY: "TOPIC_NOT_IN_BOOK".

Return JSON with this exact schema:
{{
  "topic": "<string>",
  "case_studies": [
    {{
      "title":            "<vivid, curiosity-inducing title>",
      "concept":          "<one specific programming concept taught>",
      "difficulty":       "novice|intermediate|advanced",
      "scenario":         "<real-world situation, 2-3 sentences, makes reader curious>",
      "task":             "<what the learner must do, in plain English>",
      "starter_code":     "<valid {language} code skeleton>",
      "expected_output":  "<exact output of the reference solution>",
      "real_world_analogy": "<cross-domain analogy, vivid, <60 words>",
      "fun_fact":         "<surprising verifiable fact, <40 words>",
      "hints":            ["<hint 1, gentle>", "<hint 2, specific>", "<hint 3, almost-spoiler>"],
      "learning_objective": "<one sentence, what the learner will own after>"
    }}
  ]
}}
```

### 12.3 Roadmap Generation (SYSTEM)

```
You design learning roadmaps. A roadmap is an ordered sequence of milestones that
takes a learner from zero to mastery of one topic, using ONLY the case studies
already generated. You never invent new content; you sequence existing material.

RULES:
1. Use ONLY the case studies provided. Do not add new ones.
2. Each milestone references exactly one case_study_index.
3. Order is foundational → advanced. No skipping.
4. Each milestone has 1-3 success_criteria — concrete, testable.
5. estimated_hours is a realistic integer (5-40).
6. Reply "TOPIC_NOT_IN_BOOK" if the case studies are insufficient.
7. STRICT JSON only. No prose. **No markdown fences (```, ```json) — the
   consumer is a strict parser.**
```

### 12.4 Roadmap Generation (USER template)

```
Topic: "{topic}"
Generated case studies (JSON):
--- BEGIN CASE STUDIES ---
{case_studies_json}
--- END CASE STUDIES ---

Produce a roadmap:
{{
  "topic": "<string>",
  "estimated_hours": <int>,
  "milestones": [
    {{
      "name": "<short, motivating>",
      "description": "<1-2 sentences>",
      "case_study_index": <int>,
      "success_criteria": ["<testable>", "<testable>"]
    }}
  ]
}}
```

### 12.5 Few-shot anchor (always prepended)

```
Example of a pass-grade case study (for tone, NOT content):
{
  "title": "The Saree Loom That Wove Itself",
  "concept": "Decorators",
  "difficulty": "novice",
  "scenario": "In Varanasi, master weavers finish a Banarasi silk by weaving a
   zari border AROUND the existing cloth — they never unravel a single thread.
   Python decorators work the same way: they wrap a function with extra behaviour
   without touching its source.",
  "task": "Wrap `greet(name)` with a `@border` decorator that prints '=' * 20
   before and after the call. Write the decorator yourself — do not use
   `functools.wraps` yet.",
  "starter_code": "def greet(name):\n    print(f\"hello {name}\")",
  "expected_output": "====================\nhello aditya\n====================",
  "real_world_analogy": "A saree's zari border is woven last. The body of the
   cloth is never torn open. Decorators add a 'border' to a function without
   editing its body. The Python core team chose the @ syntax deliberately —
   it reads as 'this function, but dressed up'.",
  "fun_fact": "The @ syntax landed in Python 2.4 via PEP 318 (2004) after a
   four-month python-dev debate. The community weighed [[decorate]],
   |decorate|, the `def foo() as bar:` form, and `apply decorate` before
   Guido settled on @. His stated reason (on the python-dev list):
   it reads as 'at' and visually sits ABOVE the line, like a hat — a
   small symbol that doesn't crowd the function signature.",
  "hints": [
    "A decorator is just a function that takes a function and returns a function.",
    "Inside your decorator, define an inner function and call the original there.",
    "Print '=' * 20 before and after you call the original function."
  ],
  "learning_objective": "Understand that a decorator is a higher-order function
   that transparently augments another function's behaviour."
}
```

### 12.6 Prompt-versioning policy

- All prompts live in `src/generation/prompts/languages/<lang>.py` and are addressed by `(language, version)`.
- Old versions are never deleted; new versions live alongside.
- The registry resolves `(LANGUAGE, PROMPT_VERSION)` and falls back to `generic` if not found.

---

## 13. Phase-Wise Build Plan

> **Rule for the coding AI:** complete one phase end-to-end (all files, all tests, all comments) before touching the next. After each phase, run `pytest -q` and `ruff check .`. If either fails, fix before moving on.

---

### Phase 0 — Foundations (≈ 1 day)

**Goal.** Repo skeleton, observability, config, domain models. Nothing runs yet — but the bones are SOLID.

**Deliverables**
1. `pyproject.toml` with `ruff`, `black`, `pytest` config. Rule: line length 100, target Python 3.11.
2. `requirements.txt` with pinned versions. **Use the lockfile below verbatim** — versions are chosen to avoid known CVEs and to fit on the free 16 GB HF Space (§16).

```txt
# --- runtime --------------------------------------------------------------
pymupdf==1.24.10            # CVE-2024-*** patched; <1.24 has image-parsing RCE
langchain-text-splitters==0.3.5
sentence-transformers==3.2.1
faiss-cpu==1.9.0            # do NOT install faiss-gpu on free Space
streamlit==1.39.0
pydantic==2.9.2
pydantic-settings==2.6.1
httpx==0.27.2
tenacity==9.0.0
python-dotenv==1.0.1
openai==1.54.4              # OpenAI-compatible client for HF router + Groq
groq==0.11.0                # free-tier SDK (used only if LLM_PROVIDER=groq)
psutil==6.1.0               # for OOM guard in hf_local.is_available()

# --- dev ------------------------------------------------------------------
pytest==8.3.3
pytest-mock==3.14.0
respx==0.21.1
ruff==0.7.2
black==24.10.0
```

Phase-N (N ≥ 1) may add deps but MUST justify in one sentence and update this file.
3. `src/config/settings.py` — `Settings(BaseSettings)` with every `.env` key from §10.
4. `src/config/constants.py` — magic numbers, default paths, log format strings.
5. `src/observability/logger.py` — `configure_logging(settings)` writes to all three log files with `RotatingFileHandler`. JSON formatter with `corr_id`, `book_id`, `topic`. Includes a contextvar `correlation_id` set per request.
6. `src/observability/correlation.py` — `with_correlation_id()` context manager.
7. `src/domain/errors.py` — exception hierarchy from §11.
8. `src/domain/{book,chunk,case_study,roadmap,topic}.py` — `@dataclass(frozen=True)` with `to_dict / from_dict`. **No methods that do I/O.**
9. `tests/conftest.py` with fixtures: `tmp_data_dir`, `clean_settings`.
10. `tests/unit/test_logger.py` — assert each log file receives a record.

**Acceptance.**
- `pytest -q` passes.
- `ruff check .` passes with zero warnings.
- `python -c "from src.config.settings import Settings; print(Settings())"` prints a valid config.

**Prompts to the coding AI (verbatim, hand them over):**
> Build Phase 0 from PROJECT_BLUEPRINT.md §13 "Phase 0". Read §10 (config keys), §11 (logging), §14 (coding standards), §15 (testing). Use the locked requirements file (§13 Phase 0 deliverable #2) verbatim — pin every version, do not upgrade. Create an empty `__init__.py` in EVERY directory under `src/` and `tests/` so package imports work. Files to create: pyproject.toml, requirements.txt, .env.example, .gitignore, src/__init__.py, src/config/{__init__.py,settings.py,constants.py,container.py}, src/observability/{__init__.py,logger.py,correlation.py,log_observer.py}, src/domain/{__init__.py,errors.py, book.py, chunk.py, case_study.py, roadmap.py, topic.py}, tests/__init__.py, tests/conftest.py, tests/unit/__init__.py, tests/unit/test_logger.py. Do NOT touch Phase 1+ files. Do NOT add features not listed. When done, run `pytest -q` and `ruff check .` — both must be green. Then run `python -c "from src.config.settings import Settings; print(Settings())"` and confirm it exits 0.

---

### Phase 1 — PDF Ingestion Pipeline (≈ 2 days)

**Goal.** Upload a PDF → produce a persisted FAISS index and a chunk store. Fully tested with a sample PDF.

**Deliverables**
1. `src/ingestion/parsers/base.py` — `class PDFParser(ABC)` with `def parse(self, path: Path) -> list[Page]` and `class Page` dataclass with `number: int`, `text: str`.
2. `src/ingestion/parsers/pymupdf_parser.py` — concrete adapter. Cleans text with `text_utils`.
3. `src/ingestion/chunkers/base.py` — `class Chunker(ABC)` with `def chunk(self, pages: list[Page], *, book_id: str) -> list[Chunk]`.
4. `src/ingestion/chunkers/recursive_chunker.py` — uses `RecursiveCharacterTextSplitter` with config-driven size/overlap.
5. `src/ingestion/embedders/base.py` — `class Embedder(ABC)` with `def embed(self, texts: list[str]) -> np.ndarray` and `def dim` property.
6. `src/ingestion/embedders/sentence_transformer_embedder.py` — loads once, lazy, reused.
7. `src/ingestion/indexers/base.py` — `class Indexer(ABC)` with `save / load / add / search`.
8. `src/ingestion/indexers/faiss_indexer.py` — IndexFlatIP, L2-normalised vectors, persists to `data/indices/<book_id>/`.
9. `src/ingestion/pipeline.py` — `class IngestionPipeline` orchestrates: `parse → chunk → embed → index`. Returns an `IngestionResult(book_id, chunk_count, index_path)`.
10. `src/utils/hashing.py` — `sha256_file(path)` and `book_fingerprint(filename, size, sha256)`.
11. Tests for each layer + an integration test on a 5-page PDF in `tests/fixtures/`.

**Invariants enforced in this phase:** I-8 (idempotent), I-13 (logged errors), I-16 (no PDF text in logs), I-17 (bounded memory).

**Acceptance.**
- `pytest -q` passes including integration test that ingests a real PDF in <30 s on CPU.
- Re-running ingestion on the same file does NOT re-embed (idempotency proven by timestamp).
- Failure of any stage produces a structured error log entry.

**Prompts to the coding AI:**
> Build Phase 1 from PROJECT_BLUEPRINT.md §13 "Phase 1". Adhere strictly to SOLID + GoF patterns in §5 & §6. The Parser is a Strategy; the Chunker is a Strategy; the Embedder is a Strategy; the Indexer is a Strategy. The Pipeline is a Facade AND a Chain-of-Responsibility internally. NO silent excepts (invariant I-13, I-18). Pin every dependency in requirements.txt. Each public class MUST have a docstring naming its GoF role. Run `pytest -q` and `ruff check .` at the end.

---

### Phase 2 — Vector Store & Retrieval (≈ 1 day)

**Goal.** Given a query string, return top-k chunks with scores. Reject low-quality matches.

**Deliverables**
1. `src/retrieval/vector_store.py` — `VectorStoreRepository` wraps FAISS load/save. Cached by `book_id` (Singleton via `functools.lru_cache`).
2. `src/retrieval/retriever.py` — `Retriever.retrieve(query: str, book_id: str, top_k: int) -> list[RetrievedChunk]`. Filters chunks with score < `RETRIEVAL_MIN_SCORE`.
3. `src/retrieval/relevance.py` — cosine helpers, threshold logic.
4. `src/domain/chunk.py` — add `RetrievedChunk(chunk, score)` dataclass.
5. Tests: unit on score filter, integration on a real index.

**Invariants enforced:** I-1 (groundedness — retrieval is the gate), I-10 (language-agnostic — retrieval knows nothing about language).

**Acceptance.**
- Query "lambda functions" on a Python index returns ≥ 1 chunk with score ≥ 0.3.
- Query "biology of sunflowers" on a Python index returns 0 chunks (below threshold).

---

### Phase 3 — LLM Provider Layer (≈ 2 days)

**Goal.** Pluggable LLM providers with retry / cache / logging decorators. Customisable from config.

**Deliverables**
1. `src/generation/providers/base.py` — `class LLMProvider(ABC)` with `name: str`, `is_available() -> bool`, `generate(system: str, user: str) -> str`.
2. `src/generation/providers/hf_inference.py` — uses `openai` SDK with `base_url="https://router.huggingface.co/v1"` and optional `HF_TOKEN` env var. Endpoints: `chat.completions.create(model=LLM_MODEL, messages=[{system},{user}])`. NOT the deprecated `api-inference.huggingface.co` URL.
3. `src/generation/providers/hf_local.py` — loads `transformers` pipeline; gated behind `LLM_PROVIDER=hf_local`. **OOM guard:** `is_available()` returns `False` when `psutil.virtual_memory().available < 4 * 1024**3`. Logs WARN.
4. `src/generation/providers/groq_provider.py` — `openai` SDK with `base_url="https://api.groq.com/openai/v1"`. Uses `GROQ_API_TOKEN`.
5. `src/generation/providers/ollama_provider.py` — calls `http://localhost:11434/api/generate`.
6. `src/generation/providers/factory.py` — `LLMProviderFactory.from_settings(settings) -> LLMProvider`. Priority order: configured provider → fallback chain (each tested via `is_available()`).
7. `src/generation/providers/decorators.py` — `@with_retry_and_backoff` (respects §8.1 rate-limit table; token-bucket semaphore sized to req/min), `@with_cache(memory or disk)`, `@with_logging`. Decorator stack order: cache → retry → logging.
8. Tests with `respx` (httpx mock) and a fake `LLMProvider`.

**Invariants enforced:** I-11 (zero cost — every default is free), I-12 (customisable).

**Acceptance.**
- Factory returns the configured provider.
- If primary is `is_available() == False`, factory returns the next.
- Decorated provider retries on 429 with backoff.

---

### Phase 4 — Prompt Engineering & Builder (≈ 2 days)

**Goal.** Locked prompts, registry, builder, schema, validator.

**Deliverables**
1. `src/generation/prompts/base.py` — `BaseLanguagePrompt` with abstract `system_block()` and `user_template()`. Uses string templates (Jinja2 or stdlib `string.Template`).
2. `src/generation/prompts/languages/{python,java,cpp,generic}.py` — concrete prompts from §12 verbatim.
3. `src/generation/prompts/registry.py` — `PromptRegistry.resolve(language, version)`. Falls back to `generic` then raises `ConfigError`.
4. `src/generation/prompts/builder.py` — `PromptBuilder.build_case_study_prompt(topic, context, language, version) -> (system, user)`. Injects book_id, top_k, language.
5. `src/generation/prompts/few_shots.py` — `FEW_SHOT_CASE_STUDY` constant. Always prepended to the user prompt.
6. `src/generation/schemas.py` — `pydantic` `CaseStudy`, `CaseStudySet`, `Roadmap`, `Milestone`. Marked `extra="forbid"`, `strict=True`.
7. `src/generation/validator.py` — `validate_case_studies(raw: str) -> CaseStudySet` and `validate_roadmap(raw: str, n_case_studies: int) -> Roadmap`. On `ValidationError`, raises `GenerationSchemaError` with the parser message.
   - **Pre-parse step:** strip leading/trailing whitespace and any markdown code fences (` ```json\n ... \n``` ` → raw JSON). Implemented as `utils/strip_fences.py`. If stripping leaves no valid JSON, raise `GenerationSchemaError("unparseable, raw=" + first_200_chars)`.
   - Re-emit prompt on schema failure includes the exact missing/invalid fields.

**Invariants enforced:** I-1, I-2, I-3, I-4, I-5, I-6, I-9, I-10.

**Acceptance.**
- A run that returns valid schema → parses to dataclass.
- A run missing `real_world_analogy` → raises `GenerationSchemaError` (validator unit test).

---

### Phase 5 — Generation Facade & Teaching Services (≈ 2 days)

**Goal.** Top-level service. UI talks to these only.

**Deliverables**
1. `src/generation/generator.py` — `GenerationFacade.generate_case_studies(topic, book_id) -> CaseStudySet`. Internals: build prompt → call provider → parse → on `GenerationSchemaError`, retry up to `GEN_MAX_RETRIES` with a "previous attempt violated {errors}, fix and re-output" suffix.
2. `src/generation/generator.py` — also `generate_roadmap(topic, case_study_set, book_id) -> Roadmap`.
3. `src/teaching/case_study_service.py` — wraps retrieval + generation with correlation id.
4. `src/teaching/roadmap_service.py` — wraps roadmap generation.
5. `src/teaching/teaching_service.py` — `TeachingService.teach(topic, book_id) -> TeachingResult(case_studies, roadmap)`. The single entry point for UI.

**Invariants enforced:** I-1..I-9 (the whole teaching contract).

**Acceptance.**
- `TeachingService.teach("decorators", book_id)` returns a `CaseStudySet` (≥ 5 studies) and a `Roadmap` (≥ 3 milestones).
- If the topic is absent from the book, returns a `TOPIC_NOT_IN_BOOK` structured result, never raises.
- Every retry is logged.

---

### Phase 6 — Streamlit UI (≈ 2 days)

**Goal.** Friendly web UI. Loads index from disk if present. Sidebar lets the user pick the LLM and language.

**Deliverables**
1. `app.py` — entry. `st.set_page_config`, `configure_logging(...)`, init `AppState`.
2. `src/ui/state.py` — `class AppState` (State pattern) with stages and transition methods. Persists via `st.session_state`.
3. `src/ui/components.py` — `render_upload`, `render_model_picker`, `render_topic_input`, `render_case_studies`, `render_roadmap`. Each is a pure function from session state to UI.
4. `src/ui/view_models.py` — UI-facing DTOs (e.g., `CaseStudyCard(title, scenario_md, ...)`).
5. A polling indicator while generation runs (no silent hangs).
6. A "Download case studies + roadmap as JSON / Markdown" button.

**Invariants enforced:** I-15 (stateless UI), I-13 (errors logged), I-18 (no silent failures).

**Acceptance.**
- User can upload a PDF, see "Indexing..." spinner, then a "Ready" badge.
- User enters a topic, sees case studies one-by-one with a collapsible "Show fun fact" / "Show hints" / "Show solution".
- Selecting a different LLM in the sidebar hot-updates the call (or prompts a restart with a clear message).

---

### Phase 7 — Deployment to HuggingFace Spaces (≈ 1 day)

**Goal.** Live URL, free, no infra to maintain.

**Deliverables**
1. `requirements.txt` frozen.
2. `app.py` importable from root.
3. `README.md` HF-Spaces-compatible — front-matter `sdk: streamlit`, `app_port: 7860`.
4. Push to a HF Space.
5. Smoke-test on the deployed app.

**Acceptance.**
- Visiting the Space URL → app loads in browser, can upload a PDF, can ask a topic, gets a response.

---

### Phase 8 — Extensibility Polish (≈ 1 day)

**Goal.** Drop-in a new language / new LLM with zero edits to core.

**Deliverables**
1. `docs/EXTENDING.md` — "Adding a new language" and "Adding a new LLM".
2. A worked example: add `rust.py` prompt template, end-to-end test with a Rust PDF.
3. A worked example: add a new `LLMProvider` subclass + register in factory.
4. Example outputs (Golden folder) — 3 sample case studies per language for marketing / showcasing.
5. A `Demo` button in the UI that runs the preloaded index on a fixed topic.

**Acceptance.**
- Adding `rust.py` + flipping `PROMPT_LANGUAGE=rust` works without code edits anywhere else.

---

## 14. Coding Standards

> These are non-negotiable. The coding AI MUST follow them.

1. **PEP 8 with line length 100** (`ruff format`, `black`).
2. **Type hints on every public function and method.** `from __future__ import annotations`.
3. **One class per file** for everything in `src/` (small files, big namespaces).
4. **Docstrings on every module, class, public method.** The docstring MUST say, in the first line, the GoF role or SOLID justification, e.g.:
   ```python
   """In-memory cache decorator for an LLMProvider.

   Decorator role: Concrete Decorator (GoF). Wraps any LLMProvider and short-
   circuits identical (system, user) calls by returning the cached response.
   """
   ```
5. **Comment-block before each major function** explaining intent, not mechanics. Example:
   ```python
   # --- begin: cosine similarity ---------------------------------------
   # We L2-normalise at index time and at query time so that inner-product
   # on FAISS IndexFlatIP equals cosine similarity. This lets the threshold
   # in RETRIEVAL_MIN_SCORE be interpreted directly as a similarity floor.
   def cosine(a, b): ...
   # --- end: cosine similarity -----------------------------------------
   ```
6. **No bare `except:`** anywhere. `except Exception as e:` and re-raise or log.
7. **No `print` in production code.** Use the logger.
8. **No `global`.** Pass dependencies explicitly.
9. **Constants in `config/constants.py`.** No magic numbers in code.
10. **Pydantic for external boundaries** (LLM JSON, env config). Dataclasses for internal value objects.
11. **Imports grouped**: stdlib → third-party → local; `ruff` enforces.
12. **Public functions have ≤ 30 lines**; if longer, extract a helper.
13. **Tests live next to the layer they test**, named `test_<file_under_test>.py`.

---

## 15. Testing Strategy

| Layer | Test type | What's covered |
|---|---|---|
| Domain | Unit | Dataclass round-trip, exceptions raised. |
| Parsers | Unit (parametrised) | Multi-page PDF, scanned-page (text-empty) handling. |
| Chunkers | Unit | Overlap invariants, never-empty, max-size. |
| Embedders | Unit (small model) | Determinism, dim, batch. |
| Indexers | Unit | Save/load round-trip, search returns. |
| Retrieval | Unit + integration | Threshold filter behaviour. |
| Providers | Unit (httpx mocked) | Retry, fallback, schema-error retry. |
| Validator | Unit | Good JSON, missing key, extra key, wrong type. |
| Prompts | Unit (snapshot) | Rendered prompt matches snapshot. |
| Teaching service | Integration | End-to-end on a fixture PDF. |
| UI | Smoke (manual) | Streamlit app boots. |

Coverage target: ≥ 80 % on `src/`. CI-friendly: no network calls in unit tests.

---

## 16. Deployment (Free)

**HuggingFace Spaces — CPU free tier** (`basic-2x4` = 2 vCPU / 16 GB RAM)

1. Create a new Space, SDK = Streamlit.
2. Push the repo; HF builds the image and serves.
3. If the default LLM is `hf_inference`, no key is required for low-traffic use. If a user supplies `HF_TOKEN` in Space secrets, the app picks it up.
4. `app_port: 7860`, `sdk: streamlit` in README front-matter.

**Memory budget on the free Space (hard ceiling = 16 GB)**

| Component | Approx RAM |
|---|---|
| Streamlit + Python runtime | 250 MB |
| `sentence-transformers/all-MiniLM-L6-v2` (embedder) | 300 MB |
| FAISS index for a 500-page book | < 50 MB |
| PyMuPDF parser (per upload) | < 100 MB |
| **Headroom (must stay free)** | **~15 GB** |

**Default LLM on a free Space MUST be `hf_inference` (router).** `hf_local` loads a 1.5 B+ param model and will OOM. The factory (Phase 3) checks `psutil.virtual_memory().available < 4 GB` and silently downgrades `hf_local` → `hf_inference`, logging a WARN. The UI shows a banner: "Local model downgraded to cloud inference — free Space is RAM-limited".

**Smoke test after deploy**
- Upload a small PDF, wait for "Ready", enter "decorators", expect ≥ 5 case studies and a roadmap.
- Open DevTools → confirm the inference call hits `https://router.huggingface.co/v1/chat/completions` (not the legacy endpoint).

---

## 17. Extending to Other Languages

To teach a new language:
1. Drop `src/generation/prompts/languages/<lang>.py` with the locked structure (§12.1, §12.2, §12.5 few-shot adapted to the language).
2. Set `PROMPT_LANGUAGE=<lang>` in `.env`.
3. Re-upload a book of that language.
That's it. No core edits.

The RAG core already language-agnostic (it only knows chunks + embeddings).
The roadmap / case-study logic is data-driven from the LLM JSON.

---

## 18. Anti-Hallucination Guardrails for the Coding AI

When you delegate implementation to an AI, hand it this exact preamble **and** the relevant phase section of this blueprint:

```
You are implementing Phase <N> of PROJECT_BLUEPRINT.md. Read the entire blueprint
before writing code. Do NOT invent requirements not in §13 "Phase <N>". Do NOT
modify files from other phases. Do NOT introduce features that aren't listed.
Do NOT use any external service not listed in §8. Do NOT add dependencies not
listed in Phase 0's requirements.txt unless you can justify in one sentence.

Follow §14 (Coding Standards) line-by-line:
- type hints on every public function
- docstring first line = GoF role or SOLID justification
- comment-block before each major function explaining intent
- no print(), no global, no bare except
- one class per file

After you finish, run:
    ruff check .
    ruff format .
    pytest -q
Both MUST be green before you report done. If a test fails, fix it. If a
lint warning appears, fix it. Do NOT ignore.

If you are uncertain about an API, prefer the existing pattern from
src/<neighbour_file>.py over inventing a new one.
```

---

## Appendix A — File-Order for the Coding AI (recommended)

1. `pyproject.toml`, `requirements.txt`
2. `src/config/{constants,settings}.py`
3. `src/observability/{logger,correlation}.py`
4. `src/domain/{errors,book,chunk,case_study,roadmap,topic}.py`
5. `tests/conftest.py` + `tests/unit/test_logger.py` → run
6. Then proceed phase by phase. After each phase: `ruff check . && pytest -q`.
