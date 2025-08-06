export const preventShortcut = (e: KeyboardEvent) => {
  const tag = (e.target as HTMLElement).tagName;
  const isInputField = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement).isContentEditable;

  if (isInputField) return true;
  return false;
};
