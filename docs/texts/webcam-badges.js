// The texts of the badges shown by the webcam of the scene `game`: the mode of the character played,
// one badge per mode (each becomes its own image in OBS). Path of Exile's own abbreviations:
// SC softcore, HC hardcore, SSF solo self-found.
// `mode` sets the color of the badge: the red of hardcore or the blue of softcore.
window.WEBCAM_BADGES = {
  sc: { ssf: null, mode: "SC", hardcore: false },
  ssfSc: { ssf: "SSF", mode: "SC", hardcore: false },
  hc: { ssf: null, mode: "HC", hardcore: true },
  ssfHc: { ssf: "SSF", mode: "HC", hardcore: true },
};
