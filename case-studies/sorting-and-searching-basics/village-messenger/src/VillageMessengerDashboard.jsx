import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Compass,
  Home,
  KeyRound,
  Lock,
  MapPin,
  MessageCircle,
  Sparkles,
  Users,
} from 'lucide-react';
import './village-dashboard.css';

const dashboardScenes = [
  { id: 1, phase: 'Story', title: 'The Morning Delivery', description: 'Meet the messenger and discover the village problem.', icon: '🌅' },
  { id: 2, phase: 'Observe', title: 'The Village Record', description: 'Explore how names and houses are connected.', icon: '📖' },
  { id: 3, phase: 'Think', title: "The Chief's Question", description: 'Reason about how the messenger finds an address.', icon: '🧠' },
  { id: 4, phase: 'Discover', title: 'The Hidden Pattern', description: 'Reveal the relationship hiding inside the delivery book.', icon: '🔎' },
  { id: 5, phase: 'Reveal', title: 'Give It a Name', description: 'The story pattern finally gets its Python name.', icon: '💡' },
  { id: 6, phase: 'Build', title: 'A New Villager Arrives', description: 'Use the new idea to add Riya to the village book.', icon: '🏠' },
  { id: 7, phase: 'Reason', title: 'The Missing Name', description: 'Decide what should happen when a person is not recorded.', icon: '❓' },
  { id: 8, phase: 'Code', title: 'Rebuild the Delivery Book', description: 'Write the Python solution yourself.', icon: '⌨️' },
  { id: 9, phase: 'Transfer', title: 'A Different Book, Same Idea', description: 'Carry the idea into a new everyday situation.', icon: '🔁' },
  { id: 10, phase: 'Reflect', title: "The Messenger's Lesson", description: 'Put the hidden idea into your own words.', icon: '🌱' },
];

function VillageDashboardArt() {
  return (
    <div className="vmd-village-art" aria-hidden="true">
      <div className="vmd-sun" />
      <div className="vmd-cloud vmd-cloud-a" />
      <div className="vmd-cloud vmd-cloud-b" />
      <div className="vmd-hill vmd-hill-a" />
      <div className="vmd-hill vmd-hill-b" />
      <div className="vmd-ground" />

      <div className="vmd-tree vmd-tree-a"><i /><span /></div>
      <div className="vmd-tree vmd-tree-b"><i /><span /></div>
      <div className="vmd-tree vmd-tree-c"><i /><span /></div>

      <div className="vmd-house vmd-house-a">
        <div className="roof" />
        <div className="body"><span className="door" /><span className="window" /></div>
        <b>12</b>
      </div>
      <div className="vmd-house vmd-house-b">
        <div className="roof" />
        <div className="body"><span className="door" /><span className="window" /></div>
        <b>27</b>
      </div>
      <div className="vmd-house vmd-house-c">
        <div className="roof" />
        <div className="body"><span className="door" /><span className="window" /></div>
        <b>41</b>
      </div>

      <div className="vmd-road" />
      <div className="vmd-messenger">
        <div className="head" />
        <div className="body" />
        <div className="bag">✉</div>
      </div>

      <div className="vmd-tag vmd-tag-a"><Users size={14} /> Aarav</div>
      <div className="vmd-tag vmd-tag-b"><Users size={14} /> Meera</div>
      <div className="vmd-tag vmd-tag-c"><Users size={14} /> Kabir</div>

      <div className="vmd-route">
        <span>👤</span><i /><span>🏠</span>
      </div>
    </div>
  );
}

export default function VillageMessengerDashboard({ onStartStory, onBackToDashboard, completedScenes = [] }) {
  const completedCount = completedScenes.length;
  const progress = Math.round((completedCount / dashboardScenes.length) * 100);
  const currentScene = Math.min(completedCount + 1, dashboardScenes.length);

  return (
    <main className="vmd-page">
      <div className="vmd-orb vmd-orb-one" />
      <div className="vmd-orb vmd-orb-two" />

      <header className="vmd-topbar">
        <button className="vmd-back" onClick={onBackToDashboard}>
          <Home size={17} />
          PyBe Dashboard
        </button>

        <div className="vmd-brand">
          <div className="vmd-brand-icon"><Compass size={18} /></div>
          <div>
            <strong>PyBe</strong>
            <span>Story-first Python learning</span>
          </div>
        </div>

        <div className="vmd-progress-mini">
          <span>{completedCount}/{dashboardScenes.length} scenes</span>
          <div><i style={{ width: `${progress}%` }} /></div>
        </div>
      </header>

      <section className="vmd-shell">
        <section className="vmd-hero">
          <div className="vmd-hero-copy">
            <span className="vmd-pill"><Sparkles size={14} /> A PyBe Story Experience</span>
            <span className="vmd-kicker">THE VILLAGE MESSENGER</span>
            <h1>Deliver the letters.<br /><em>Discover the idea.</em></h1>
            <p className="vmd-lead">
              You are a new messenger in Chandrapur. A simple delivery job will lead you toward a hidden Python idea — but the story comes first.
            </p>

            <div className="vmd-story-card">
              <MessageCircle size={19} />
              <div>
                <strong>Chief Raman</strong>
                <p>“You do not need to memorize the village. Learn how one clue helps you find another.”</p>
              </div>
            </div>

            <div className="vmd-stats">
              <div><strong>10</strong><span>Story scenes</span></div>
              <div><strong>1</strong><span>Hidden idea</span></div>
              <div><strong>∞</strong><span>Ways to apply it</span></div>
            </div>

            <button className="vmd-start" onClick={onStartStory}>
              {completedCount > 0 ? 'Continue the story' : 'Enter Chandrapur'}
              <ArrowRight size={20} />
            </button>

            <p className="vmd-note">
              <BookOpen size={15} /> No Python terminology is needed at the beginning.
            </p>
          </div>

          <div className="vmd-hero-visual">
            <VillageDashboardArt />
            <div className="vmd-visual-note vmd-note-book">
              <BookOpen size={15} />
              <span>Village Delivery Book</span>
            </div>
            <div className="vmd-visual-note vmd-note-key">
              <KeyRound size={15} />
              <span>Name → House</span>
            </div>
            <div className="vmd-visual-note vmd-note-place">
              <MapPin size={15} />
              <span>Chandrapur</span>
            </div>
          </div>
        </section>

        <section className="vmd-map-section">
          <div className="vmd-section-head">
            <div>
              <span className="vmd-kicker">YOUR STORY MAP</span>
              <h2>Follow the messenger's journey</h2>
              <p>Each scene reveals one more piece of the pattern. Later scenes unlock through your progress.</p>
            </div>
            <div className="vmd-current-card">
              <span>Current scene</span>
              <strong>0{Math.min(currentScene, 9)} / 10</strong>
              <small>{dashboardScenes[currentScene - 1].title}</small>
            </div>
          </div>

          <div className="vmd-map-line" />
          <div className="vmd-scenes">
            {dashboardScenes.map((item, index) => {
              const done = completedScenes.includes(item.id);
              const unlocked = item.id === 1 || completedScenes.includes(item.id - 1);
              const active = item.id === currentScene;

              return (
                <article
                  key={item.id}
                  className={`vmd-scene-card ${done ? 'done' : ''} ${active ? 'active' : ''} ${!unlocked ? 'locked' : ''}`}
                  onClick={() => unlocked && onStartStory?.(item.id)}
                >
                  <div className="vmd-scene-top">
                    <span className="vmd-scene-number">
                      {done ? <Check size={15} /> : !unlocked ? <Lock size={14} /> : `0${item.id}`}
                    </span>
                    <span className="vmd-scene-phase">{item.phase}</span>
                  </div>
                  <div className="vmd-scene-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="vmd-scene-foot">
                    {done ? <span className="vmd-done">Completed</span> : !unlocked ? <span className="vmd-locked">Locked</span> : <span>Enter scene</span>}
                    {unlocked && <ChevronRight size={16} />}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="vmd-concept-banner">
          <div>
            <span className="vmd-kicker">THE RULE OF THIS STORY</span>
            <h2>Story first. Python second.</h2>
            <p>
              You will not begin by memorizing a definition. You will first notice a relationship in the village, reason about it, and then discover the Python structure that represents it.
            </p>
          </div>
          <div className="vmd-rule-visual">
            <span>👤 Person</span>
            <b>→</b>
            <span>🏠 House</span>
            <small><KeyRound size={14} /> one clue finds its match</small>
          </div>
        </section>
      </section>
    </main>
  );
}
