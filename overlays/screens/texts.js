// The texts the viewers see on the scenes « Pause » and « Fin », in French.
// Each page fills its elements from the key in their data-text attribute; the last word of a
// title (data-signal-end) is drawn in red. " " is a non-breaking space, required before
// « ! », « ? », « : » and « ; ».
window.TEXTS = {
  pause: {
    // The large word a lightning reveals behind the title, now and then.
    ghost: "PAUSE",
    title: "Petite pause",
    subtitle: "La pluie bat fort, attendons qu’elle se calme",
  },
  end: {
    ghost: "MERCI",
    title: "Merci d’avoir regardé !",
    subtitle: "À très bientôt",
    link: "exile-market.sylent.tools",
    disclaimer:
      "Ce produit n’est ni affilié à Grinding Gear Games ni approuvé par ce studio, de quelque manière que ce soit.",
  },
};
