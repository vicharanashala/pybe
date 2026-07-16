import { useState, useEffect, useRef } from 'react';
import { UserProgress } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Trophy, 
  Send, 
  Users, 
  User, 
  Sparkles, 
  Clock, 
  ArrowLeft, 
  AlertCircle,
  ThumbsUp,
  Tv,
  Crown,
  Volume2,
  Sword
} from 'lucide-react';

interface LiveQuizArenaProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  selectedScenario: string;
}

interface PlayerState {
  id: string;
  name: string;
  avatar: string;
  team?: 'red' | 'blue';
  score: number;
  isBot?: boolean;
  hasAnswered?: boolean;
}

interface FloatingBubble {
  id: string;
  playerId: string;
  message: string;
}

export default function LiveQuizArena({ progress, onUpdateProgress, selectedScenario }: LiveQuizArenaProps) {
  // Navigation states
  const [gameState, setGameState] = useState<'setup' | 'lobby' | 'playing' | 'ended'>('setup');
  const [mode, setMode] = useState<'1v1' | 'team'>('1v1');
  const [selectedTeam, setSelectedTeam] = useState<'red' | 'blue'>('red');
  
  // Lobby/Match states
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [lobbyCountdown, setLobbyCountdown] = useState<number | null>(null);
  const [waitingMessage, setWaitingMessage] = useState<string>('');
  
  // Game states
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(1);
  const [timer, setTimer] = useState<number>(20);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);
  const [roundFeedback, setRoundFeedback] = useState<{ isCorrect: boolean; points: number; correctAnswer: string } | null>(null);
  const [roundCompleted, setRoundCompleted] = useState<boolean>(false);
  const [roundResults, setRoundResults] = useState<any[]>([]);
  const [explanation, setExplanation] = useState<string>('');
  const [correctAnswer, setCorrectAnswer] = useState<string>('');
  
  // Final states
  const [standings, setStandings] = useState<any[]>([]);
  const [xpGained, setXpGained] = useState<number>(0);
  const [incorrectConcepts, setIncorrectConcepts] = useState<string[]>([]);
  
  // Chat / Reactions
  const [chatMessage, setChatMessage] = useState<string>('');
  const [bubbles, setBubbles] = useState<FloatingBubble[]>([]);
  
  // Connection states
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [errorMsg, setErrorMsg] = useState<string>('');
  
  const wsRef = useRef<WebSocket | null>(null);
  const questionStartTimeRef = useRef<number>(0);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleJoinArena = () => {
    setConnectionStatus('connecting');
    setErrorMsg('');
    
    // Connect to WebSocket server on the same host/port
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/quiz-arena`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    
    ws.onopen = () => {
      setConnectionStatus('connected');
      setGameState('lobby');
      
      // Retrieve auth token from local storage
      const token = localStorage.getItem('pyverse_token') || '';
      
      // Join lobby message
      const joinMsg = {
        type: 'join_lobby',
        name: progress.streak > 0 ? `Coder ${progress.xp} XP` : 'Guest Learner',
        avatar: progress.streak > 0 ? '🔥' : '🎓',
        mode: mode,
        team: mode === 'team' ? selectedTeam : undefined,
        token: token
      };
      ws.send(JSON.stringify(joinMsg));
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'waiting_in_lobby':
            setWaitingMessage(data.message);
            break;
            
          case 'lobby_state':
            setPlayers(data.players);
            setLobbyCountdown(data.countdown);
            setWaitingMessage('');
            break;
            
          case 'match_start':
            setPlayers(data.players);
            setTotalQuestions(data.totalQuestions);
            setGameState('playing');
            setRoundCompleted(false);
            setRoundFeedback(null);
            setSelectedOption(null);
            setAnswered(false);
            break;
            
          case 'question_push':
            setCurrentQuestion(data.question);
            setQuestionIndex(data.questionIndex);
            setTimer(data.timeLeft);
            setSelectedOption(null);
            setAnswered(false);
            setRoundCompleted(false);
            setRoundFeedback(null);
            setExplanation('');
            setCorrectAnswer('');
            questionStartTimeRef.current = Date.now();
            break;
            
          case 'timer_tick':
            setTimer(data.timeLeft);
            break;
            
          case 'player_answered':
            // Can be used to show a little "Answered!" indicator next to the player's avatar
            setPlayers(prev => prev.map(p => {
              if (p.id === data.playerId) {
                return { ...p, hasAnswered: true };
              }
              return p;
            }));
            break;
            
          case 'answer_acknowledged':
            setRoundFeedback({
              isCorrect: data.isCorrect,
              points: data.points,
              correctAnswer: data.correctAnswer
            });
            break;
            
          case 'round_result':
            setRoundCompleted(true);
            setExplanation(data.explanation);
            setCorrectAnswer(data.correctAnswer);
            
            // Record if user got it wrong for recommendation profiling
            if (currentQuestion) {
              const myResult = data.players.find((p: any) => p.id === wsRef.current?.url); // Wait, match current player
              // Better: just check roundFeedback or data.players list matches my ID
            }
            
            // Update list of players with new scores
            setPlayers(prev => prev.map(p => {
              const match = data.players.find((dp: any) => dp.id === p.id);
              if (match) {
                return { ...p, score: match.score, hasAnswered: false };
              }
              return { ...p, hasAnswered: false };
            }));
            
            setRoundResults(data.players);
            break;
            
          case 'chat_broadcast': {
            // Trigger floating bubble
            const bubbleId = Math.random().toString(36).substring(2, 9);
            const newBubble: FloatingBubble = {
              id: bubbleId,
              playerId: data.playerId,
              message: data.message
            };
            setBubbles(prev => [...prev, newBubble]);
            // Remove bubble after 3 seconds
            setTimeout(() => {
              setBubbles(prev => prev.filter(b => b.id !== bubbleId));
            }, 3000);
            break;
          }
            
          case 'player_disconnected':
            // Player disconnected alert
            break;
            
          case 'quiz_end':
            setStandings(data.standings);
            setGameState('ended');
            
            // Calculate my award
            // Find myself in standings
            // We can match based on local ID or name
            // Let's see if we won
            const myIndex = data.standings.findIndex((s: any) => !s.isBot && s.name.includes(progress.xp.toString()) || s.id.startsWith("guest"));
            const amIWinner = myIndex === 0;
            const pointsGained = amIWinner ? 50 : 30;
            setXpGained(pointsGained);
            
            // Update local progress
            onUpdateProgress(prev => ({
              ...prev,
              xp: prev.xp + pointsGained,
              streak: prev.streak
            }));
            
            break;
        }
      } catch (err) {
        console.error("Failed to parse websocket message:", err);
      }
    };
    
    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      setErrorMsg("Failed to connect to the Live Quiz Arena. Make sure the server is running.");
      setConnectionStatus('disconnected');
    };
    
    ws.onclose = () => {
      setConnectionStatus('disconnected');
      if (gameState !== 'ended' && gameState !== 'setup') {
        setGameState('setup');
        setErrorMsg("Connection to the Quiz Arena lost.");
      }
    };
  };

  const handleSelectOption = (option: string) => {
    if (answered || roundCompleted) return;
    setSelectedOption(option);
  };

  const handleSubmitAnswer = () => {
    if (answered || !selectedOption || !wsRef.current) return;
    setAnswered(true);
    const timeTakenMs = Date.now() - questionStartTimeRef.current;
    
    wsRef.current.send(JSON.stringify({
      type: 'submit_answer',
      answer: selectedOption,
      timeTakenMs: timeTakenMs
    }));

    // Record incorrect concepts locally for recommendations
    if (currentQuestion && selectedOption !== currentQuestion.correctAnswer) {
      if (currentQuestion.correctAnswer) { // Will get verified on round result
        // We evaluate accuracy in round_result or end. If incorrect, add to concepts
        if (!incorrectConcepts.includes(currentQuestion.concept)) {
          setIncorrectConcepts(prev => [...prev, currentQuestion.concept]);
        }
      }
    }
  };

  const handleSendReaction = (emoji: string) => {
    if (!wsRef.current || connectionStatus !== 'connected') return;
    wsRef.current.send(JSON.stringify({
      type: 'chat_message',
      message: emoji
    }));
  };

  const handleLeaveArena = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    setGameState('setup');
    setPlayers([]);
    setLobbyCountdown(null);
    setCurrentQuestion(null);
    setRoundFeedback(null);
    setIncorrectConcepts([]);
  };

  // Render components
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between bg-white/80 p-4 rounded-2xl border border-sky-100/50 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl text-white shadow-md">
            <Sword className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl text-slate-800 tracking-tight">Live Quiz Arena</h1>
            <p className="text-xs font-semibold text-slate-500">Real-Time Python Matches</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-xs font-bold shadow-inner">
            <span className="text-slate-500">Status:</span>
            <span className={`inline-flex items-center gap-1.5 ${
              connectionStatus === 'connected' ? 'text-emerald-600' :
              connectionStatus === 'connecting' ? 'text-amber-500' : 'text-slate-400'
            }`}>
              <span className={`h-2.5 w-2.5 rounded-full ${
                connectionStatus === 'connected' ? 'bg-emerald-500 animate-pulse' :
                connectionStatus === 'connecting' ? 'bg-amber-400 animate-bounce' : 'bg-slate-300'
              }`} />
              {connectionStatus}
            </span>
          </div>
          {gameState !== 'setup' && (
            <button 
              onClick={handleLeaveArena}
              className="px-3.5 py-1.5 text-xs font-extrabold bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl border border-slate-200 hover:border-rose-100 transition cursor-pointer"
            >
              Exit Arena
            </button>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold">
          <AlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* SETUP / ENTRY SCREEN */}
      {gameState === 'setup' && (
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-12 text-white shadow-xl relative overflow-hidden border border-indigo-950">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="relative max-w-2xl mx-auto text-center space-y-8 py-4">
            <div className="inline-flex p-3 bg-indigo-500/15 rounded-2xl border border-indigo-500/20 text-indigo-400 animate-bounce mb-2">
              <Sparkles className="h-8 w-8" />
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-none bg-gradient-to-r from-blue-400 via-indigo-200 to-purple-400 bg-clip-text text-transparent">
                Python Dual-Arena
              </h2>
              <p className="text-slate-300 font-medium text-sm md:text-base max-w-md mx-auto">
                Test your Python variables, logic, and loops speed in real-time battles against other students or our trained ByteBots.
              </p>
            </div>

            {/* Game mode selector */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <button
                onClick={() => setMode('1v1')}
                className={`p-4 rounded-2xl border-2 transition text-left space-y-2 cursor-pointer ${
                  mode === '1v1'
                    ? 'border-indigo-500 bg-indigo-500/10 text-white'
                    : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800/50 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <User className="h-5 w-5" />
                  <span className="text-[10px] font-black uppercase bg-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-300">Active</span>
                </div>
                <h3 className="font-bold text-sm">1v1 Duel</h3>
                <p className="text-[11px] text-slate-400 leading-tight">Head-to-head speed battle with players or bots.</p>
              </button>

              <button
                onClick={() => setMode('team')}
                className={`p-4 rounded-2xl border-2 transition text-left space-y-2 cursor-pointer ${
                  mode === 'team'
                    ? 'border-indigo-500 bg-indigo-500/10 text-white'
                    : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800/50 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Users className="h-5 w-5" />
                  <span className="text-[10px] font-black uppercase bg-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-300">Coop</span>
                </div>
                <h3 className="font-bold text-sm">Team Clash</h3>
                <p className="text-[11px] text-slate-400 leading-tight">Cooperative Red vs. Blue group team challenge.</p>
              </button>
            </div>

            {/* Team selector if Team mode */}
            {mode === 'team' && (
              <div className="space-y-3 max-w-xs mx-auto">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400">Choose Your Alliance</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedTeam('red')}
                    className={`py-2 rounded-xl font-extrabold text-sm border-2 transition cursor-pointer ${
                      selectedTeam === 'red'
                        ? 'border-rose-500 bg-rose-500/20 text-rose-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Red Team 🔴
                  </button>
                  <button
                    onClick={() => setSelectedTeam('blue')}
                    className={`py-2 rounded-xl font-extrabold text-sm border-2 transition cursor-pointer ${
                      selectedTeam === 'blue'
                        ? 'border-sky-500 bg-sky-500/20 text-sky-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Blue Team 🔵
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={handleJoinArena}
                disabled={connectionStatus === 'connecting'}
                className="w-full max-w-sm py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-base rounded-2xl shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
              >
                {connectionStatus === 'connecting' ? 'Connecting to Arena...' : '⚔️ ENTER ARENA ⚔️'}
              </button>
            </div>

            <div className="flex justify-center items-center gap-6 text-slate-400 text-xs font-semibold pt-4">
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-400 fill-current" />
                <span>Speed-based Scoring</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Trophy className="h-4 w-4 text-yellow-400" />
                <span>Gain +50 XP on Win</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOBBY / MATCHMAKING WAITING SCREEN */}
      {gameState === 'lobby' && (
        <div className="bg-white border border-sky-100 rounded-3xl p-6 md:p-10 shadow-md text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          <div className="max-w-md mx-auto space-y-6">
            <div className="relative">
              <div className="h-20 w-20 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin mx-auto flex items-center justify-center">
                <span className="text-xl font-bold text-indigo-600">Lobby</span>
              </div>
              {lobbyCountdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center mt-2.5">
                  <span className="text-2xl font-black text-indigo-600">{lobbyCountdown}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-lg text-slate-800">
                {lobbyCountdown !== null ? 'Matching Confirmed!' : 'Searching for Challengers...'}
              </h3>
              <p className="text-xs font-semibold text-slate-500 leading-normal">
                {waitingMessage || (lobbyCountdown !== null ? `Match starting in ${lobbyCountdown} seconds. Get ready!` : 'Waiting in matchmaking queue...')}
              </p>
            </div>

            {/* Joined players layout */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-3">Players in Room</div>
              
              {mode === '1v1' ? (
                <div className="flex items-center justify-center gap-12">
                  {players.map((p, idx) => (
                    <div key={p.id || idx} className="flex flex-col items-center gap-1.5">
                      <div className="h-12 w-12 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-2xl text-white flex items-center justify-center text-xl shadow-md border border-white">
                        {p.avatar || '🎓'}
                      </div>
                      <div className="text-xs font-black text-slate-700 truncate max-w-[120px]">{p.name}</div>
                      {p.isBot && <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-black uppercase tracking-wide">Bot</span>}
                    </div>
                  ))}
                  {players.length < 2 && (
                    <div className="flex flex-col items-center gap-1.5 opacity-50">
                      <div className="h-12 w-12 bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-xl">
                        🔍
                      </div>
                      <div className="text-xs font-bold text-slate-400">Searching...</div>
                    </div>
                  )}
                </div>
              ) : (
                /* Team view */
                <div className="grid grid-cols-2 gap-4 divide-x divide-slate-200">
                  <div className="space-y-2 pr-2">
                    <div className="text-rose-600 font-extrabold text-xs flex items-center gap-1 justify-center">🔴 Red Team</div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {players.filter(p => p.team === 'red').map((p, idx) => (
                        <div key={p.id || idx} className="flex items-center gap-1.5 bg-rose-50 border border-rose-100 px-2 py-1 rounded-xl text-xs font-semibold text-rose-700">
                          <span>{p.avatar}</span>
                          <span className="truncate max-w-[80px]">{p.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2 pl-2">
                    <div className="text-sky-600 font-extrabold text-xs flex items-center gap-1 justify-center">🔵 Blue Team</div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {players.filter(p => p.team === 'blue').map((p, idx) => (
                        <div key={p.id || idx} className="flex items-center gap-1.5 bg-sky-50 border border-sky-100 px-2 py-1 rounded-xl text-xs font-semibold text-sky-700">
                          <span>{p.avatar}</span>
                          <span className="truncate max-w-[80px]">{p.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE PLAYING SCREEN */}
      {gameState === 'playing' && currentQuestion && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* LEFT: LEADERBOARD / TRACK RACE */}
          <div className="lg:col-span-1 bg-white border border-sky-100 rounded-3xl p-5 shadow-md flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1">
                <Trophy className="h-4 w-4 text-amber-500" />
                Scoreboard
              </h3>
              
              {/* Leaderboard list */}
              <div className="space-y-2.5">
                {players.sort((a,b) => b.score - a.score).map((p, idx) => (
                  <div 
                    key={p.id} 
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition relative overflow-visible ${
                      p.id === wsRef.current?.url || !p.isBot && !p.id.startsWith("bot")
                        ? 'border-indigo-100 bg-indigo-50/40' 
                        : 'border-slate-100 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {/* Avatar with absolute floating speech bubbles for emojis */}
                      <div className="relative">
                        <div className="h-8 w-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
                          {p.avatar}
                        </div>
                        {/* Render active chat bubble for this player */}
                        <AnimatePresence>
                          {bubbles.filter(b => b.playerId === p.id).map(b => (
                            <motion.div
                              key={b.id}
                              initial={{ opacity: 0, scale: 0.5, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: -20 }}
                              exit={{ opacity: 0, scale: 0.5, y: -30 }}
                              className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded-lg text-sm shadow-md whitespace-nowrap font-bold"
                            >
                              {b.message}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                      <div className="text-xs">
                        <div className="font-black text-slate-700 truncate max-w-[100px]">{p.name}</div>
                        <div className="text-[10px] text-indigo-600 font-extrabold">{p.score} pts</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {p.hasAnswered && (
                        <span className="text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-600 px-1.5 py-0.5 rounded animate-pulse">
                          Ready
                        </span>
                      )}
                      <span className="text-xs font-black text-slate-400">#{idx + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EMOJI DECK */}
            <div className="border-t border-slate-100 pt-4 space-y-2">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">React Live!</div>
              <div className="grid grid-cols-4 gap-1.5">
                {['🔥', '😮', '😎', '🤖', '⚡', '🧙‍♂️', '👍', '💥'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleSendReaction(emoji)}
                    className="p-2 hover:bg-slate-100 active:scale-95 border border-slate-100 hover:border-slate-200 rounded-xl transition text-base text-center cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: QUESTION CARD AND RENDERER */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Visual Race tracker top bar */}
            <div className="bg-white border border-sky-100 rounded-3xl p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-500 px-1">
                <span>Race Track</span>
                <span className="text-indigo-600">Goal: 1,500 pts</span>
              </div>
              <div className="h-10 bg-slate-50 border border-slate-100 rounded-2xl relative flex items-center p-1 overflow-hidden shadow-inner">
                {/* Visual lanes or just player markers */}
                <div className="absolute right-2 text-xs font-bold text-slate-300">🏁</div>
                <div className="w-full relative h-full">
                  {players.map((p, idx) => {
                    const percentage = Math.min(92, (p.score / 1500) * 100);
                    return (
                      <motion.div
                        key={p.id}
                        animate={{ left: `${percentage}%` }}
                        transition={{ type: 'spring', stiffness: 80 }}
                        className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center z-10"
                      >
                        <div className="h-6 w-6 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full text-white flex items-center justify-center text-xs shadow border border-white">
                          {p.avatar}
                        </div>
                        <span className="text-[8px] font-black bg-slate-800 text-white px-1 py-0.5 rounded mt-0.5 whitespace-nowrap scale-[0.8] origin-top">
                          {p.name.split(' ')[0]}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Question Card */}
            <div className="bg-white border border-sky-100 rounded-3xl p-6 md:p-8 shadow-md space-y-6 relative overflow-hidden">
              {/* Top status header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md">
                    Round {questionIndex + 1} of {totalQuestions}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{currentQuestion.concept}</span>
                </div>
                
                {/* Synced Round timer */}
                <div className="flex items-center gap-1.5 text-slate-700 font-extrabold text-sm">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className={timer <= 5 ? 'text-rose-500 animate-pulse font-black' : ''}>
                    {timer}s left
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-4">
                <h3 className="font-extrabold text-base md:text-lg text-slate-800 leading-snug">
                  {currentQuestion.question}
                </h3>

                {/* Preformatted Code Block */}
                {currentQuestion.codeContext && (
                  <div className="bg-slate-950 text-emerald-400 p-4 rounded-2xl font-mono text-xs md:text-sm shadow-inner relative overflow-x-auto select-none">
                    <pre>{currentQuestion.codeContext}</pre>
                    <span className="absolute top-2 right-3 text-[10px] uppercase font-black tracking-widest text-slate-600">Python</span>
                  </div>
                )}
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                {currentQuestion.options?.map((option: string) => {
                  const isSelected = selectedOption === option;
                  
                  // Styles for post-round evaluation
                  let optionStyle = 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50 text-slate-700';
                  
                  if (roundCompleted) {
                    const isCorrectOption = option === correctAnswer;
                    const wasSelected = selectedOption === option;
                    
                    if (isCorrectOption) {
                      optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800';
                    } else if (wasSelected) {
                      optionStyle = 'border-rose-500 bg-rose-50 text-rose-800';
                    } else {
                      optionStyle = 'border-slate-100 bg-slate-50/40 text-slate-400 opacity-60';
                    }
                  } else if (isSelected) {
                    optionStyle = 'border-indigo-600 bg-indigo-50/30 text-indigo-950 font-bold';
                  }

                  return (
                    <button
                      key={option}
                      onClick={() => handleSelectOption(option)}
                      disabled={answered || roundCompleted}
                      className={`p-4 rounded-2xl border-2 transition text-left text-sm cursor-pointer disabled:cursor-not-allowed ${optionStyle}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {roundCompleted && option === correctAnswer && (
                          <span className="text-xs bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold uppercase scale-90">Correct</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Action and feedback footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-4">
                <div>
                  {!roundCompleted && (
                    <div className="text-xs text-slate-400 font-semibold">
                      {answered ? 'Answer submitted! Waiting for opponent...' : 'Select an option and submit before time runs out!'}
                    </div>
                  )}
                  {roundFeedback && roundCompleted && (
                    <div className={`flex items-center gap-1.5 text-sm font-extrabold ${roundFeedback.isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {roundFeedback.isCorrect ? (
                        <>✨ Correct! +{roundFeedback.points} pts</>
                      ) : (
                        <>❌ Incorrect (0 pts)</>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {!answered && !roundCompleted && (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!selectedOption}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm rounded-xl shadow cursor-pointer transition"
                    >
                      Submit Answer
                    </button>
                  )}
                </div>
              </div>

              {/* Explanations shown after round complete */}
              {roundCompleted && explanation && (
                <div className="bg-sky-50/50 border border-sky-100 p-4 rounded-2xl space-y-1.5">
                  <div className="text-xs font-black uppercase text-sky-800 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    Tutor Explanation
                  </div>
                  <p className="text-xs text-sky-950 font-semibold leading-relaxed">
                    {explanation}
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>
      )}

      {/* GAME OVER / RESULTS VIEW */}
      {gameState === 'ended' && (
        <div className="bg-white border border-sky-100 rounded-3xl p-6 md:p-10 shadow-md max-w-2xl mx-auto space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />
          
          <div className="text-center space-y-6">
            <div className="inline-flex p-3.5 bg-yellow-50 rounded-2xl border border-yellow-100 text-yellow-500 shadow-sm animate-bounce">
              <Trophy className="h-10 w-10" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-black text-slate-800">Match Complete!</h2>
              <p className="text-xs font-semibold text-slate-500">Here are the final standings and XP updates</p>
            </div>

            {/* Standings list */}
            <div className="bg-slate-50 rounded-2xl p-4 divide-y divide-slate-200/50 border border-slate-100 max-w-md mx-auto">
              {standings.map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      idx === 0 ? 'bg-amber-100 text-amber-800' :
                      idx === 1 ? 'bg-slate-200 text-slate-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx + 1}
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-extrabold text-slate-700">{p.name}</span>
                      {p.isBot && <span className="text-[8px] bg-slate-200 text-slate-600 px-1 py-0.2 rounded font-black ml-1.5 uppercase">Bot</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-slate-800">{p.score} pts</div>
                  </div>
                </div>
              ))}
            </div>

            {/* XP Award feedback */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5 rounded-2xl text-white max-w-md mx-auto shadow-md">
              <div className="text-xs font-black uppercase tracking-widest opacity-80">Quiz Rewards</div>
              <div className="text-2xl font-black mt-1">+{xpGained} XP</div>
              <div className="text-[10px] font-semibold opacity-90 mt-1">Your progress was synchronized with the database!</div>
            </div>

            {/* AI Review Recommendations */}
            {incorrectConcepts.length > 0 ? (
              <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-2xl text-left space-y-3 max-w-md mx-auto">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase text-indigo-800">
                  <Crown className="h-4 w-4 text-indigo-500" />
                  AI Review Planner
                </div>
                <p className="text-xs text-indigo-950 font-semibold leading-relaxed">
                  Based on your performance in this quiz, you made mistakes in the following concepts. We recommend completing their targeted lessons:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {incorrectConcepts.map(c => (
                    <span key={c} className="text-[10px] font-extrabold bg-white border border-indigo-100 text-indigo-700 px-2.5 py-1 rounded-xl shadow-sm">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl max-w-md mx-auto text-left flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wide">Flawless Game!</h4>
                  <p className="text-xs text-emerald-950 font-semibold leading-normal mt-0.5">
                    You got 100% correct answers! No review suggestions needed. You are mastering Python!
                  </p>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => setGameState('setup')}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-xl shadow transition cursor-pointer"
              >
                Play Again
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
