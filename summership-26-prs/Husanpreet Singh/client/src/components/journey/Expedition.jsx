import React, { useMemo, useState } from 'react';
import RaidAct from './RaidAct';
import BridgeAct from './BridgeAct';
import ArchipelagoAct from './ArchipelagoAct';
import { ISLAND_SETS, RAID_ISLANDS } from '../../data/story';
import { rngFrom } from './scrollUtils';

/* =========================================================
   Act I (if / else) → Act II (the hinge) → Act III (if / elif / else).

   Act I's outcome decides the other two:
     caught  → Jack talks, and the ladder hunts the buried gold
     escaped → fresh intelligence, and the ladder hunts Jack

   Only one of those ever runs. The outcome is derived from a
   seed rather than loose randomness, so scrubbing the scroll
   backwards never rewrites what already happened — only the
   explicit re-run buttons do.
   ========================================================= */

export default function Expedition({ onActive }) {
  const [nonce, setNonce] = useState(0);
  const [flip, setFlip] = useState(0);

  const { caught, target, islands, raidIsland } = useMemo(() => {
    const rand = rngFrom(nonce * 104729 + 1013);
    /* Act I's button deliberately flips the branch — a learner who presses
       "re-run" wants to watch the road not taken, not roll dice again. */
    const isCaught = (rand() > 0.5) !== (flip % 2 === 1);

    /* On the first pass the ladder always finds something, so the payoff lands
       before a learner is asked to sit through a miss. */
    let found;
    if (nonce === 0) {
      found = 3;
    } else {
      const r = rand();
      found = r < 0.18 ? -1 : Math.floor(rand() * ISLAND_SETS[0].length);
    }

    const set = nonce % ISLAND_SETS.length;
    return {
      caught: isCaught,
      target: found,
      islands: ISLAND_SETS[set],
      raidIsland: RAID_ISLANDS[set],
    };
  }, [nonce, flip]);

  return (
    <div className="jr-expedition">
      <RaidAct
        expedition={nonce}
        islandName={raidIsland}
        caught={caught}
        onReroll={() => setFlip((f) => f + 1)}
        onActive={onActive}
      />
      <BridgeAct caught={caught} islandCount={islands.length} onActive={onActive} />
      <ArchipelagoAct
        expedition={nonce}
        islands={islands}
        target={target}
        caught={caught}
        onReroll={() => setNonce((n) => n + 1)}
        onActive={onActive}
      />
    </div>
  );
}
