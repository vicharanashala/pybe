import { TopBar } from './components/ui/TopBar';
import { StoryIntro } from './components/scenes/StoryIntro';
import { MeetingScene } from './components/scenes/MeetingScene';
import { TableScene } from './components/scenes/TableScene';
import { PlotChallenge } from './components/scenes/PlotChallenge';
import { Quiz } from './components/scenes/Quiz';
import { Completion } from './components/scenes/Completion';
import { MeetingClose, MeetingRejected } from './components/scenes/MeetingOutcome';
import { stages } from './data/story';
import { useCaseStudy } from './hooks/useCaseStudy';
import { useProgress } from './hooks/useProgress';

export default function App() {
  const { caseStudy, plots, quiz } = useCaseStudy();
  const progress = useProgress();
  const { stage, setStage } = progress;
  const restart = () => window.location.reload();
  const currentPlot = plots.find((p) => p.id === progress.order[progress.plotIndex]);

  const scenes = {
    welcome: () => <StoryIntro story={stages[0]} onNext={() => setStage('meeting')} />,
    meeting: () => <MeetingScene story={stages[1]} onNext={() => setStage('table')} />,
    table: () => <TableScene data={caseStudy.table} onNext={() => progress.startPlots(plots.map((p) => p.id))} />,
    plots: () => currentPlot && (
      <PlotChallenge
        key={currentPlot.id}
        plot={currentPlot}
        plots={plots}
        dataset={caseStudy.datasets[currentPlot.id]}
        position={progress.plotIndex + 1}
        total={progress.order.length}
        mistakesLeft={progress.mistakesLeft}
        onCorrect={progress.correct}
        onWrong={progress.wrong}
        onBreak={(chosenId) => progress.breakDeal(currentPlot.id, chosenId)}
      />
    ),
    close: () => <MeetingClose onNext={() => setStage('quiz')} />,
    rejected: () => (
      <MeetingRejected
        failure={progress.failure && {
          plot: plots.find((p) => p.id === progress.failure.questionId),
          chosen: plots.find((p) => p.id === progress.failure.chosenId)
        }}
        onRetry={progress.retry}
        onRestart={restart}
      />
    ),
    quiz: () => <Quiz questions={quiz} onAnswer={progress.recordQuizAnswer} onDone={() => setStage('done')} />,
    done: () => (
      <Completion
        results={progress.quizResults}
        confidence={progress.confidence}
        reflection={progress.reflection}
        setReflection={progress.setReflection}
        onRestart={restart}
      />
    )
  };

  return (
    <div className="app-shell">
      <TopBar confidence={progress.confidence} stage={stage} total={progress.order.length || plots.length} />
      <main>{scenes[stage]?.()}</main>
      <footer><span>PYBE CASE STUDY</span><span>TURNING DATA INTO DECISIONS</span></footer>
    </div>
  );
}
