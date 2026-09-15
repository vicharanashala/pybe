import React from 'react';

export default function SceneVisualFrame({ frameId, defaultImage, character }) {
  return (
    <div className="relative w-full h-full min-h-[340px] bg-stone-900 overflow-hidden flex items-center justify-center">
      {/* Background image fallback */}
      <img
        src={defaultImage || '/images/auditorium_seats.jpg'}
        alt="Scene illustration frame"
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 transform hover:scale-105"
      />
      
      {/* Cinematic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent"></div>

      {/* Frame 1: Phone Notification */}
      {frameId === 'phone_close_up' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-stone-900 border-2 border-amber-500/60 p-6 rounded-3xl max-w-sm text-center shadow-2xl space-y-3">
            <div className="text-3xl">📩</div>
            <div className="text-xs font-mono text-amber-400 uppercase font-bold">FEST COMMITTEE NOTICE</div>
            <div className="text-stone-100 font-extrabold text-base leading-snug">
              "Volunteers must reach the main auditorium across town before 6:30 PM sharp!"
            </div>
            <div className="text-[10px] text-red-400 font-mono font-bold">⏰ TIME REMAINING: URGENT!</div>
          </div>
        </div>
      )}

      {/* Frame 2: Metro Route Map */}
      {frameId === 'metro_route_map' && (
        <div className="absolute inset-0 bg-blue-950/80 backdrop-blur-sm p-6 flex flex-col justify-between animate-fade-in">
          <div className="text-xs font-mono text-blue-300 font-bold flex items-center justify-between">
            <span>HYDERABAD METRO BLUE LINE ROUTE MAP</span>
            <span className="text-amber-400">AMEERPET ➔ RAIDURG</span>
          </div>
          <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-mono">
            {['Ameerpet', 'Madhura Nagar', 'Yusufguda', 'Road No 5', 'Check Post', 'Peddamma Gudi', 'Madhapur', 'Durgam Cheruvu', 'HITEC City', 'Raidurg'].map((st, i) => (
              <div key={st} className={`p-2 rounded-xl border ${st === 'Raidurg' ? 'bg-amber-500 text-black border-amber-300 font-extrabold' : 'bg-blue-900/60 text-blue-200 border-blue-700/50'}`}>
                {i + 1}. {st}
              </div>
            ))}
          </div>
          <div className="text-[11px] text-stone-300 italic text-center">9 Intermediate stops before terminal destination Raidurg</div>
        </div>
      )}

      {/* Frame 3: Canteen Menu Queue */}
      {frameId === 'canteen_menu_board' && (
        <div className="absolute inset-0 bg-amber-950/80 backdrop-blur-sm p-6 flex flex-col justify-between animate-fade-in">
          <div className="text-xs font-mono text-amber-300 font-bold">🍲 CANTEEN PENDING ORDERS QUEUE</div>
          <div className="grid grid-cols-5 gap-2 text-center">
            {[
              { name: 'Samosa', icon: '🥟' },
              { name: 'Puff', icon: '🥐' },
              { name: 'Dosa', icon: '🥞' },
              { name: 'Juice', icon: '🧃' },
              { name: 'Biryani', icon: '🍲' }
            ].map((ord, idx) => (
              <div key={ord.name} className="p-3 bg-stone-900/90 rounded-2xl border border-amber-500/40 space-y-1">
                <div className="text-2xl">{ord.icon}</div>
                <div className="text-xs font-bold text-amber-200">{ord.name}</div>
                <div className="text-[9px] font-mono text-stone-400">Order #{idx + 1}</div>
              </div>
            ))}
          </div>
          <div className="text-xs font-mono text-stone-300 text-center">Worker prepares each order in sequential loop</div>
        </div>
      )}

      {/* Frame 4: Auditorium Exterior Entrance */}
      {frameId === 'auditorium_exterior' && (
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/80 to-indigo-950/80 p-6 flex flex-col justify-between animate-fade-in">
          <div className="flex items-center justify-between text-xs font-mono text-amber-300">
            <span>🌆 HYDERABAD COLLEGE AUDITORIUM EXTERIOR</span>
            <span className="bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">CULTURAL FEST '26 BANNERS</span>
          </div>
          <div className="text-center space-y-2 max-w-md mx-auto">
            <div className="text-4xl">🏛️</div>
            <div className="text-xl font-extrabold text-amber-200">MAIN AUDITORIUM COMPLEX</div>
            <div className="text-xs text-stone-300">Students and volunteers arriving under evening lights</div>
          </div>
          <div className="text-[11px] font-mono text-stone-400 text-center">Event starts soon at 6:30 PM sharp</div>
        </div>
      )}

      {/* Frame 5: Auditorium Entrance & Coordinator */}
      {frameId === 'auditorium_entrance' && (
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/90 to-stone-950 p-6 flex flex-col justify-between animate-fade-in">
          <div className="text-xs font-mono text-amber-300">🚪 INSIDE AUDITORIUM FOYER</div>
          <div className="bg-stone-900/90 border border-amber-500/40 p-4 rounded-2xl max-w-md mx-auto space-y-2 text-center shadow-xl">
            <div className="text-3xl">📋</div>
            <div className="text-sm font-bold text-amber-200">EVENT COORDINATOR EMERGENCY</div>
            <p className="text-xs text-stone-300">"The seating layout hasn't been verified! We need every seat checked before guests arrive!"</p>
          </div>
          <div className="text-[11px] font-mono text-amber-400 text-center">30 Guest seats total in main hall</div>
        </div>
      )}

      {/* Frame 6: Full Wide Auditorium Shot (Stage + Screen + 5 Rows x 6 Seats) */}
      {frameId === 'auditorium_wide_shot' && (
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/90 via-stone-900/90 to-stone-950 p-6 flex flex-col justify-between animate-fade-in">
          <div className="flex items-center justify-between text-xs font-mono text-amber-300">
            <span>🎭 FULL AUDITORIUM CAMERA SHOT</span>
            <span className="bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">5 ROWS × 6 SEATS = 30 SEATS</span>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-2">
            {/* Stage */}
            <div className="w-full max-w-md h-10 bg-gradient-to-r from-amber-600/40 via-amber-500/50 to-amber-600/40 border border-amber-400/60 rounded-xl flex items-center justify-center text-xs font-extrabold text-amber-100 shadow-lg">
              ✨ MAIN FEST STAGE, CURTAINS & PODIUM
            </div>

            {/* 5 Rows x 6 Seats Matrix */}
            <div className="w-full max-w-md space-y-1.5 bg-black/60 p-3 rounded-2xl border border-stone-800">
              {[1, 2, 3, 4, 5].map(r => (
                <div key={r} className="flex items-center justify-between gap-1 text-[10px] font-mono">
                  <span className="text-amber-400 w-12 text-right font-bold">Row {r}:</span>
                  <div className="grid grid-cols-6 gap-1.5 flex-1">
                    {[1, 2, 3, 4, 5, 6].map(s => (
                      <div key={s} className="h-6 rounded bg-red-900/80 border border-red-600/60 flex items-center justify-center font-mono text-[9px] text-white">
                        S{s}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] font-mono text-stone-400 text-center">Auditorium seats arranged in a 2D Grid structure</div>
        </div>
      )}

      {/* Frame 7: Bad Plan — Random Checking Chaos */}
      {frameId === 'auditorium_random_checking' && (
        <div className="absolute inset-0 bg-red-950/80 backdrop-blur-sm p-6 flex flex-col justify-between animate-fade-in">
          <div className="text-xs font-mono text-red-300 font-bold">⚠️ RANDOM CHECKING CHAOS</div>
          <div className="bg-stone-900/90 border border-red-500/40 p-4 rounded-2xl max-w-md mx-auto text-center space-y-2 shadow-xl">
            <div className="text-3xl">🌀</div>
            <div className="text-xs font-mono text-red-400 font-bold">THE BAD PLAN</div>
            <div className="text-xs text-stone-200 leading-relaxed">
              Rahul & Ananya checking random seats in random rows... Duplicate checking & skipped seats inevitable!
            </div>
          </div>
          <div className="text-[11px] font-mono text-stone-300 text-center">Random checking creates missing/repeated seat errors!</div>
        </div>
      )}

      {/* Frame 8: Row 1 Highlighted */}
      {frameId === 'auditorium_row1_highlighted' && (
        <div className="absolute inset-0 bg-stone-950/90 p-6 flex flex-col justify-between animate-fade-in">
          <div className="text-xs font-mono text-amber-300 font-bold">📍 SYSTEMATIC APPROACH: ROW 1 ACTIVE</div>
          <div className="w-full max-w-md mx-auto bg-amber-950/60 border-2 border-amber-500 p-4 rounded-2xl space-y-2">
            <div className="text-xs font-mono text-amber-300 font-extrabold flex items-center justify-between">
              <span>ROW 1 (Seat 1 to 6)</span>
              <span className="bg-amber-500 text-black px-2 py-0.5 rounded text-[10px]">ACTIVE</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map(s => (
                <div key={s} className="h-8 rounded-lg bg-amber-500/20 border border-amber-400 text-amber-200 font-mono text-xs flex items-center justify-center font-bold">
                  S{s}
                </div>
              ))}
            </div>
          </div>
          <div className="text-[11px] font-mono text-stone-300 text-center">Checking seats sequentially from Seat 1 to Seat 6</div>
        </div>
      )}

      {/* Frame 9: Seat 4 Bag Obstacle */}
      {frameId === 'auditorium_seat_bag' && (
        <div className="absolute inset-0 bg-amber-950/80 backdrop-blur-sm p-6 flex flex-col justify-between animate-fade-in">
          <div className="text-xs font-mono text-amber-300 font-bold">🎒 OBSTACLE DETECTED AT ROW 1 SEAT 4</div>
          <div className="bg-stone-900/90 border border-amber-500 p-4 rounded-2xl max-w-sm mx-auto text-center space-y-2 shadow-xl">
            <div className="text-4xl">🎒</div>
            <div className="text-xs font-bold text-amber-300">Someone left a heavy backpack on Seat 4!</div>
            <p className="text-[11px] text-stone-300">Lakshmi removes the bag so the seat is ready for guests.</p>
          </div>
          <div className="text-[11px] font-mono text-emerald-400 text-center">Seat 4 cleared & checked!</div>
        </div>
      )}

      {/* Frame 10: Row 1 Completed */}
      {frameId === 'auditorium_row1_completed' && (
        <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-sm p-6 flex flex-col justify-between animate-fade-in">
          <div className="text-xs font-mono text-emerald-300 font-bold">✅ ROW 1 COMPLETE</div>
          <div className="w-full max-w-md mx-auto bg-emerald-900/40 border border-emerald-500 p-4 rounded-2xl text-center space-y-2">
            <div className="text-2xl">🎉</div>
            <div className="text-xs font-mono text-emerald-300 font-extrabold">ROW 1 (Seats 1..6) ALL CHECKED</div>
            <div className="text-[11px] text-stone-300">Rows 2, 3, 4, 5 remaining!</div>
          </div>
          <div className="text-[11px] font-mono text-emerald-400 text-center">Outer loop advances to next Row</div>
        </div>
      )}

      {/* Frame 11: Row 2 Highlighted */}
      {frameId === 'auditorium_row2_highlighted' && (
        <div className="absolute inset-0 bg-stone-950/90 p-6 flex flex-col justify-between animate-fade-in">
          <div className="text-xs font-mono text-amber-300 font-bold">📍 ROW 2 ACTIVE</div>
          <div className="w-full max-w-md mx-auto bg-amber-950/60 border-2 border-amber-500 p-4 rounded-2xl space-y-2">
            <div className="text-xs font-mono text-amber-300 font-extrabold flex items-center justify-between">
              <span>ROW 2 (Seat 1 to 6)</span>
              <span className="bg-amber-500 text-black px-2 py-0.5 rounded text-[10px]">REPEATING SEAT CHECK</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map(s => (
                <div key={s} className="h-8 rounded-lg bg-amber-500/20 border border-amber-400 text-amber-200 font-mono text-xs flex items-center justify-center font-bold">
                  S{s}
                </div>
              ))}
            </div>
          </div>
          <div className="text-[11px] font-mono text-stone-300 text-center">Starting seat check over again for Row 2</div>
        </div>
      )}

      {/* Frame 12: Pattern Comparison (Row 1 & Row 2 Repetition) */}
      {frameId === 'auditorium_pattern_comparison' && (
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900 to-indigo-950 p-6 flex flex-col justify-between animate-fade-in">
          <div className="text-xs font-mono text-amber-300 font-bold">🔄 REPETITION INSIDE REPETITION</div>
          <div className="w-full max-w-md mx-auto space-y-2">
            <div className="bg-stone-900/90 p-3 rounded-xl border border-stone-700 text-xs font-mono flex items-center justify-between">
              <span className="text-stone-300">ROW 1:</span>
              <span className="text-emerald-400 font-bold">Seat 1 ➔ Seat 2 ➔ Seat 3 ➔ Seat 4 ➔ Seat 5 ➔ Seat 6</span>
            </div>
            <div className="text-center text-amber-400 text-xs font-bold">⬇ REPEAT ENTIRE SEAT LOOP FOR NEXT ROW</div>
            <div className="bg-amber-950/80 p-3 rounded-xl border border-amber-500 text-xs font-mono flex items-center justify-between">
              <span className="text-amber-300">ROW 2:</span>
              <span className="text-amber-400 font-bold">Seat 1 ➔ Seat 2 ➔ Seat 3 ➔ Seat 4 ➔ Seat 5 ➔ Seat 6</span>
            </div>
          </div>
          <div className="text-[11px] font-mono text-amber-300 text-center">Smaller seat loop running inside bigger row loop</div>
        </div>
      )}

      {/* Frame 13: Nested Loop Visual Diagram */}
      {frameId === 'auditorium_nested_diagram' && (
        <div className="absolute inset-0 bg-stone-950 p-6 flex flex-col justify-between animate-fade-in">
          <div className="text-xs font-mono text-amber-400 font-bold">🔁 NESTED LOOP STRUCTURE</div>
          <div className="bg-black/80 border-2 border-amber-500 p-5 rounded-2xl max-w-md mx-auto text-center space-y-2 font-mono text-xs text-amber-300 shadow-2xl">
            <div className="bg-amber-500 text-black p-2 rounded font-extrabold">OUTER LOOP: FOR EACH ROW (1 to 5)</div>
            <div className="text-xl">↓</div>
            <div className="bg-emerald-950 border border-emerald-500 p-2 rounded text-emerald-300 font-bold">
              INNER LOOP: CHECK EACH SEAT (1 to 6)
            </div>
            <div className="text-xl">↓</div>
            <div className="bg-stone-900 p-2 rounded text-stone-300">ADVANCE TO NEXT ROW</div>
          </div>
          <div className="text-[11px] font-mono text-stone-400 text-center">Loop running inside another loop</div>
        </div>
      )}

      {/* Frame 14: Concept Reveal Banner */}
      {frameId === 'auditorium_nested_concept' && (
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-950 via-stone-900 to-indigo-950 p-6 flex flex-col justify-between animate-fade-in">
          <div className="text-xs font-mono text-amber-400 font-bold">🐍 PYTHON CONCEPT REVEAL</div>
          <div className="bg-amber-500 text-black p-6 rounded-3xl max-w-md mx-auto text-center space-y-2 shadow-2xl border-2 border-amber-300">
            <div className="text-3xl">🔄</div>
            <h2 className="text-2xl font-extrabold">NESTED LOOPS</h2>
            <div className="text-xs font-bold font-mono">A loop running inside another loop.</div>
          </div>
          <div className="text-[11px] font-mono text-amber-300 text-center">Used for processing 2D grid matrix structures</div>
        </div>
      )}
    </div>
  );
}
