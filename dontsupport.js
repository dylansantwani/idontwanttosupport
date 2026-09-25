(() => {
  "use strict";

  const explicitBypassPhrases = [
    "i don't want to support",
    "i do not want to support",
    "continue without supporting this time",
    "continue without supporting us",
    "continue without disabling",
    "continue with ad blocker",
    "proceed without support"
  ];

  const normalize = (text) => text.replace(/[’‘]/g, "'").replace(/\s+/g, " ").trim().toLowerCase();

  const isVisibleAndEnabled = (element) => {
    const rect = element.getBoundingClientRect();
    return !element.matches(":disabled") &&
      element.getAttribute("aria-disabled")?.toLowerCase() !== "true" &&
      element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) &&
      rect.width > 0 && rect.height > 0;
  };

  const run = () => {
    for (const element of document.querySelectorAll("button, a")) {
      const label = normalize(element.innerText || element.textContent || "");
      if (explicitBypassPhrases.includes(label) && isVisibleAndEnabled(element)) {
        element.click();
        return { status: "clicked", label: element.innerText || element.textContent || "" };
      }
    }
    return { status: "not-found" };
  };

  globalThis.IDontWantToSupport = { explicitBypassPhrases, normalize, run };
  return run();
})();
