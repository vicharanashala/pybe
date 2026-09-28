import { describe, it, expect } from 'vitest';
import {
  INITIAL_FARM,
  farmReducer,
  isChapterUnlocked,
  levelForXp,
  nextChapterId,
} from '../farmState';

describe('initial farm', () => {
  it('matches the MVP starting values', () => {
    expect(INITIAL_FARM).toMatchObject({
      coins: 100,
      seeds: 20,
      water: 50,
      xp: 0,
      level: 1,
      weather: 'sunny',
      currentChapter: 1,
      completedMissions: [],
    });
  });
});

describe('XP and levels', () => {
  it('awards Chapter 1 XP', () => {
    const next = farmReducer(INITIAL_FARM, { type: 'COMPLETE_MISSION', missionId: 'ch1-seeds', xp: 50 });
    expect(next.xp).toBe(50);
    expect(next.completedMissions).toEqual(['ch1-seeds']);
  });

  it('reaches 125 XP across both chapters', () => {
    let s = farmReducer(INITIAL_FARM, { type: 'COMPLETE_MISSION', missionId: 'ch1-seeds', xp: 50 });
    s = farmReducer(s, { type: 'COMPLETE_MISSION', missionId: 'ch2-weather', xp: 75 });
    expect(s.xp).toBe(125);
    expect(s.completedMissions).toEqual(['ch1-seeds', 'ch2-weather']);
  });

  it('does not award the same mission twice', () => {
    let s = farmReducer(INITIAL_FARM, { type: 'COMPLETE_MISSION', missionId: 'ch1-seeds', xp: 50 });
    s = farmReducer(s, { type: 'COMPLETE_MISSION', missionId: 'ch1-seeds', xp: 50 });
    expect(s.xp).toBe(50);
    expect(s.completedMissions).toEqual(['ch1-seeds']);
  });

  it('derives level from XP', () => {
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(50)).toBe(1);
    expect(levelForXp(125)).toBe(2);
  });
});

describe('chapter unlocking', () => {
  it('starts with Chapter 1 open and Chapter 2 locked', () => {
    expect(isChapterUnlocked(1, [])).toBe(true);
    expect(isChapterUnlocked(2, [])).toBe(false);
  });

  it('opens Chapter 2 once Chapter 1 is complete', () => {
    expect(isChapterUnlocked(2, ['ch1-seeds'])).toBe(true);
  });

  it('rejects an unknown chapter', () => {
    expect(isChapterUnlocked(9, ['ch1-seeds', 'ch2-weather'])).toBe(false);
  });

  it('knows what comes next, and that Chapter 2 ends the MVP', () => {
    expect(nextChapterId(1)).toBe(2);
    expect(nextChapterId(2)).toBeNull();
  });

  it('refuses to open a locked chapter', () => {
    const s = farmReducer(INITIAL_FARM, { type: 'OPEN_CHAPTER', chapterId: 2 });
    expect(s.currentChapter).toBe(1);
  });

  it('opens an unlocked chapter', () => {
    const done = farmReducer(INITIAL_FARM, { type: 'COMPLETE_MISSION', missionId: 'ch1-seeds', xp: 50 });
    expect(farmReducer(done, { type: 'OPEN_CHAPTER', chapterId: 2 }).currentChapter).toBe(2);
  });
});

describe('farm patches', () => {
  it('applies what the learner\'s code actually did', () => {
    const s = farmReducer(INITIAL_FARM, { type: 'APPLY_FARM_PATCH', patch: { seeds: 30 } });
    expect(s.seeds).toBe(30);
    expect(s.coins).toBe(100);
  });

  it('sets the weather', () => {
    expect(farmReducer(INITIAL_FARM, { type: 'SET_WEATHER', weather: 'rain' }).weather).toBe('rain');
  });

  it('resets to the starting farm', () => {
    const s = farmReducer({ ...INITIAL_FARM, xp: 125, seeds: 30 }, { type: 'RESET' });
    expect(s).toEqual(INITIAL_FARM);
  });
});

describe('restoring saved progress (refresh behaviour)', () => {
  it('brings back XP and completions, and recomputes level', () => {
    const s = farmReducer(INITIAL_FARM, {
      type: 'RESTORE',
      farm: { xp: 125, completedMissions: ['ch1-seeds', 'ch2-weather'] },
    });
    expect(s.xp).toBe(125);
    expect(s.level).toBe(2);
    expect(isChapterUnlocked(2, s.completedMissions)).toBe(true);
  });

  it('starts the farm resources fresh even when progress is restored', () => {
    const s = farmReducer(INITIAL_FARM, { type: 'RESTORE', farm: { xp: 50, completedMissions: ['ch1-seeds'] } });
    expect(s.seeds).toBe(20);
    expect(s.water).toBe(50);
  });

  it('tolerates an empty restore', () => {
    expect(farmReducer(INITIAL_FARM, { type: 'RESTORE', farm: {} })).toEqual(INITIAL_FARM);
  });
});

describe('unknown actions', () => {
  it('leaves state untouched', () => {
    expect(farmReducer(INITIAL_FARM, { type: 'NOPE' })).toBe(INITIAL_FARM);
  });
});
