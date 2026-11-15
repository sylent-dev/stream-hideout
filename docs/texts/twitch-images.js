// The texts drawn on the offline image and the profile banner of the Twitch channel, in French
// (see twitch-channel.md). The link of Exile Market and its disclaimer come from
// overlays/screens/texts.js (end), so that they never differ from the scene « Fin ».
// The banner chosen (10) shows the SYLENT logo (assets/logos/sylent-wordmark.png) instead of a name.
// The last word of a title is drawn in red, as on the scenes « Pause » and « Fin ».
window.CHANNEL_IMAGE_TEXTS = {
  offline: {
    title: "Sylent est hors ligne",
    subtitle: "Il farme dans l’ombre…",
    // The large word a lightning reveals behind the title, one per proposal.
    ghosts: { shadow: "OMBRE", offline: "HORS LIGNE" },
  },
  banner: {
    name: "SylentExile",
    game: "Path of Exile 2 en français",
    mood: "Chill, craft et price check",
    // The subtitle of the banner chosen on 2026-11-15: not tied to one game.
    tagline: "Chill et craft",
    ghost: "EXILE",
  },
};
