# Lessons

How Claude Code works on this project: the owner's corrections and the practices that proved useful. One line each: its date, the lesson, where it may go (this project, a template, a skill). After the first live, they are sorted into `CLAUDE.md` or the templates.

- 2026-11-14: at the start of a session, when the previous pull request is merged, switch to `main`, pull, and delete the local branch before any work. (This project, a template.)
- 2026-11-14: write the owner's reasons for streaming (fun, community, showcasing a project) at the top of the roadmap: they order the steps. (A template.)
- 2026-11-14: Twitch's help center (`help.twitch.tv`) loads its articles with JavaScript, so an automated reading gets an empty page: ask the owner to open the article, or to copy it into `inputs/`, before quoting a figure from it. (This project, a skill.)
- 2026-11-14: to state what OBS shows (its menus, its encoders, its defaults), read its log (**Help → Log Files**), the locale files of the installed Flatpak and its source at the installed tag, rather than memory: the Simple output mode turned out to have no VA-API entry. (This project, a skill.)
- 2026-11-15: before stating a default of OBS, follow the code to the end: the default value of the « VAAPI Device » field matched none of the entries of its list, so OBS selected the first one, the wrong card, and the guide had promised the right one. (This project, a skill.)
- 2026-11-15: when the owner has to act (a setting, a button to click), give a numbered procedure with the exact place of each element (menu, column, box, button), rather than questions or a list of names; ask a question only for a choice. (This project, a template.)
- 2026-11-15: before announcing a button of OBS, check in its source whether it depends on the platform: under Wayland, OBS offers no « Connect Account » for Twitch. (This project, a skill.)
- 2026-11-15: when the owner can't find an element on screen, ask for a screenshot in `inputs/` at once rather than a description: it showed the empty place of the stream key line, which closing and opening the settings again brought back. (This project, a template.)
- 2026-11-15: before proposing filters for a sound problem, read the scene collection (global devices, sources, their `mixers`) and measure each track of a recording with `ffmpeg`: the microphone turned out to be captured twice, and every source was on every track. (This project, a skill.)
