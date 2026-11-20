// Framer Motion drag points use page coordinates; element bounds use the viewport.
export function pointInElement(point, target, padding = 0) {
  const element = target?.current ?? target;
  if (!element?.getBoundingClientRect) return false;
  const rect = element.getBoundingClientRect();
  const view = element.ownerDocument.defaultView;
  const x = point.x - view.scrollX, y = point.y - view.scrollY;
  return x >= rect.left - padding && x <= rect.right + padding &&
    y >= rect.top - padding && y <= rect.bottom + padding;
}
