import React, { useState, useEffect } from 'react';
import { useProgress } from '../context/ProgressContext';
import { ManuscriptCard, StoryHeader } from '../components/Ornaments';
import { evaluateReflection } from '../utils/evaluator';
import { Mic, MicOff, Send, ArrowLeft, Volume2 } from 'lucide-react';
import { getTopic } from '../data/curriculum';

export const ReflectionView: React.FC = () => {
  const { prevStep, nextStep, submitReflection, userReflection, activeTopicId } = useProgress();
  const topic = getTopic(activeTopicId);
  const [inputText, setInputText] = useState<string>(userReflection || '');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);
  const [recognitionObj, setRecognitionObj] = useState<any>(null);

  useEffect(() => {
    // Check Speech Recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = 'en-IN'; // Set to Indian English for natural capture

      rec.onresult = (event: any) => {
        const lastResultIndex = event.results.length - 1;
        const transcript = event.results[lastResultIndex][0].transcript;
        setInputText(prev => (prev ? prev + ' ' + transcript : transcript));
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognitionObj(rec);
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionObj) return;

    if (isListening) {
      recognitionObj.stop();
      setIsListening(false);
    } else {
      try {
        recognitionObj.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = () => {
    if (!inputText.trim()) return;

    if (isListening && recognitionObj) {
      recognitionObj.stop();
    }

    // Evaluate response using the helper
    const { scores, feedback } = evaluateReflection(inputText, topic);
    submitReflection(inputText, scores, feedback);
    nextStep();
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-6 px-4 max-w-4xl mx-auto w-full select-none">
      <ManuscriptCard className="w-full animate-manuscript-open">
        <StoryHeader topic={topic} />

        {/* Prompt Card */}
        <div className="mb-6 p-5 bg-royal-crimson/5 dark:bg-royal-gold/5 rounded-xl border border-royal-gold/20 flex gap-4 items-start">
          <div className="w-10 h-10 rounded-lg bg-royal-crimson/10 flex items-center justify-center flex-shrink-0">
            <Volume2 className="w-5 h-5 text-royal-crimson dark:text-royal-gold" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-royal-indigo dark:text-royal-gold mb-1">
              {topic.storyWorld.mentor.name}'s Prompt:
            </h4>
            <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              “{topic.mentorPrompt}”
            </p>
            <p className="mt-3 text-xs font-semibold text-royal-crimson dark:text-royal-gold">
              First, make a prediction: {topic.predictionPrompt}
            </p>
          </div>
        </div>

        {/* Ledger Text Area & Voice Input */}
        <div className="relative mb-6">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your reflection here, or tap the microphone to speak your thoughts..."
            className="w-full h-48 p-5 bg-white dark:bg-parchment-dark rounded-xl border border-parchment-border dark:border-parchment-darkBorder focus:outline-none focus:ring-1 focus:ring-royal-gold text-gray-800 dark:text-gray-200 font-sans text-sm md:text-base leading-relaxed resize-none shadow-inner"
          />

          {/* Voice Indicator overlay */}
          {isListening && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full animate-pulse text-red-600 dark:text-red-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
              <span>Recording Voice...</span>
            </div>
          )}
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            {speechSupported ? (
              <button
                onClick={toggleListening}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border font-semibold text-xs md:text-sm transition-all duration-300 ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white border-red-500 shadow-md ring-2 ring-red-500/30'
                    : 'bg-white dark:bg-parchment-darkCard border-parchment-border dark:border-parchment-darkBorder text-gray-700 dark:text-gray-300 hover:border-royal-crimson'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span>Pause Voice</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-royal-crimson dark:text-royal-gold" />
                    <span>Speak Reflection</span>
                  </>
                )}
              </button>
            ) : (
              <div className="text-[11px] text-gray-400 dark:text-gray-600 italic">
                Voice recording not supported by browser. Ledger typing is fully active.
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!inputText.trim()}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              inputText.trim()
                ? 'bg-royal-crimson hover:bg-royal-crimsonHover text-white shadow-md hover:shadow-royal-crimson/20'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-parchment-darkCard dark:text-gray-600'
            }`}
          >
            <span>Submit to Court Advisor</span>
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Back Link */}
        <div className="flex justify-start">
          <button
            onClick={prevStep}
            className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-royal-indigo transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Review Story Solution</span>
          </button>
        </div>
      </ManuscriptCard>
    </div>
  );
};
