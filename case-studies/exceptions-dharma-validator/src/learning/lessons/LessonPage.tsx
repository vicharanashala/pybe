import { useParams, useNavigate } from "react-router-dom";
import { getLessonBySlug } from "./registry";
import LessonLayout from "./LessonLayout";
import { useProgress } from "../../progress/useProgress";

export default function LessonPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { markComplete } = useProgress();
  const lesson = slug ? getLessonBySlug(slug) : undefined;

  if (!lesson) {
    return (
      <div className="text-center text-muted py-20">
        <p>This lesson doesn't exist yet.</p>
      </div>
    );
  }

  return (
    <LessonLayout
      lesson={lesson}
      onComplete={() => {
        markComplete(lesson.slug, lesson.badgeUnlocked);
        navigate("/path");
      }}
    />
  );
}