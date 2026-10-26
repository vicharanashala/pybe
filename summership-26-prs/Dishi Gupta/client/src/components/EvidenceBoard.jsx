import React from 'react';
import { Code2 } from 'lucide-react';
import { PinDot } from './Motifs';
import { suspectImages } from '../lib/assets';

// Case evidence rendered as in-theme artifacts — torn witness notes pinned
// to a board, suspect dossier rows, and the investigator's grid — never raw
// JSON-looking lists.

export default function EvidenceBoard({ scenario }) {
  if (!scenario?.caseData) return null;
  const { caseData } = scenario;

  return (
    <div className="evidence-board">
      <h3 className="board-title">Evidence before you</h3>

      {caseData.witnessStatements && (
        <section className="witness-notes">
          {caseData.witnessStatements.map((statement) => (
            <blockquote className="torn-note" key={statement}>
              <PinDot />
              <p>{statement}</p>
            </blockquote>
          ))}
        </section>
      )}

      {caseData.suspectClaims && (
        <section className="dossier">
          <h4>What each person said</h4>
          <ul>
            {caseData.suspectClaims.map((claim) => (
              <li key={claim.suspect}>
                <span className="nameplate"><img src={suspectImages[claim.suspect.toLowerCase()]} alt={claim.suspect} width="28" height="28" />{claim.suspect}</span>
                <span className="claim-text">“{claim.claim}”</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {caseData.comparisonSets && (
        <section className="set-ledger">
          <h4>What people said · what we saw</h4>
          <div className="ledger-columns">
            <div className="ledger-col">
              <h5>Rooms we saw</h5>
              {(caseData.comparisonSets.witnessedRooms || []).map((room) => (
                <span className="chip witnessed" key={room}>{room}</span>
              ))}
            </div>
            <div className="ledger-col">
              <h5>Rooms they named</h5>
              {(caseData.comparisonSets.claimedRooms || []).map((room) => {
                const witnessed = (caseData.comparisonSets.witnessedRooms || []).includes(room);
                return <span className={witnessed ? 'chip witnessed' : 'chip unverified'} key={room}>{room}</span>;
              })}
            </div>
          </div>
          <p className="ledger-hint">Marked in wax: claimed rooms no witness can confirm.</p>
        </section>
      )}

      {caseData.grid && (
        <section className="investigator-grid">
          <h4>The room map</h4>
          <table>
            <tbody>
              {['suspects', 'rooms', 'weapons', 'times'].map((key) => (
                <tr key={key}>
                  <th>{key}</th>
                  <td>{(caseData.grid[key] || []).join('  ·  ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {Array.isArray(caseData.clues) && (
            <ul className="clue-cards">
              {caseData.clues.map((clue, index) => (
                <li key={clue}>
                  <PinDot />
                  <span className="clue-no">{String(index + 1).padStart(2, '0')}</span>
                  {clue}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {scenario.starterCode && (
        <section className="code-block scene-draft">
          <div><Code2 size={16} /> Draft recovered at the scene</div>
          <pre>{scenario.starterCode}</pre>
        </section>
      )}
    </div>
  );
}
