import React, { useState } from "react";
import {
  caseKey,
  readProgress,
  saveProgress,
} from "../../../library/learning/core.mjs";
import { cancelPython } from "../../../library/learning/python-client.mjs";
import { GuidedLesson } from "./GuidedLesson.jsx";
export default function CollectionPage({ lesson, onComplete }) {
  const [progress, setProgress] = useState(() =>
    readProgress(localStorage, lesson.collection),
  );
  const [topicId, setTopicId] = useState(lesson.topics[0].topicId),
    [levelId, setLevelId] = useState(null),
    [warning, setWarning] = useState("");
  const topic = lesson.topics.find((item) => item.topicId === topicId),
    level = topic.levels.find((item) => item.levelId === levelId);
  const isDone = (t, l) =>
    l.caseStudies.every((c) => progress.completed.includes(caseKey(t, l, c)));
  const finish = (caseStudy) => {
    const key = caseKey(topic, level, caseStudy);
    const next = { completed: [...new Set([...progress.completed, key])] };
    setProgress(next);
    if (!saveProgress(localStorage, lesson.collection, next))
      setWarning(
        "Browser storage is unavailable. Progress is kept for this visit only.",
      );
    if (
      lesson.topics.every((t) =>
        t.levels.every((l) =>
          l.caseStudies.every((c) => next.completed.includes(caseKey(t, l, c))),
        ),
      )
    )
      onComplete?.();
  };
  return (
    <div className="lesson-workspace">
      {warning && <p role="status">{warning}</p>}
      {level ? (
        <>
          <button
            className="lesson-back"
            onClick={() => {
              cancelPython();
              setLevelId(null);
            }}
          >
            ← Lesson outline
          </button>
          <h2>{level.title}</h2>
          <GuidedLesson
            key={`${topicId}/${levelId}`}
            levelData={level}
            initialCaseIndex={Math.max(
              0,
              level.caseStudies.findIndex(
                (c) => !progress.completed.includes(caseKey(topic, level, c)),
              ),
            )}
            inspectVariables={lesson.inspectVariables}
            reasoningDelay={lesson.reasoningDelay}
            onFinish={finish}
            onBack={() => setLevelId(null)}
          />
        </>
      ) : (
        <>
          <p className="lesson-intro">
            Read the situation, reason through it, then build and run the
            Python. Your place in the collection is saved in this browser.
          </p>
          <label className="lesson-topic">
            Choose a topic
            <select
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
            >
              {lesson.topics.map((t) => (
                <option key={t.topicId} value={t.topicId}>
                  {t.topicName}
                </option>
              ))}
            </select>
          </label>
          <div className="lesson-outline">
            {topic.levels.map((item, index) => {
              const complete = isDone(topic, item),
                unlocked =
                  index === 0 || isDone(topic, topic.levels[index - 1]);
              return (
                <button
                  className="lesson-outline-item"
                  key={item.levelId}
                  disabled={!unlocked}
                  onClick={() => setLevelId(item.levelId)}
                >
                  <span>{item.title}</span>
                  <small>
                    {complete
                      ? "Completed — revisit"
                      : unlocked
                        ? `${item.caseStudies.length} ${item.caseStudies.length === 1 ? "case" : "cases"} · Reason → Reveal → Build`
                        : "Complete the previous part to continue"}
                  </small>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
