/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * PlaylistView: Renders Master Setlist and Remix Setlist (or a single shared card in Round 1).
 * Palette:
 * - Master Setlist & its moods: Cream (#FFFDF7) with Dark teal (#243B3A) accents
 * - Remix Setlist & its moods: Soft teal tint (#D8EFEA) with Teal (#087F8C) accents
 * - Changed / Added items: Dark teal (#243B3A) with Cream (#FFFDF7) text & Soft teal (#65B8B0) accent
 */

import React from "react";
import { MoodArtwork } from "./Artwork.jsx";

export default function PlaylistView({
  masterData,
  afterpartyData,
  highlightChange = null,
  sharedMoods = [],
  sharedBadgeText = "🔗 same playlist in both",
  remixMoodBadgeText = null,
  topCaption = null,
  singleSharedCard = false,
  masterAnimState = null,
  remixAnimState = null,
  masterTitle = "Master Setlist",
  afterpartyTitle = "Remix Setlist",
  masterSub = "Original setlist (should stay untouched)",
  afterpartySub = "Remix setlist being changed",
  masterEmptySlotText = null,
  showStructureBadge = true,
  compact = false
}) {
  // Round 1: Single shared setlist card with two name tags joined by "="
  if (singleSharedCard) {
    const animClass =
      masterAnimState === "shake"
        ? "pp-card-shake"
        : remixAnimState === "pulse"
        ? "pp-card-remix-pulse"
        : "";
    return (
      <div className={`pp-playlist-comparison-wrapper ${compact ? "pp-playlist-compact" : ""}`}>
        <div className="pp-single-shared-wrap">
          <section
            className={`pp-collection-card pp-single-shared-card ${animClass}`}
            aria-labelledby="pp-heading-shared-single"
          >
            <header className="pp-single-shared-header">
              <div className="pp-single-names-stack">
                <div className="pp-single-names-row" id="pp-heading-shared-single">
                  <span className="pp-name-tag pp-name-tag-master">Master Setlist · Ahaana</span>
                  <span className="pp-shared-equals" aria-hidden="true">=</span>
                  <span className="pp-name-tag pp-name-tag-remix">Remix Setlist · Reyansh</span>
                </div>
              </div>

              <div className="pp-header-right-badges">
                {masterAnimState === "shake" && (
                  <span className="pp-changed-pill" aria-label="Master Setlist changed">
                    ● Changed
                  </span>
                )}
                {showStructureBadge && (
                  <div
                    className="pp-collection-meta-stat pp-stat-master"
                    aria-label={`Contains ${afterpartyData.length} moods`}
                  >
                    <span className="pp-meta-count">{afterpartyData.length}</span>
                    <span className="pp-meta-label">Moods</span>
                  </div>
                )}
              </div>
            </header>

            <div className="pp-collection-content" role="region" aria-label="Shared Setlist Moods">
              {afterpartyData.map((moodArr, mIdx) => {
                const moodName = moodArr[0];
                const songs = moodArr.slice(1);
                const isNewlyAddedMood =
                  highlightChange &&
                  highlightChange.type === "add_mood" &&
                  highlightChange.moodName === moodName;

                return (
                  <div
                    key={`shared-mood-${moodName}-${mIdx}`}
                    className={`pp-mood-block pp-mood-master ${isNewlyAddedMood ? "pp-mood-highlight-added" : ""}`}
                  >
                    <div className="pp-mood-header">
                      <div className="pp-mood-art-slot">
                        <MoodArtwork moodName={moodName} width={compact ? 30 : 36} height={compact ? 30 : 36} />
                      </div>
                      <div className="pp-mood-info">
                        <div className="pp-mood-label-row">
                          <h4 className="pp-mood-name">{moodName}</h4>
                          <span className="pp-mood-count-text">
                            · {songs.length} {songs.length === 1 ? "song" : "songs"}
                          </span>
                          {isNewlyAddedMood && (
                            <span className="pp-change-badge pp-badge-highlight" aria-label="Newly added mood">
                              + Added
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <ol className="pp-song-list">
                      {songs.map((song, sIdx) => {
                        const isChangedSong =
                          highlightChange &&
                          highlightChange.type === "replace_song" &&
                          highlightChange.targetMood === moodName &&
                          song === highlightChange.newSong;

                        return (
                          <li
                            key={`s-song-${mIdx}-${sIdx}`}
                            className={`pp-song-item ${isChangedSong ? "pp-song-highlight-changed pp-song-has-badge" : ""}`}
                          >
                            {isChangedSong && (
                              <span className="pp-change-badge pp-badge-highlight" aria-label="Changed song">
                                ● Changed!
                              </span>
                            )}
                            <div className="pp-song-main-row">
                              <span className="pp-song-num">{sIdx + 1}</span>
                              <span className="pp-song-title">{song}</span>
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    );
  }

  const masterAnimClass =
    masterAnimState === "shake"
      ? "pp-card-shake"
      : masterAnimState === "safe"
      ? "pp-card-safe-pulse"
      : "";
  const remixAnimClass = remixAnimState === "pulse" ? "pp-card-remix-pulse" : "";

  return (
    <div className={`pp-playlist-comparison-wrapper ${compact ? "pp-playlist-compact" : ""}`}>
      {topCaption && <p className="pp-playlist-top-caption">{topCaption}</p>}

      <div className="pp-playlist-comparison-grid pp-grid-two-col">
        {/* Master Setlist Card (Cream surface + Dark teal accents) */}
        <section
          className={`pp-collection-card pp-master-card ${masterAnimClass}`}
          aria-labelledby="pp-heading-master"
        >
          <header className="pp-collection-header">
            <div className="pp-collection-title-wrap">
              <span className="pp-collection-kicker pp-kicker-master">Original Setlist</span>
              <h3 id="pp-heading-master" className="pp-collection-title pp-title-equal">{masterTitle}</h3>
              {masterSub && <p className="pp-collection-sub">{masterSub}</p>}
            </div>
            <div className="pp-header-right-badges">
              {masterAnimState === "safe" && (
                <span className="pp-safe-tick-pill" aria-label="Master Setlist safe">
                  ✓ Safe
                </span>
              )}
              {masterAnimState === "shake" && (
                <span className="pp-changed-pill" aria-label="Master Setlist changed">
                  ● Changed
                </span>
              )}
              {showStructureBadge && (
                <div className="pp-collection-meta-stat pp-stat-master" aria-label={`Contains ${masterData.length} moods`}>
                  <span className="pp-meta-count">{masterData.length}</span>
                  <span className="pp-meta-label">Moods</span>
                </div>
              )}
            </div>
          </header>

          <div className="pp-collection-content" role="region" aria-label="Master Setlist Moods">
            {masterData.map((moodArr, mIdx) => {
              const moodName = moodArr[0];
              const songs = moodArr.slice(1);
              const isShared = sharedMoods.includes(moodName);

              return (
                <div
                  key={`master-mood-${moodName}-${mIdx}`}
                  className="pp-mood-block pp-mood-master"
                >
                  <div className="pp-mood-header">
                    <div className="pp-mood-art-slot">
                      <MoodArtwork moodName={moodName} width={compact ? 30 : 36} height={compact ? 30 : 36} />
                    </div>
                    <div className="pp-mood-info">
                      <div className="pp-mood-label-row">
                        <h4 className="pp-mood-name">{moodName}</h4>
                        <span className="pp-mood-count-text">· {songs.length} {songs.length === 1 ? "song" : "songs"}</span>
                        {isShared && (
                          <span className="pp-shared-mood-badge" title="Same shared mood playlist in both setlists">
                            {sharedBadgeText}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <ol className="pp-song-list">
                    {songs.map((song, sIdx) => {
                      const isChangedSong =
                        highlightChange &&
                        highlightChange.type === "replace_song" &&
                        highlightChange.targetMood === moodName &&
                        song === highlightChange.newSong;

                      return (
                        <li
                          key={`m-song-${mIdx}-${sIdx}`}
                          className={`pp-song-item ${isChangedSong ? "pp-song-highlight-changed pp-song-has-badge" : ""}`}
                        >
                          {isChangedSong && (
                            <span className="pp-change-badge pp-badge-highlight" aria-label="Changed song in Master">
                              ● Changed!
                            </span>
                          )}
                          <div className="pp-song-main-row">
                            <span className="pp-song-num">{sIdx + 1}</span>
                            <span className="pp-song-title">{song}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              );
            })}
            {masterEmptySlotText && (
              <div className="pp-mood-placeholder-slot" aria-label={masterEmptySlotText}>
                <span>{masterEmptySlotText}</span>
              </div>
            )}
          </div>
        </section>

        {/* Remix Setlist Card (Soft Teal-tinted surface + Teal accents) */}
        <section
          className={`pp-collection-card pp-afterparty-card ${remixAnimClass}`}
          aria-labelledby="pp-heading-afterparty"
        >
          <header className="pp-collection-header">
            <div className="pp-collection-title-wrap">
              <span className="pp-collection-kicker pp-kicker-remix">Working Setlist</span>
              <h3 id="pp-heading-afterparty" className="pp-collection-title pp-title-equal">{afterpartyTitle}</h3>
              <p className="pp-collection-sub">{afterpartySub}</p>
            </div>
            {showStructureBadge && (
              <div className="pp-collection-meta-stat pp-stat-remix" aria-label={`Contains ${afterpartyData.length} moods`}>
                <span className="pp-meta-count">{afterpartyData.length}</span>
                <span className="pp-meta-label">Moods</span>
              </div>
            )}
          </header>

          <div className="pp-collection-content" role="region" aria-label="Remix Setlist Moods">
            {afterpartyData.map((moodArr, mIdx) => {
              const moodName = moodArr[0];
              const songs = moodArr.slice(1);
              const isNewlyAddedMood =
                highlightChange &&
                highlightChange.type === "add_mood" &&
                highlightChange.moodName === moodName;
              const isShared = sharedMoods.includes(moodName);

              return (
                <div
                  key={`afterparty-mood-${moodName}-${mIdx}`}
                  className={`pp-mood-block pp-mood-remix ${isNewlyAddedMood ? "pp-mood-highlight-added" : ""}`}
                >
                  <div className="pp-mood-header">
                    <div className="pp-mood-art-slot">
                      <MoodArtwork moodName={moodName} width={compact ? 30 : 36} height={compact ? 30 : 36} />
                    </div>
                    <div className="pp-mood-info">
                      <div className="pp-mood-label-row">
                        <h4 className="pp-mood-name">{moodName}</h4>
                        <span className="pp-mood-count-text">· {songs.length} {songs.length === 1 ? "song" : "songs"}</span>
                        {isShared && (
                          <span className="pp-shared-mood-badge" title="Same shared mood playlist in both setlists">
                            {sharedBadgeText}
                          </span>
                        )}
                        {!isShared && !isNewlyAddedMood && remixMoodBadgeText && (
                          <span className="pp-own-copy-badge" title="Own separate copy of this mood">
                            {remixMoodBadgeText}
                          </span>
                        )}
                        {isNewlyAddedMood && (
                          <span className="pp-change-badge pp-badge-highlight" aria-label="Newly added mood">
                            + Added
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <ol className="pp-song-list">
                    {songs.map((song, sIdx) => {
                      const isChangedRemixSong =
                        highlightChange &&
                        highlightChange.type === "replace_song" &&
                        highlightChange.targetMood === moodName &&
                        song === highlightChange.newSong;

                      return (
                        <li
                          key={`a-song-${mIdx}-${sIdx}`}
                          className={`pp-song-item ${isChangedRemixSong ? "pp-song-highlight-changed pp-song-has-badge" : ""}`}
                        >
                          {isChangedRemixSong && (
                            <span className="pp-change-badge pp-badge-highlight" aria-label="Changed song">
                              ● Changed!
                            </span>
                          )}
                          <div className="pp-song-main-row">
                            <span className="pp-song-num">{sIdx + 1}</span>
                            <span className="pp-song-title">{song}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              );
            })}

          </div>
        </section>
      </div>
    </div>
  );
}
