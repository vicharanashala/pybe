"""Tests for ``SentenceTransformerEmbedder``.

These tests load the real sentence-transformers model, which is slow
(~80-300 MB download + 1-2 s load on first run). They are marked
``@pytest.mark.slow`` so ``pytest -q`` runs them by default but they
can be skipped via ``pytest -m "not slow"``.
"""

from __future__ import annotations

import numpy as np
import pytest
from src.config.settings import Settings
from src.domain.errors import EmbedderError
from src.ingestion.embedders.sentence_transformer_embedder import (
    SentenceTransformerEmbedder,
)

# --- begin: slow-marker ----------------------------------------------------
pytestmark = pytest.mark.slow
# --- end: slow-marker ------------------------------------------------------


# --- begin: dim-equals-known ----------------------------------------------
def test_dim_matches_minilm() -> None:
    """``all-MiniLM-L6-v2`` has known dimensionality 384."""
    embedder = SentenceTransformerEmbedder(
        Settings(embedding_model="sentence-transformers/all-MiniLM-L6-v2")
    )
    assert embedder.dim == 384


def test_dim_matches_minilm_name() -> None:
    """The ``name`` property is the configured model identifier."""
    embedder = SentenceTransformerEmbedder(
        Settings(embedding_model="sentence-transformers/all-MiniLM-L6-v2")
    )
    assert embedder.name == "sentence-transformers/all-MiniLM-L6-v2"


# --- end: dim-equals-known ------------------------------------------------


# --- begin: shape-and-normalisation ---------------------------------------
def test_embed_returns_correct_shape() -> None:
    """``embed`` of n texts yields an ``(n, dim)`` float32 array."""
    embedder = SentenceTransformerEmbedder(
        Settings(embedding_model="sentence-transformers/all-MiniLM-L6-v2")
    )
    vectors = embedder.embed(["hello world", "goodbye world", "another sentence"])
    assert vectors.shape == (3, 384)
    assert vectors.dtype == np.float32


def test_embed_outputs_are_unit_length() -> None:
    """Every returned vector MUST be L2-normalised (FAISS depends on it)."""
    embedder = SentenceTransformerEmbedder(
        Settings(embedding_model="sentence-transformers/all-MiniLM-L6-v2")
    )
    vectors = embedder.embed(["alpha", "beta", "gamma", "delta"])
    norms = np.linalg.norm(vectors, axis=1)
    np.testing.assert_allclose(norms, np.ones_like(norms), atol=1e-5)


# --- end: shape-and-normalisation -----------------------------------------


# --- begin: semantic-similarity -------------------------------------------
def test_similar_texts_score_higher_than_unrelated() -> None:
    """Semantic sanity check — 'cat sat on the mat' should beat 'asdfgh'."""
    embedder = SentenceTransformerEmbedder(
        Settings(embedding_model="sentence-transformers/all-MiniLM-L6-v2")
    )
    docs = [
        "The cat sat on the mat.",
        "A kitten rested on the rug.",
        "zxcvbnm qwerty asdfgh poiuyt.",
    ]
    vectors = embedder.embed(docs)
    # query == docs[0]; manual dot products avoid the FAISS layer.
    sim_self = float(np.dot(vectors[0], vectors[0]))
    sim_similar = float(np.dot(vectors[0], vectors[1]))
    sim_unrelated = float(np.dot(vectors[0], vectors[2]))
    assert sim_self > sim_similar > sim_unrelated


# --- end: semantic-similarity ---------------------------------------------


# --- begin: error-paths ---------------------------------------------------
def test_empty_input_raises() -> None:
    """``embed([])`` raises ``EmbedderError`` (caller bug, fail loudly)."""
    embedder = SentenceTransformerEmbedder(
        Settings(embedding_model="sentence-transformers/all-MiniLM-L6-v2")
    )
    with pytest.raises(EmbedderError):
        embedder.embed([])


# --- end: error-paths -----------------------------------------------------
