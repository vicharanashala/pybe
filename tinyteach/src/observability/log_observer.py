"""Pipeline-event observer contract.

Observer-justification (GoF): the ingestion / retrieval / generation
pipelines must NOT call the logger directly for every event — that would
couple business logic to a logging implementation. Instead they emit
``PipelineEvent`` objects; concrete observers (LogObserver in Phase 1,
a Streamlit progress observer in Phase 6, etc.) react to them.

Phase 0 ships the abstract contract + a no-op default implementation.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any


@dataclass(frozen=True)
class PipelineEvent:
    """Immutable record of one thing that happened in a pipeline."""

    stage: str  # e.g. "ingestion.parse", "retrieval.search"
    name: str  # short event name e.g. "page_parsed"
    payload: dict[str, Any] = field(default_factory=dict)
    ts: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    def to_dict(self) -> dict[str, Any]:
        return {
            "stage": self.stage,
            "name": self.name,
            "payload": dict(self.payload),
            "ts": self.ts.isoformat(timespec="milliseconds"),
        }


class PipelineObserver(ABC):
    """Reactor interface — one method, called for every event."""

    @abstractmethod
    def notify(self, event: PipelineEvent) -> None:
        """React to ``event``. Must not raise into the producer."""


class NullObserver(PipelineObserver):
    """Default no-op observer — used when no one subscribes."""

    def notify(self, event: PipelineEvent) -> None:
        # Explicit no-op; documents intent and gives tests a safe stub.
        return None
