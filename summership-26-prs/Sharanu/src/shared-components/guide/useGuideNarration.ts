import { useLocation } from "react-router-dom";
import { NARRATION_BY_ROUTE, DEFAULT_NARRATION } from "../../content/narration";
import { getLessonBySlug } from "../../learning/lessons/registry";

export function useGuideNarration(): string {
  const location = useLocation();
  const { pathname } = location;

  if (NARRATION_BY_ROUTE[pathname]) {
    return NARRATION_BY_ROUTE[pathname];
  }

  const lessonMatch = pathname.match(/^\/lessons\/([^/]+)/);
  if (lessonMatch) {
    const lesson = getLessonBySlug(lessonMatch[1]);
    if (lesson) {
      return `"${lesson.storyTitle}. Let this one settle slowly — there is no rush."`;
    }
  }

  return DEFAULT_NARRATION;
}