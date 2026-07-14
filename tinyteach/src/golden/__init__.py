"""Golden-sample loader (Adapter — GoF).

Phase 8: ``data/golden/`` ships curated, pre-computed case-study + roadmap
JSON files for the "Try a demo" button in the UI. This module adapts the
on-disk JSON into the project's runtime DTOs (``TeachingResult``,
``CaseStudySet``, ``Roadmap``) so the rest of the app sees the golden
samples indistinguishably from a live LLM result (except for the
``is_demo=True`` marker).

Adding a new golden sample:

1. Drop ``data/golden/<language>/<topic>.json`` with the schema below.
2. (Optional) Update the per-language topic-list mapping in
   ``DEMO_TOPIC_BY_LANGUAGE`` to surface it on the demo button.

Schema of each golden file (one TeachingResult per file)::

    {
      "topic":        "<str>",
      "book_id":      "<str>",
      "language":     "<str>",
      "is_demo":      true,
      "case_studies": [ {<CaseStudy>}, ... ],
      "roadmap":      {<Roadmap>},
    }

The shape mirrors ``TeachingResult.to_dict()`` so the loader can be a
straightforward deserialiser.
"""
