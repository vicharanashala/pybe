"""Topic query value object.

SRP-justification: a Topic is the only thing the user types. Keeping it
as a dedicated type (rather than passing strings around) means retrieval
/ generation can hang additional metadata (language hint, depth, etc.)
off it without changing their signatures.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

TopicDepth = Literal["intro", "standard", "deep"]


@dataclass(frozen=True)
class Topic:
    """A user-supplied topic query, with the metadata needed to ground it."""

    name: str
    language: str = "python"
    depth: TopicDepth = "standard"

    def __post_init__(self) -> None:
        if not self.name or not self.name.strip():
            raise ValueError("Topic.name must be non-empty.")
        # Length guard: prevents prompt-injection via 10-KB topic strings.
        if len(self.name) > 120:
            raise ValueError(f"Topic.name is too long ({len(self.name)} chars); max 120.")
        if self.depth not in ("intro", "standard", "deep"):
            raise ValueError(f"Topic.depth must be intro|standard|deep; got {self.depth}.")
