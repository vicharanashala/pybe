import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Sprout, Leaf, Map, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { THEME_META } from '../utils/themeStyles';

// Step 1 is now "what are you into?" instead of a professional-background
// pick — the learner's answer decides which theme every real-world
// scenario (for every concept, all the way through the course) is told
// through. Icons here come straight from THEME_META, the same source used
// to repaint the rest of the app, so the icon shown here always matches
// the icon shown everywhere else for that theme.
const THEME_OPTIONS = [
  { value: 'sports', label: THEME_META.sports.label, icon: THEME_META.sports.icon, desc: 'Scoreboards, leagues, training stats, match-day decisions' },
  { value: 'daily-life', label: THEME_META['daily-life'].label, icon: THEME_META['daily-life'].icon, desc: 'Budgets, groceries, chores, everyday planning' },
  { value: 'philosophy', label: THEME_META.philosophy.label, icon: THEME_META.philosophy.icon, desc: 'Arguments, ethics, logic puzzles, big questions' },
  { value: 'food', label: THEME_META.food.label, icon: THEME_META.food.icon, desc: 'Restaurants, recipes, kitchens, menus, food trucks' },
  { value: 'environmental', label: THEME_META.environmental.label, icon: THEME_META.environmental.icon, desc: 'Recycling, conservation, wildlife, sustainability' },
];

const STEPS = [
  {
    id: 'theme',
    type: 'choice',
    question: 'What are you into?',
    subtitle: "We'll teach every Python concept through real-world scenarios from this world.",
    field: 'theme',
    options: THEME_OPTIONS
  },
  {
    id: 'goal',
    type: 'text',
    question: 'Why do you want to learn Python?',
    subtitle: "No wrong answer — this just helps us understand what you're aiming for.",
    field: 'learningGoal',
    placeholder: "e.g. I want to analyze sports stats, automate my daily tasks, build something creative..."
  },
  {
    id: 'level',
    type: 'choice',
    question: 'How much Python do you know?',
    subtitle: 'Be honest — there\'s no wrong answer.',
    field: 'pythonLevel',
    options: [
      { value: 'beginner', label: 'Beginner', icon: Sprout, desc: 'I\'ve written little or no Python code' },
      { value: 'intermediate', label: 'Intermediate', icon: Leaf, desc: 'I know the basics but want to go deeper' },
    ]
  },
  {
    id: 'mode',
    type: 'choice',
    question: 'How do you prefer to learn?',
    subtitle: 'You can always switch this later in your profile.',
    field: 'learningMode',
    options: [
      { value: 'guided', label: 'Guided Journey', icon: Map, desc: 'Take me step by step — unlock concepts as I complete them' },
      { value: 'explore', label: 'Explore Freely', icon: Compass, desc: 'Let me jump to any topic whenever I want' },
    ]
  }
];

export default function OnboardingPage() {
  const { completeOnboarding } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ theme: null, learningGoal: '', pythonLevel: null, learningMode: null });
  const [selected, setSelected] = useState(null);
  const [textValue, setTextValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentStep = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const isTextStep = currentStep.type === 'text';
  const canProceed = isTextStep ? textValue.trim().length > 0 : !!selected;

  const goNext = async (updated) => {
    if (isLast) {
      setLoading(true);
      setError('');
      try {
        await completeOnboarding(updated.theme, updated.learningGoal, updated.pythonLevel, updated.learningMode);
        navigate('/dashboard');
      } catch (err) {
        setError('Something went wrong. Please try again.');
        setLoading(false);
      }
    } else {
      setStep(s => s + 1);
      setSelected(null);
      setTextValue('');
    }
  };

  const handleNext = async () => {
    if (!canProceed) return;
    const value = isTextStep ? textValue.trim() : selected;
    const updated = { ...answers, [currentStep.field]: value };
    setAnswers(updated);
    await goNext(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-violet-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'
              } ${i === step ? 'w-12' : 'w-6'}`}
            />
          ))}
        </div>

        <div className="card p-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-500 mb-2">
              Step {step + 1} of {STEPS.length}
            </p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{currentStep.question}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{currentStep.subtitle}</p>
          </div>

          {isTextStep ? (
            <div className="mb-6">
              <textarea
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder={currentStep.placeholder}
                className="w-full h-28 p-4 text-sm resize-none input"
                autoFocus
              />
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {currentStep.options.map(opt => {
                const OptIcon = opt.icon;
                const isThemeStep = currentStep.field === 'theme';
                const isSelected = selected === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setSelected(opt.value)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? isThemeStep
                          ? `${THEME_META[opt.value]?.border} ${THEME_META[opt.value]?.bg}`
                          : 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                        : 'border-gray-100 dark:border-gray-800 hover:border-brand-200 dark:hover:border-brand-800 bg-white dark:bg-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? isThemeStep
                            ? `bg-gradient-to-br ${THEME_META[opt.value]?.gradient} text-white shadow-md`
                            : 'bg-brand-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                      }`}>
                        <OptIcon size={18} />
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${
                          isSelected
                            ? isThemeStep ? THEME_META[opt.value]?.accentText : 'text-brand-700 dark:text-brand-300'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {opt.label}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{opt.desc}</p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 size={18} className={`ml-auto shrink-0 ${isThemeStep ? THEME_META[opt.value]?.accentText : 'text-brand-500'}`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {error && (
            <div className="mb-4 text-sm text-red-500 text-center">{error}</div>
          )}

          <button
            onClick={handleNext}
            disabled={!canProceed || loading}
            className="btn-primary w-full"
          >
            {loading ? 'Setting up...' : isLast ? 'Start Learning →' : 'Continue →'}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          PyBe — you can change these settings anytime
        </p>
      </div>
    </div>
  );
}
