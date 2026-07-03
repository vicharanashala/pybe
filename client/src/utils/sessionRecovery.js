const SESSION_KEY = 'pybe_session_recovery';
const SESSION_VERSION = 1;

export function saveSessionState(state) {
  try {
    const sessionData = {
      version: SESSION_VERSION,
      savedAt: Date.now(),
      data: {
        selectedScenarioId: state.selected?._id || null,
        activeResult: state.activeResult || null,
        journeyStep: state.journeyStep || 0,
        currentView: state.view || 'explorer',
        quizData: state.quizData || null,
        form: state.form || { reasoning: '', promptText: '', reflection: '' },
        xp: state.xp || 0,
        streak: state.streak || 0
      }
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  } catch (e) {
    console.warn('Could not save session state:', e);
  }
}

export function loadSessionState(scenarios) {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw);

    if (!session || session.version !== SESSION_VERSION) {
      clearSessionState();
      return null;
    }

    const age = Date.now() - session.savedAt;
    if (age > 2 * 60 * 60 * 1000) {
      clearSessionState();
      return null;
    }

    const { data } = session;

    const selectedScenario = scenarios?.find(s => s._id === data.selectedScenarioId) || null;

    const result = {
      selected: selectedScenario,
      activeResult: data.activeResult,
      journeyStep: data.journeyStep,
      view: data.currentView,
      quizData: data.quizData,
      form: data.form,
      xp: data.xp,
      streak: data.streak
    };

    if (result.view && typeof result.view === 'string') {
      const validViews = ['explorer', 'workspace', 'summary', 'mentor', 'w3h', 'quiz', 'dashboard'];
      if (!validViews.includes(result.view)) {
        result.view = 'explorer';
        result.journeyStep = 0;
      }
    }

    if (result.journeyStep < 0 || result.journeyStep > 7 || typeof result.journeyStep !== 'number') {
      result.journeyStep = 0;
    }

    return result;
  } catch (e) {
    console.warn('Could not load session state:', e);
    clearSessionState();
    return null;
  }
}

export function clearSessionState() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.warn('Could not clear session state:', e);
  }
}

export function restoreQuizState(quizData, questions, answers, currentIndex, sessionCorrect, sessionXp, hearts) {
  return {
    quizData,
    questions,
    answers,
    currentIndex,
    sessionCorrect,
    sessionXp,
    hearts
  };
}