import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Play, Sparkles } from 'lucide-react';

const SECTION_DISPLAY_NAMES = { variables: 'Names', conditionals: 'Conditions', loops: 'Repetitions', functions: 'Actions' };

const sectionDisplayName = (topic) => SECTION_DISPLAY_NAMES[topic.slug] || topic.name;

const ICONS = {
  crow: '🐦',
  milkmaid: '🥛🐓',
  dog: '🐕🦴',
  elephdog: '🐘🐕',
  jackal: '🦊💙',
  heron: '🦢🦀',
  brahmin: '👳🐐',
  monkeyking: '👑🐵',
  crowsnake: '🐦‍⬛🐍',
  crowowls: '🐦‍⬛🦉',
  fivefriends: '🕊️🦌',
  elecaravan: '🐘🌙',
  wisequail: '🐦🪶',
  monkey: '🐵🐊',
  tortoise: '🐢🐇',
  tortgeese: '🐢🦢',
  rurudeer: '🦌👑',
  jackaldrum: '🦊🥁',
  sparreleph: '🐦🐘',
  banyandeer: '🦌',
  antdove: '🐜🕊️',
  goldgoose: '🦢✨',
  monkeywedge: '🐵🪵',
  elephant: '🐘👨',
  lion: '🦁🐭',
};

const TOPIC_THEMES = {
  variables: 'theme-forest',
  conditionals: 'theme-terracotta',
  loops: 'theme-indigo',
  lists: 'theme-gold',
  functions: 'theme-robe',
};

const TOPIC_EMOJI = {
  conditionals: '🐵🐊',
  loops: '🐢🐇',
  lists: '🐘👨',
  functions: '🦁🐭',
};

const TOPIC_SUBTITLES = {
  variables: 'Name a value, then change it anytime',
  conditionals: 'Decide with if and else',
  loops: 'Repeat without repeating yourself',
  lists: 'Keep many values in order',
  functions: 'Reusable helpers that do a job',
};

function statusFor(story, status) {
  if (!status) return 'not-started';
  if (status.riddle && status.challenge && status.project) return 'complete';
  if (status.riddle || status.challenge || status.project) return 'in-progress';
  return 'not-started';
}

function VariablesArt() {
  return (
    <svg viewBox="0 0 140 140" role="img" aria-label="A crow dropping pebbles into a clay pot of water">
      <ellipse cx="70" cy="113" rx="34" ry="5" fill="rgba(51,38,28,0.22)" />
      <path d="M52 74 C52 100 58 108 70 108 C82 108 88 100 88 74 Z" fill="#c2572e" />
      <path d="M70 108 C82 108 88 100 88 74 L74 74 C74 96 72 105 70 108 Z" fill="#9c3c1c" />
      <ellipse cx="70" cy="74" rx="20" ry="5" fill="#d46a3a" />
      <ellipse cx="70" cy="74" rx="16" ry="3.6" fill="#2b1f16" />
      <path d="M54.5 78 L54.5 92 C60 95 80 95 85.5 92 L85.5 78 C78 82 62 82 54.5 78 Z" fill="#3f7f77" />
      <ellipse cx="62" cy="98" rx="4" ry="3" fill="#6b5b4c" />
      <ellipse cx="70" cy="99" rx="4" ry="3" fill="#7c6a58" />
      <ellipse cx="78" cy="98" rx="4" ry="3" fill="#5d4e40" />
      <path d="M60 84 C63 82 66 82 69 84" stroke="#bfe0d6" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M71 88 C74 86 77 86 80 88" stroke="#bfe0d6" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M43 55 C34 47 30 42 31 36 C36 42 41 46 46 49 Z" fill="#241b14" />
      <ellipse cx="52" cy="57" rx="11" ry="8" fill="#241b14" />
      <path d="M45 54 C47 50 53 50 57 54 C54 58 48 59 45 54 Z" fill="#33261c" />
      <circle cx="60" cy="48" r="5.6" fill="#241b14" />
      <path d="M64.5 46 L74 49.5 L64.5 52 Z" fill="#b8862f" />
      <circle cx="61" cy="46.8" r="1.1" fill="#f3c368" />
      <path d="M49 64 L47 71 M53 64 L55 71" stroke="#241b14" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="71" cy="62" r="2.6" fill="#8a7a63" />
      <path d="M71 52 C71 55 71 57 71 60" stroke="#8a7a63" strokeWidth="1.2" strokeDasharray="2 2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function ConditionalsArt() {
  return (
    <svg viewBox="0 0 140 140" role="img" aria-label="A monkey weighing two paths - one leading to a mango tree, one to the river">
      {/* ground shadow */}
      <ellipse cx="70" cy="127" rx="42" ry="5" fill="rgba(51,38,28,0.20)" />

      {/* two branching paths */}
      <path d="M70 122 L36 92" stroke="#c99a63" strokeWidth="11" strokeLinecap="round" />
      <path d="M70 122 L104 92" stroke="#c99a63" strokeWidth="11" strokeLinecap="round" />
      <path d="M70 121 L40 96" stroke="#e8c393" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 5" />
      <path d="M70 121 L101 96" stroke="#e8c393" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 5" />

      {/* left destination: mango tree */}
      <rect x="26" y="76" width="5" height="15" rx="2" fill="#8b5e34" />
      <circle cx="24.5" cy="68" r="9" fill="#4e8a5a" />
      <circle cx="33.5" cy="64.5" r="7" fill="#3f7f77" />
      <circle cx="21" cy="65" r="3" fill="#e8923a" />
      <circle cx="29" cy="61.5" r="2.6" fill="#e8923a" />
      <circle cx="25" cy="70.5" r="2.4" fill="#f3c368" />

      {/* river */}
      <ellipse cx="110" cy="91" rx="19" ry="6" fill="#6aa3c8" />
      <path d="M95 90 C98 88 101 88 104 90 M113 93 C116 91 119 91 122 93" stroke="#bfe0ef" strokeWidth="1.6" fill="none" strokeLinecap="round" />

      {/* crocodile: long snout, open jaw, teeth, eye bump, scutes */}
      <path d="M117 80 L121 76.5 L123 79 L125.5 77 L127 81 Z" fill="#3d6b34" />
      <path d="M100 83.5 C104 80.5 112 79.5 118 80.5 C123 81.3 126 83 127 85 L127 87.5 L103 87 Z" fill="#4a7d3f" />
      <path d="M104 89.5 C109 91 118 91.2 125 90 L127 89 L127 91 C124 93.2 116 93.6 109 92.6 C105.8 92.1 103.8 91 104 89.5 Z" fill="#7fae6a" />
      <path d="M103.2 87.2 L106.5 89.4 L109.5 87.6 L112.5 89.6 L115.5 87.8 L118.5 89.4 L121.5 87.8 L124 88.6 L124.5 90 L104 90.2 Z" fill="#fffdf4" />
      <circle cx="120.5" cy="76.2" r="2.6" fill="#fffdf4" />
      <circle cx="121.2" cy="76.6" r="1.3" fill="#241b14" />
      <circle cx="120.8" cy="76.1" r="0.45" fill="#ffffff" />
      <circle cx="100.6" cy="82.2" r="1.3" fill="#4a7d3f" />
      <circle cx="100.6" cy="82.2" r="0.55" fill="#241b14" />
      <path d="M107 80.2 L108.2 78.6 M113 79.8 L114 78.2" stroke="#3d6b34" strokeWidth="1" strokeLinecap="round" />

      {/* pondering monkey at the fork - larger, expressive */}
      <path d="M84 74 C95 72 97 62 91 55 C89 52.5 86 53.5 87 56.5" stroke="#8b5e34" strokeWidth="5.5" fill="none" strokeLinecap="round" />
      <ellipse cx="61.5" cy="85" rx="4.6" ry="3.4" fill="#7a4e28" />
      <ellipse cx="78.5" cy="85" rx="4.6" ry="3.4" fill="#7a4e28" />
      <ellipse cx="70" cy="71.5" rx="13.5" ry="11.5" fill="#9c6b3f" />
      <ellipse cx="70" cy="74" rx="8" ry="7" fill="#e8c393" />
      <path d="M59.5 67 C57 70.5 58 75 62 77" stroke="#9c6b3f" strokeWidth="4.2" fill="none" strokeLinecap="round" />
      <path d="M80 67 C84.5 61 83 53.5 77.5 50.8" stroke="#9c6b3f" strokeWidth="4.4" fill="none" strokeLinecap="round" />
      <circle cx="77" cy="50" r="2.4" fill="#9c6b3f" />
      <path d="M69.5 32.5 C69.5 29.5 72.5 29.5 72.3 32.2" stroke="#7a4e28" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="56.5" cy="39" r="5.4" fill="#9c6b3f" />
      <circle cx="83.5" cy="39" r="5.4" fill="#9c6b3f" />
      <circle cx="56.5" cy="39" r="3" fill="#e8c393" />
      <circle cx="83.5" cy="39" r="3" fill="#e8c393" />
      <circle cx="56.5" cy="39" r="1.2" fill="#b98a55" />
      <circle cx="83.5" cy="39" r="1.2" fill="#b98a55" />
      <circle cx="70" cy="44" r="12" fill="#9c6b3f" />
      <path d="M62.5 41.5 C63.5 37 66.5 35.5 70 35.8 C73.5 35.5 76.5 37 77.5 41.5 C74.5 39.5 65.5 39.5 62.5 41.5 Z" fill="#b98a55" />
      <circle cx="65.5" cy="43" r="2.9" fill="#fffdf4" />
      <circle cx="74.5" cy="43" r="2.9" fill="#fffdf4" />
      <circle cx="66.2" cy="43.4" r="1.55" fill="#241b14" />
      <circle cx="73.8" cy="43.4" r="1.55" fill="#241b14" />
      <circle cx="65.7" cy="42.8" r="0.5" fill="#ffffff" />
      <circle cx="73.3" cy="42.8" r="0.5" fill="#ffffff" />
      <path d="M62.6 37.6 L66.8 36.4" stroke="#241b14" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M73.2 36.4 L77.4 37.6" stroke="#241b14" strokeWidth="1.2" strokeLinecap="round" />
      <ellipse cx="70" cy="49.5" rx="6.6" ry="4.8" fill="#e8c393" />
      <ellipse cx="67" cy="47.6" rx="1.5" ry="1.1" fill="#e8c393" />
      <ellipse cx="73" cy="47.6" rx="1.5" ry="1.1" fill="#e8c393" />
      <circle cx="68.4" cy="48.2" r="0.7" fill="#241b14" />
      <circle cx="71.6" cy="48.2" r="0.7" fill="#241b14" />
      <path d="M66.8 51.4 Q70 53.6 73.2 51.4" stroke="#241b14" strokeWidth="1.4" fill="none" strokeLinecap="round" />

      {/* choice sparkles */}
      <path d="M18 38 l2.6 4 -2.6 4 -2.6 -4 Z" fill="#d9a13f" />
      <path d="M122 34 l2.2 3.4 -2.2 3.4 -2.2 -3.4 Z" fill="#d9a13f" />
      <circle cx="14" cy="49" r="1.2" fill="#d9a13f" />
      <circle cx="126" cy="46" r="1.4" fill="#d9a13f" />
    </svg>
  );
}

function BookCoverArt({ slug }) {
  if (slug === 'variables') return <VariablesArt />;
  if (slug === 'conditionals') return <ConditionalsArt />;
  return <span className="book-emoji" aria-hidden="true">{TOPIC_EMOJI[slug] || '📖'}</span>;
}

function StoryCard({ story, statusByStory, onStart }) {
  const status = statusFor(story, statusByStory[story.id]);
  const earned = statusByStory[story.id] ? statusByStory[story.id].xp : 0;
  return (
    <article className={`story-card ${status}`}>
      <div className="story-card-top">
        {story.icon === 'crow' ? (
          <span className="story-icon dark" aria-hidden="true">
            <span className="crow-bird">🐦</span>🪨
          </span>
        ) : (
          <span className="story-icon" aria-hidden="true">{ICONS[story.icon] || '📖'}</span>
        )}
        <span className="chip chip-difficulty">{story.difficulty}</span>
      </div>
      <div className="story-card-body">
        <span className="story-concept">{story.concept}</span>
        <h3>{story.title}</h3>
        <p className="story-moral">{story.moral}</p>
      </div>
      <div className="story-card-foot">
        {status === 'complete' ? (
          <>
            <span className="chip chip-pass"><CheckCircle2 size={14} aria-hidden="true" /> Complete</span>
            <button type="button" className="btn btn-ghost" onClick={() => onStart(story)}>
              Revisit <ArrowRight size={16} aria-hidden="true" />
            </button>
          </>
        ) : (
          <>
            <span className="chip">{status === 'in-progress' ? 'In progress' : `+${story.xp + story.projectXp} XP`}</span>
            <button type="button" className="btn btn-primary" onClick={() => onStart(story)}>
              {status === 'in-progress' ? 'Continue' : 'Begin tale'} <Play size={16} aria-hidden="true" />
            </button>
          </>
        )}
        {earned > 0 && <span className="story-earned">+{earned} XP</span>}
      </div>
    </article>
  );
}

function TopicBook({ topic, isOpen, onToggle }) {
  const theme = TOPIC_THEMES[topic.slug] || 'theme-forest';
  const pagesId = `book-pages-${topic.slug}`;
  return (
    <button
      type="button"
      className={`book-cover ${theme}${isOpen ? ' is-open' : ''}`}
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={pagesId}
      aria-label={`${topic.name} story book, ${topic.stories.length} ${topic.stories.length === 1 ? 'tale' : 'tales'}`}
    >
      <span className="book-pages-edge" aria-hidden="true" />
      <span className="book-face">
        <span className="book-frame" aria-hidden="true" />
        <span className="book-spine" aria-hidden="true"><i /><i /></span>
        <span className="book-ornament" aria-hidden="true">✦</span>
        <span className="book-medallion"><BookCoverArt slug={topic.slug} /></span>
        <span className="book-title">{sectionDisplayName(topic)}</span>
        <span className="book-divider" aria-hidden="true"><i /><b>❖</b><i /></span>
        <span className="book-subtitle">{TOPIC_SUBTITLES[topic.slug]}</span>
        <span className="book-foot">
          <span className="book-hint">{isOpen ? 'Tap to close' : 'Tap to open'}</span>
        </span>
      </span>
      <span className="book-notch" aria-hidden="true" />
    </button>
  );
}

export default function StoryMap({ stories, progress, onStart }) {
  const { statusByStory, totalXp, completed, badges } = progress;
  const [openSlug, setOpenSlug] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const topics = [];
  const topicIndex = {};
  stories.forEach((story) => {
    const slug = story.conceptSlug || story.concept.toLowerCase();
    if (!(slug in topicIndex)) {
      topicIndex[slug] = topics.length;
      topics.push({ name: story.concept, slug, stories: [] });
    }
    topics[topicIndex[slug]].stories.push(story);
  });

  const openTopic = openSlug ? topics.find((t) => t.slug === openSlug) : null;

  useEffect(() => {
    if (openSlug) {
      const t = setTimeout(() => setRevealed(true), 30);
      return () => clearTimeout(t);
    }
    setRevealed(false);
  }, [openSlug]);

  function toggleTopic(slug) {
    setOpenSlug((current) => (current === slug ? null : slug));
  }

  function renderPanel(topic) {
    return (
      <div
        id={`book-pages-${topic.slug}`}
        className={`book-pages ${TOPIC_THEMES[topic.slug] || 'theme-forest'}${revealed ? ' is-open' : ''}`}
        role="region"
        aria-label={`${topic.name} tales`}
      >
        <div className="book-pages-inner" inert={revealed ? undefined : ''}>
          <div className="pages-head">
            <span className="pages-kicker">Inside this book</span>
            <h2 className="pages-title">{sectionDisplayName(topic)}</h2>
            <p className="pages-sub">
              {topic.stories.length} {topic.stories.length === 1 ? 'tale' : 'tales'} · {TOPIC_SUBTITLES[topic.slug]}
            </p>
          </div>
          <div className="story-grid">
            {topic.stories.map((story) => (
              <StoryCard key={story.id} story={story} statusByStory={statusByStory} onStart={onStart} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="map" aria-label="Story map">
      <header className="map-hero">
        <div>
          <p className="eyebrow">PyBe presents</p>
          <h1>🐍 Betaal Tales</h1>
          <p className="hero-sub">
            Learn foundational Python through Panchatantra and Jataka stories. After every tale, Betaal asks a
            riddle - answer it, discover the hidden idea, and practice with real code.
          </p>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <strong>{totalXp}</strong>
            <span>XP earned</span>
          </div>
          <div className="stat">
            <strong>{completed}/{stories.length}</strong>
            <span>Tales told</span>
          </div>
        </div>
      </header>

      <div className="progress-strip">
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${stories.length ? (completed / stories.length) * 100 : 0}%` }} />
        </div>
        <span>{completed} of {stories.length} tales complete</span>
      </div>

      {badges.length > 0 && (
        <div className="badge-row" aria-label="Badges earned">
          <Sparkles size={16} aria-hidden="true" />
          {badges.map((badge) => (
            <span key={badge} className="chip chip-badge">{badge}</span>
          ))}
        </div>
      )}

      <div className="topic-library">
        {openTopic ? (
          <div className="book-solo">
            <button type="button" className="btn btn-ghost books-back" onClick={() => setOpenSlug(null)}>
              <ArrowLeft size={16} aria-hidden="true" /> All books
            </button>
            <div className="book-solo-cover">
              <TopicBook
                topic={openTopic}
                isOpen={revealed}
                onToggle={() => setOpenSlug(null)}
              />
            </div>
            {renderPanel(openTopic)}
          </div>
        ) : (
          <div className="book-shelf">
            {topics.map((topic) => (
              <TopicBook
                key={topic.slug}
                topic={topic}
                isOpen={false}
                onToggle={() => toggleTopic(topic.slug)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
