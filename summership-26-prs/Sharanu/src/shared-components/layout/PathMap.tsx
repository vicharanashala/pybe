import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, ChevronDown, ChevronUp, Search, Award, RefreshCw, BookOpen } from "lucide-react";
import { LESSONS } from "../../learning/lessons/registry";
import BackButton from "../ui/BackButton";
import Badge from "../ui/Badge";
import { useProgress } from "../../progress/useProgress";

function storyExcerpt(storyBody: string, maxLength = 110): string {
  const firstParagraph = storyBody.split("\n\n")[0].trim();
  if (firstParagraph.length <= maxLength) return firstParagraph;
  const cut = firstParagraph.slice(0, maxLength);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

export default function PathMap() {
  const { isComplete, completedCount, unlockedBadges, resetProgress } = useProgress();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "completed" | "todo">("all");

  const total = LESSONS.length;
  const progressPercent = Math.round((completedCount / total) * 100);

  function toggleExpanded(e: React.MouseEvent, slug: string) {
    e.preventDefault();
    e.stopPropagation();
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  // Search still matches against the real exception name/concept behind the
  // scenes, even though the name itself isn't shown on the card anymore —
  // students who already know what they're looking for can still find it.
  const filteredLessons = LESSONS.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.storyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.conceptExplainer.toLowerCase().includes(searchQuery.toLowerCase());

    const done = isComplete(lesson.slug);
    if (filterMode === "completed") return matchesSearch && done;
    if (filterMode === "todo") return matchesSearch && !done;
    return matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto animate-[fadeIn_0.5s_ease] w-full px-2">
      {/* Header Banner */}
      <div className="text-center mb-8">
        <span className="inline-block text-gold text-xs tracking-[0.3em] uppercase mb-3 bg-gold/10 border border-gold/30 rounded-full px-4 py-1 font-semibold">
          Lesson Directory
        </span>
        <h2 className="text-3xl sm:text-5xl font-display font-semibold text-ink mb-4 drop-shadow-md">
          Every Exception Has a Story
        </h2>
        <p className="text-mutedSoft text-base sm:text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
          Journey through Python exceptions guided by timeless wisdom. Walk the sequence from start to finish or explore individual topics.
        </p>

        {/* Progress Stats Card */}
        <div className="glass-card-strong max-w-xl mx-auto rounded-3xl p-5 border border-gold/30 shadow-xl mb-8">
          <div className="flex items-center justify-between mb-3 text-sm">
            <span className="text-muted flex items-center gap-2">
              <Award size={16} className="text-gold" /> Total Mastery Progress
            </span>
            <span className="text-gold font-bold font-mono text-base">
              {completedCount} of {total} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-3 bg-panel border border-line rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-gold via-[#F2C15C] to-[#7FBF9E] rounded-full transition-all duration-700 shadow-md"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Badges showcase */}
        {unlockedBadges.length > 0 && (
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-muted mb-3 font-semibold">
              Unlocked Dharma Badges ({unlockedBadges.length})
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
              {unlockedBadges.map((badge) => (
                <Badge key={badge} label={badge} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-2xl p-4 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between border border-line shadow-lg">
        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-panel/70 p-1 rounded-xl border border-line w-full sm:w-auto justify-center">
          <button
            onClick={() => setFilterMode("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === "all" ? "bg-gold text-bg shadow" : "text-muted hover:text-ink"
            }`}
          >
            All ({total})
          </button>
          <button
            onClick={() => setFilterMode("todo")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === "todo" ? "bg-gold text-bg shadow" : "text-muted hover:text-ink"
            }`}
          >
            To Do ({total - completedCount})
          </button>
          <button
            onClick={() => setFilterMode("completed")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === "completed" ? "bg-[#7FBF9E] text-bg shadow" : "text-muted hover:text-ink"
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exceptions or stories…"
            className="w-full bg-panel/80 border border-line/80 rounded-xl pl-9 pr-4 py-2 text-ink text-xs outline-none focus:border-gold transition-colors placeholder:text-muted/60"
          />
        </div>
      </div>

      {/* Lessons Grid */}
      {filteredLessons.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center text-muted">
          <BookOpen size={36} className="mx-auto text-gold/40 mb-3" />
          <p className="text-base text-ink font-semibold mb-1">No lessons match your search</p>
          <p className="text-xs text-mutedSoft">Try adjusting your filter or search terms.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          {filteredLessons.map((lesson) => {
            const done = isComplete(lesson.slug);
            const isOpen = expanded.has(lesson.slug);

            return (
              <Link
                key={lesson.slug}
                to={`/lessons/${lesson.slug}`}
                className={`shine-card group flex flex-col justify-between border rounded-3xl p-6 transition-all ${
                  done
                    ? "glass-card bg-[#0E1F1A]/35 border-[#7FBF9E]/40 shadow-emerald-950/20"
                    : "glass-card hover:border-gold/60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-mono tracking-wider uppercase font-semibold ${done ? "text-[#7FBF9E]" : "text-gold"}`}>
                      Lesson {String(lesson.order).padStart(2, "0")}
                    </span>
                    {done ? (
                      <span className="flex items-center gap-1 text-[11px] bg-[#7FBF9E]/20 text-[#7FBF9E] border border-[#7FBF9E]/40 px-2.5 py-0.5 rounded-full font-semibold">
                        <Check size={12} /> Mastered
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted uppercase tracking-widest bg-panel/60 border border-line px-2 py-0.5 rounded-full">
                        Interactive
                      </span>
                    )}
                  </div>

                  {/* Exception name intentionally hidden here — CodeGita N instead,
                      so the story is read before the name is known. Revealed
                      inside the lesson itself, after the story and pause beats. */}
                  <h3 className="text-ink font-bold font-display text-xl mb-1.5 group-hover:text-gold transition-colors">
                    CodeGita {lesson.order}
                  </h3>
                  <p className="text-gold/90 text-xs font-semibold uppercase tracking-wider mb-3 font-display">
                    {lesson.storyTitle}
                  </p>

                  {!isOpen ? (
                    <p className="text-mutedSoft text-sm leading-relaxed mb-4">
                      {storyExcerpt(lesson.storyBody)}
                    </p>
                  ) : (
                    <div className="mb-4 animate-[fadeIn_0.3s_ease] bg-panel/40 p-3.5 rounded-2xl border border-line/60">
                      {lesson.storyBody.split("\n\n").map((para, i) => (
                        <p key={i} className="text-mutedSoft text-sm leading-relaxed mb-2.5 last:mb-0">
                          {para}
                        </p>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={(e) => toggleExpanded(e, lesson.slug)}
                    className="relative z-10 inline-flex items-center gap-1 text-xs font-semibold text-gold hover:text-[#f0c268] transition-colors mb-4"
                  >
                    {isOpen ? (
                      <>
                        Collapse story <ChevronUp size={14} />
                      </>
                    ) : (
                      <>
                        Read full story <ChevronDown size={14} />
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-line/60 text-xs">
                  <span className="text-muted font-mono">
                    {lesson.practiceLadder ? `${lesson.practiceLadder.length} Exercises` : "Code + Quiz"}
                  </span>
                  <div className="flex items-center gap-1.5 text-gold group-hover:translate-x-1 transition-transform font-semibold">
                    <span>{done ? "Review" : "Start"}</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex justify-between items-center gap-4 py-4">
        <Link to="/foundations">
          <BackButton />
        </Link>
        {completedCount > 0 && (
          <button
            onClick={() => {
              if (window.confirm("Reset all progress? This action cannot be undone.")) {
                resetProgress();
              }
            }}
            className="flex items-center gap-1.5 text-muted hover:text-vermilion text-xs transition-colors py-2 px-3 rounded-lg hover:bg-vermilion/10"
          >
            <RefreshCw size={13} /> Reset All Progress
          </button>
        )}
      </div>
    </div>
  );
}