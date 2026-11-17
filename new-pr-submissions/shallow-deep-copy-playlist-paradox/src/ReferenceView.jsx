/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ReferenceView: Visualizes how variable names connect to setlists and mood playlists.
 * Palette: Teal (#087F8C), Soft teal (#65B8B0), Pale aqua (#E8F6F3), Cream (#FFFDF7), Dark teal (#243B3A).
 */

import React, { useState } from "react";

export default function ReferenceView({
  methodId,
  compact = false,
  title = "How the Setlists Connect"
}) {
  const [showTextAlt, setShowTextAlt] = useState(false);

  const isAssignment = methodId === "live_sync" || methodId === "assignment";
  const isShallow = methodId === "remix_link" || methodId === "shallow_copy";
  const isDeep = methodId === "solo_press" || methodId === "deep_copy";
  const isIdentityComparison = methodId === "identity" || methodId === "identity_equality";

  return (
    <div className={`pp-reference-container ${compact ? "pp-reference-compact" : ""}`}>
      {!compact && (
        <div className="pp-ref-header-row">
          <div>
            <h4 className="pp-ref-title">{title}</h4>
            <p className="pp-ref-subtitle">
              Boxes show the lists in Python; arrows show which list each name points to.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowTextAlt(!showTextAlt)}
            className="pp-ref-toggle-btn"
            aria-expanded={showTextAlt}
          >
            {showTextAlt ? "Show Visual Diagram" : "Show Text Description"}
          </button>
        </div>
      )}

      {showTextAlt ? (
        <div className="pp-ref-text-view" role="region" aria-label="Text description of setlist connections">
          <ul className="pp-ref-text-list">
            <li>
              <strong>Variable Names:</strong> <code>master_setlist</code> and <code>remix_setlist</code>.
            </li>
            <li>
              <strong>Setlists:</strong>
              {isAssignment && (
                <span>
                  {" "}Both names point to <em>the very same list</em>. Zero copies are made.
                </span>
              )}
              {(isShallow || isDeep) && (
                <span>
                  {" "}<code>master_setlist</code> points to <strong>Setlist A</strong>. <code>remix_setlist</code> points to <strong>Setlist B</strong> (a separate new setlist).
                </span>
              )}
              {isIdentityComparison && (
                <span>
                  {" "}Two lists can have matching songs (<code>master_setlist == remix_setlist → True</code>), while still being two separate lists (<code>master_setlist is remix_setlist → False</code>).
                </span>
              )}
            </li>
            <li>
              <strong>Mood Playlists Inside:</strong>
              {isAssignment && (
                <span>
                  {" "}All mood playlists live inside the single shared setlist. Any change affects both names.
                </span>
              )}
              {isShallow && (
                <span>
                  {" "}Both Setlist A and Setlist B point to the <em>very same mood playlists</em>. Swapping a song changes both!
                </span>
              )}
              {isDeep && (
                <span>
                  {" "}Setlist A points to the original moods. Setlist B points to brand-new copies of every mood. Nothing is shared.
                </span>
              )}
            </li>
          </ul>
        </div>
      ) : (
        <div className="pp-ref-svg-wrap" role="img" aria-label={`Connection diagram for ${methodId}`}>
          <svg
            viewBox="0 0 800 280"
            className="pp-ref-svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <marker
                id="pp-arrow-darkteal"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#243B3A" />
              </marker>
              <marker
                id="pp-arrow-teal"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#087F8C" />
              </marker>
            </defs>

            {isIdentityComparison ? (
              <g transform="translate(12, 22)">
                <text x="0" y="6" fill="#243B3A" fontWeight="800" fontSize="14" letterSpacing="0.04em">NAMES</text>
                <text x="170" y="6" fill="#243B3A" fontWeight="800" fontSize="14" letterSpacing="0.04em">SETLISTS</text>
                <text x="434" y="6" fill="#243B3A" fontWeight="800" fontSize="14" letterSpacing="0.04em">RESULT</text>

                {/* Scenario 1: Very same list */}
                <rect x="0" y="22" width="142" height="36" rx="6" fill="#243B3A" />
                <text x="71" y="45" textAnchor="middle" fill="#FFFDF7" fontWeight="700" fontSize="14" fontFamily="monospace">
                  master_setlist
                </text>
                <rect x="0" y="66" width="142" height="36" rx="6" fill="#087F8C" />
                <text x="71" y="89" textAnchor="middle" fill="#FFFDF7" fontWeight="700" fontSize="14" fontFamily="monospace">
                  remix_setlist
                </text>

                <path d="M 142,40 L 166,56" stroke="#243B3A" strokeWidth="2" fill="none" markerEnd="url(#pp-arrow-darkteal)" />
                <path d="M 142,84 L 166,68" stroke="#087F8C" strokeWidth="2" fill="none" markerEnd="url(#pp-arrow-teal)" />

                <rect x="170" y="22" width="246" height="80" rx="8" fill="#FFFDF7" stroke="#243B3A" strokeWidth="2" />
                <text x="293" y="52" textAnchor="middle" fill="#243B3A" fontWeight="800" fontSize="15">
                  The Very Same List
                </text>
                <text x="293" y="78" textAnchor="middle" fill="#055E68" fontSize="14" fontWeight="700">
                  Intro: [&quot;Kesariya&quot;, &quot;Shayad&quot;]
                </text>

                <rect x="434" y="22" width="348" height="80" rx="8" fill="#E8F6F3" stroke="#243B3A" strokeWidth="1.5" />
                <text x="608" y="52" textAnchor="middle" fill="#243B3A" fontWeight="800" fontSize="14" fontFamily="monospace">
                  master_setlist == remix_setlist → True
                </text>
                <text x="608" y="80" textAnchor="middle" fill="#055E68" fontWeight="800" fontSize="14" fontFamily="monospace">
                  master_setlist is remix_setlist → True
                </text>

                {/* Scenario 2: Two Separate Lists with Same Songs */}
                <rect x="0" y="136" width="142" height="36" rx="6" fill="#243B3A" />
                <text x="71" y="159" textAnchor="middle" fill="#FFFDF7" fontWeight="700" fontSize="14" fontFamily="monospace">
                  master_setlist
                </text>
                <path d="M 142,154 L 166,154" stroke="#243B3A" strokeWidth="2" fill="none" markerEnd="url(#pp-arrow-darkteal)" />

                <rect x="170" y="124" width="246" height="56" rx="8" fill="#FFFDF7" stroke="#243B3A" strokeWidth="2" />
                <text x="293" y="147" textAnchor="middle" fill="#243B3A" fontWeight="700" fontSize="14">
                  Setlist #1: [&quot;Intro&quot;, &quot;Kesariya&quot;]
                </text>
                <text x="293" y="168" textAnchor="middle" fill="#055E68" fontSize="14">
                  First separate list
                </text>

                <rect x="0" y="198" width="142" height="36" rx="6" fill="#087F8C" />
                <text x="71" y="221" textAnchor="middle" fill="#FFFDF7" fontWeight="700" fontSize="14" fontFamily="monospace">
                  remix_setlist
                </text>
                <path d="M 142,216 L 166,216" stroke="#087F8C" strokeWidth="2" fill="none" markerEnd="url(#pp-arrow-teal)" />

                <rect x="170" y="190" width="246" height="56" rx="8" fill="#E8F6F3" stroke="#087F8C" strokeWidth="2" />
                <text x="293" y="213" textAnchor="middle" fill="#055E68" fontWeight="700" fontSize="14">
                  Setlist #2: [&quot;Intro&quot;, &quot;Kesariya&quot;]
                </text>
                <text x="293" y="234" textAnchor="middle" fill="#243B3A" fontSize="14">
                  Second separate list
                </text>

                <rect x="434" y="136" width="348" height="98" rx="8" fill="#FFFDF7" stroke="#087F8C" strokeWidth="1.5" />
                <text x="608" y="174" textAnchor="middle" fill="#243B3A" fontWeight="800" fontSize="14" fontFamily="monospace">
                  master_setlist == remix_setlist → True
                </text>
                <text x="608" y="210" textAnchor="middle" fill="#055E68" fontWeight="800" fontSize="14" fontFamily="monospace">
                  master_setlist is remix_setlist → False
                </text>
              </g>
            ) : (
              <g>
                {/* Column 1: Names */}
                <g transform="translate(12, 24)">
                  <text x="0" y="0" fill="#243B3A" fontWeight="800" fontSize="14" letterSpacing="0.04em">NAMES</text>

                  <rect x="0" y="22" width="144" height="42" rx="6" fill="#243B3A" />
                  <text x="72" y="48" textAnchor="middle" fill="#FFFDF7" fontWeight="700" fontSize="14" fontFamily="monospace">
                    master_setlist
                  </text>

                  <rect x="0" y="156" width="144" height="42" rx="6" fill="#087F8C" />
                  <text x="72" y="182" textAnchor="middle" fill="#FFFDF7" fontWeight="700" fontSize="14" fontFamily="monospace">
                    remix_setlist
                  </text>
                </g>

                {/* Column 2: Setlists */}
                <g transform="translate(188, 24)">
                  <text x="0" y="0" fill="#243B3A" fontWeight="800" fontSize="14" letterSpacing="0.04em">SETLISTS</text>

                  {isAssignment ? (
                    <g>
                      <rect x="0" y="68" width="162" height="88" rx="8" fill="#E8F6F3" stroke="#243B3A" strokeWidth="2" />
                      <text x="81" y="104" textAnchor="middle" fill="#243B3A" fontWeight="800" fontSize="15">
                        One Shared Setlist
                      </text>
                      <text x="81" y="130" textAnchor="middle" fill="#055E68" fontSize="14" fontWeight="700">
                        The very same list
                      </text>

                      <path d="M -32,43 L -4,94" stroke="#243B3A" strokeWidth="2" fill="none" markerEnd="url(#pp-arrow-darkteal)" />
                      <path d="M -32,177 L -4,132" stroke="#087F8C" strokeWidth="2" fill="none" markerEnd="url(#pp-arrow-teal)" />
                    </g>
                  ) : (
                    <g>
                      <rect x="0" y="18" width="162" height="56" rx="8" fill="#FFFDF7" stroke="#243B3A" strokeWidth="2" />
                      <text x="81" y="42" textAnchor="middle" fill="#243B3A" fontWeight="800" fontSize="15">
                        Setlist A
                      </text>
                      <text x="81" y="62" textAnchor="middle" fill="#243B3A" fontSize="14" fontFamily="monospace">
                        master_setlist
                      </text>
                      <path d="M -32,43 L -4,46" stroke="#243B3A" strokeWidth="2" fill="none" markerEnd="url(#pp-arrow-darkteal)" />

                      <rect x="0" y="150" width="162" height="56" rx="8" fill="#E8F6F3" stroke="#087F8C" strokeWidth="2" />
                      <text x="81" y="174" textAnchor="middle" fill="#055E68" fontWeight="800" fontSize="15">
                        Setlist B
                      </text>
                      <text x="81" y="194" textAnchor="middle" fill="#243B3A" fontSize="14" fontFamily="monospace">
                        remix_setlist
                      </text>
                      <path d="M -32,177 L -4,178" stroke="#087F8C" strokeWidth="2" fill="none" markerEnd="url(#pp-arrow-teal)" />
                    </g>
                  )}
                </g>

                {/* Column 3: Mood Playlists */}
                <g transform="translate(394, 24)">
                  <text x="0" y="0" fill="#243B3A" fontWeight="800" fontSize="14" letterSpacing="0.04em">
                    {isDeep ? "MOOD PLAYLISTS (SEPARATE COPIES)" : "MOOD PLAYLISTS (SHARED)"}
                  </text>

                  {isDeep ? (
                    <g>
                      <g transform="translate(0, 14)">
                        <rect x="0" y="0" width="390" height="30" rx="5" fill="#FFFDF7" stroke="#243B3A" strokeWidth="1.4" />
                        <text x="12" y="20" fill="#243B3A" fontSize="14" fontWeight="700">Intro ["Kesariya", "Shayad"]</text>

                        <rect x="0" y="35" width="390" height="30" rx="5" fill="#FFFDF7" stroke="#243B3A" strokeWidth="1.4" />
                        <text x="12" y="55" fill="#243B3A" fontSize="14" fontWeight="700">Chorus ["Ilahi", "Gallan Goodiyaan"]</text>

                        <rect x="0" y="70" width="390" height="30" rx="5" fill="#FFFDF7" stroke="#243B3A" strokeWidth="1.4" />
                        <text x="12" y="90" fill="#243B3A" fontSize="14" fontWeight="700">Outro ["Apna Bana Le", "Raabta"]</text>

                        <path d="M -44,24 L -5,15" stroke="#243B3A" strokeWidth="1.6" fill="none" markerEnd="url(#pp-arrow-darkteal)" />
                        <path d="M -44,32 L -5,50" stroke="#243B3A" strokeWidth="1.6" fill="none" markerEnd="url(#pp-arrow-darkteal)" />
                        <path d="M -44,40 L -5,85" stroke="#243B3A" strokeWidth="1.6" fill="none" markerEnd="url(#pp-arrow-darkteal)" />
                      </g>

                      <g transform="translate(0, 134)">
                        <rect x="0" y="0" width="390" height="30" rx="5" fill="#E8F6F3" stroke="#087F8C" strokeWidth="1.4" />
                        <text x="12" y="20" fill="#055E68" fontSize="14" fontWeight="700">Intro (Copy) ["Kesariya", "Shayad"]</text>

                        <rect x="0" y="35" width="390" height="30" rx="5" fill="#E8F6F3" stroke="#087F8C" strokeWidth="1.4" />
                        <text x="12" y="55" fill="#055E68" fontSize="14" fontWeight="700">Chorus (Copy) ["Ilahi", "Gallan Goodiyaan"]</text>

                        <rect x="0" y="70" width="390" height="30" rx="5" fill="#E8F6F3" stroke="#087F8C" strokeWidth="1.4" />
                        <text x="12" y="90" fill="#055E68" fontSize="14" fontWeight="700">Outro (Copy) ["Apna Bana Le", "Raabta"]</text>

                        <path d="M -44,36 L -5,15" stroke="#087F8C" strokeWidth="1.6" fill="none" markerEnd="url(#pp-arrow-teal)" />
                        <path d="M -44,44 L -5,50" stroke="#087F8C" strokeWidth="1.6" fill="none" markerEnd="url(#pp-arrow-teal)" />
                        <path d="M -44,52 L -5,85" stroke="#087F8C" strokeWidth="1.6" fill="none" markerEnd="url(#pp-arrow-teal)" />
                      </g>
                    </g>
                  ) : (
                    <g transform="translate(0, 24)">
                      <rect x="0" y="10" width="390" height="42" rx="6" fill="#FFFDF7" stroke="#243B3A" strokeWidth="1.6" />
                      <text x="14" y="36" fill="#243B3A" fontSize="14.5" fontWeight="700">Intro ["Kesariya", "Shayad"]</text>

                      <rect x="0" y="68" width="390" height="42" rx="6" fill="#FFFDF7" stroke="#243B3A" strokeWidth="1.6" />
                      <text x="14" y="94" fill="#243B3A" fontSize="14.5" fontWeight="700">Chorus ["Ilahi", "Gallan Goodiyaan"]</text>

                      <rect x="0" y="126" width="390" height="42" rx="6" fill="#FFFDF7" stroke="#243B3A" strokeWidth="1.6" />
                      <text x="14" y="152" fill="#243B3A" fontSize="14.5" fontWeight="700">Outro ["Apna Bana Le", "Raabta"]</text>

                      {isAssignment ? (
                        <g>
                          <path d="M -44,80 L -5,31" stroke="#243B3A" strokeWidth="1.6" fill="none" markerEnd="url(#pp-arrow-darkteal)" />
                          <path d="M -44,88 L -5,89" stroke="#243B3A" strokeWidth="1.6" fill="none" markerEnd="url(#pp-arrow-darkteal)" />
                          <path d="M -44,96 L -5,147" stroke="#243B3A" strokeWidth="1.6" fill="none" markerEnd="url(#pp-arrow-darkteal)" />
                        </g>
                      ) : (
                        <g>
                          <path d="M -44,14 L -5,28" stroke="#243B3A" strokeWidth="1.6" strokeDasharray="4 2" fill="none" markerEnd="url(#pp-arrow-darkteal)" />
                          <path d="M -44,22 L -5,86" stroke="#243B3A" strokeWidth="1.6" strokeDasharray="4 2" fill="none" markerEnd="url(#pp-arrow-darkteal)" />
                          <path d="M -44,30 L -5,144" stroke="#243B3A" strokeWidth="1.6" strokeDasharray="4 2" fill="none" markerEnd="url(#pp-arrow-darkteal)" />

                          <path d="M -44,146 L -5,36" stroke="#087F8C" strokeWidth="1.6" fill="none" markerEnd="url(#pp-arrow-teal)" />
                          <path d="M -44,154 L -5,94" stroke="#087F8C" strokeWidth="1.6" fill="none" markerEnd="url(#pp-arrow-teal)" />
                          <path d="M -44,162 L -5,152" stroke="#087F8C" strokeWidth="1.6" fill="none" markerEnd="url(#pp-arrow-teal)" />
                        </g>
                      )}
                    </g>
                  )}
                </g>
              </g>
            )}
          </svg>
        </div>
      )}
    </div>
  );
}
