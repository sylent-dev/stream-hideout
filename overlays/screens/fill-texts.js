// Fills every element that has a data-text attribute ("end.title") with the matching text of
// texts.js. With data-signal-end, the last word and the punctuation after it go in a span of the
// signal color (« Petite pause », « Merci d’avoir regardé ! »).
const textOf = key => key.split(".").reduce((texts, part) => (texts ? texts[part] : undefined), window.TEXTS) ?? "";

for (const element of document.querySelectorAll("[data-text]")) {
  const text = textOf(element.dataset.text);
  if (!("signalEnd" in element.dataset)) {
    element.textContent = text;
    continue;
  }
  // The last ordinary space: a non-breaking space before « ! » stays with its word.
  const cut = text.lastIndexOf(" ") + 1;
  const end = document.createElement("span");
  end.className = "is-signal";
  end.textContent = text.slice(cut);
  element.replaceChildren(text.slice(0, cut), end);
}
