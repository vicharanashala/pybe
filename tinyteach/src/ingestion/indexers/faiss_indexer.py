"""FAISS-CPU indexer (Concrete Strategy + Repository — GoF).

We use ``IndexFlatIP`` (exact inner-product search) because the corpus
is small (≤ ~20 K chunks per book — see ``constants.MAX_CHUNKS_PER_BOOK``).
The index stores ONLY vectors; chunks live alongside in
``chunks.jsonl``. The mapping is positional: ``index[i]`` ↔ line ``i``
of the JSONL file.
"""

from __future__ import annotations

from pathlib import Path

import faiss
import numpy as np

from src.domain.errors import IndexerError
from src.ingestion.indexers.base import Indexer, SearchHit


# --- begin: faiss indexer --------------------------------------------------
class FaissIndexer(Indexer):
    """Concrete ``Indexer`` backed by FAISS ``IndexFlatIP``."""

    # --- begin: filenames -------------------------------------------------
    # Two-file layout in each ``<book_id>/`` directory:
    #   index.faiss  — the FAISS index, binary
    #   chunks.jsonl — one Chunk per line, JSON
    # The mapping is positional: row ``i`` in the index ↔ line ``i`` here.
    FILENAME_INDEX = "index.faiss"
    # --- end: filenames ---------------------------------------------------

    def __init__(self, dim: int) -> None:
        """Build an empty FAISS index of dimension ``dim``."""
        if dim <= 0:
            raise IndexerError(f"FaissIndexer requires dim > 0; got {dim}.")
        self._dim = int(dim)
        self._index = faiss.IndexFlatIP(self._dim)
        # Maps user-facing id -> positional index. We keep a numpy array
        # so ``id_at_position`` is O(1). For our ≤20 K size, this is
        # trivial memory.
        self._ids: list[int] = []

    @property
    def name(self) -> str:
        return "faiss"

    @property
    def dim(self) -> int:
        return self._dim

    @property
    def size(self) -> int:
        return int(self._index.ntotal)

    # --- begin: add -------------------------------------------------------
    def add(self, vectors: np.ndarray, ids: np.ndarray) -> None:
        """Add ``vectors`` (n, dim) float32 under integer ``ids`` (n,)."""
        vectors = np.asarray(vectors, dtype=np.float32)
        ids = np.asarray(ids, dtype=np.int64).reshape(-1)

        if vectors.ndim != 2 or vectors.shape[1] != self._dim:
            raise IndexerError(
                f"FaissIndexer.add: expected shape (n, {self._dim}); got {vectors.shape}."
            )
        if vectors.shape[0] != ids.shape[0]:
            raise IndexerError(
                f"FaissIndexer.add: len(vectors)={vectors.shape[0]} != len(ids)={ids.shape[0]}."
            )
        if vectors.shape[0] == 0:
            return

        try:
            self._index.add(vectors)
        except Exception as exc:
            raise IndexerError(f"FAISS add() failed: {exc!r}") from exc
        self._ids.extend(int(i) for i in ids.tolist())

    # --- end: add ---------------------------------------------------------

    # --- begin: search -----------------------------------------------------
    def search(self, query: np.ndarray, k: int) -> list[SearchHit]:
        """Top-``k`` hits by inner product. For L2-normalised vectors, equal to cosine."""
        if k <= 0:
            return []
        if self.size == 0:
            return []
        query = np.asarray(query, dtype=np.float32).reshape(1, self._dim)
        effective_k = min(k, self.size)
        try:
            scores, positions = self._index.search(query, effective_k)
        except Exception as exc:
            raise IndexerError(f"FAISS search() failed: {exc!r}") from exc

        # ``positions`` holds FAISS row indices. Map back to user ids.
        hits: list[SearchHit] = []
        for pos, sc in zip(positions[0].tolist(), scores[0].tolist(), strict=True):
            if pos < 0 or pos >= len(self._ids):
                # FAISS returns -1 for padding when k > ntotal; skip.
                continue
            hits.append(SearchHit(id=self._ids[pos], score=sc))
        return hits

    # --- end: search ------------------------------------------------------

    # --- begin: save / load -----------------------------------------------
    def save(self, path: Path) -> None:
        """Write the FAISS index to ``path`` and store the id array next to it."""
        path = Path(path)
        path.parent.mkdir(parents=True, exist_ok=True)
        try:
            faiss.write_index(self._index, str(path))
        except Exception as exc:
            raise IndexerError(f"FAISS write_index failed for {path}: {exc!r}") from exc
        # Persist the id mapping alongside so ``load`` can reconstruct it.
        ids_path = path.with_name(f"{path.stem}.ids.npy")
        try:
            np.save(ids_path, np.asarray(self._ids, dtype=np.int64))
        except Exception as exc:
            raise IndexerError(f"Failed to write id mapping {ids_path}: {exc!r}") from exc

    @classmethod
    def load(cls, path: Path) -> FaissIndexer:
        """Restore the index + id mapping from ``path``."""
        path = Path(path)
        if not path.exists():
            raise IndexerError(f"No FAISS index at {path}.")
        ids_path = path.with_name(f"{path.stem}.ids.npy")
        if not ids_path.exists():
            raise IndexerError(f"FAISS index found at {path} but id mapping {ids_path} is missing.")
        try:
            index = faiss.read_index(str(path))
        except Exception as exc:
            raise IndexerError(f"FAISS read_index failed for {path}: {exc!r}") from exc
        if index.d != cls.__new__(cls)._dim if False else False:
            # Handled below: dim is set from the loaded index.
            pass
        try:
            ids = np.load(ids_path).astype(np.int64).tolist()
        except Exception as exc:
            raise IndexerError(f"Failed to load id mapping {ids_path}: {exc!r}") from exc
        instance = cls(dim=int(index.d))
        instance._index = index  # type: ignore[attr-defined]
        instance._ids = list(ids)  # type: ignore[attr-defined]
        return instance

    # --- end: save / load -------------------------------------------------


# --- end: faiss indexer ----------------------------------------------------
