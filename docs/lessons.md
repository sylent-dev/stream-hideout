# Lessons

How Claude Code works on this project: the owner's corrections and the practices that proved useful. One line each: its date, the lesson, where it may go (this project, a template, a skill). After the first live, they are sorted into `CLAUDE.md` or the templates.

- 2026-11-14: at the start of a session, when the previous pull request is merged, switch to `main`, pull, and delete the local branch before any work. (This project, a template.)
- 2026-11-14: write the owner's reasons for streaming (fun, community, showcasing a project) at the top of the roadmap: they order the steps. (A template.)
- 2026-11-14: Twitch's help center (`help.twitch.tv`) loads its articles with JavaScript, so an automated reading gets an empty page: ask the owner to open the article, or to copy it into `inputs/`, before quoting a figure from it. (This project, a skill.)
- 2026-11-14: to state what OBS shows (its menus, its encoders, its defaults), read its log (**Help → Log Files**), the locale files of the installed Flatpak and its source at the installed tag, rather than memory: the Simple output mode turned out to have no VA-API entry. (This project, a skill.)
- 2026-11-15: before stating a default of OBS, follow the code to the end: the default value of the « VAAPI Device » field matched none of the entries of its list, so OBS selected the first one, the wrong card, and the guide had promised the right one. (This project, a skill.)
