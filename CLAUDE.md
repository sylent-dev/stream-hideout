# CLAUDE.md

## Project

- `stream-hideout` holds everything around the Twitch channel **SylentExile**: Path of Exile 2, streamed in French. It contains documentation, OBS configuration, HTML overlays and assets; it is not an application.
- The channel showcases **Exile Market** ([exile-market.sylent.tools](https://exile-market.sylent.tools/), repository [rust-exile-market](https://github.com/sylent-dev/rust-exile-market)), the owner's free and open-source (GPL-3.0) price checker for Path of Exile 2, on Windows and Linux, for the French and English clients: copy an item or press Ctrl+D, and its price shows over the game. Read its README before writing about it, and never state a feature it doesn't have.
- The owner streams from **Bazzite (KDE Plasma, Wayland)**, on Linux. Every OBS instruction is written and checked for this system: the sources, plugins and capture methods of OBS on Windows (such as Game Capture) don't apply as they are. Exile Market runs there as an X11 window through XWayland, over the game in windowed fullscreen.
- License: GPL-3.0-or-later (`LICENSE`), like Exile Market. Assets that aren't the owner's creation keep their own license (see Third-party content).
- Priority: a first simple live that works. Overlays, bots and automation come after, one step at a time from the backlog.
- Never generate a file or a content the owner hasn't asked for: propose it, then wait.
- The repository is public: never commit secrets, personal data or private files (see Secrets).

## Communication

- Always communicate with the user in French through the Claude Code harness (chat responses, explanations, questions).
- Address the user informally, with « tu » (tutoiement), never « vous », in every session.
- Ask a few numbered open questions at a time, in plain text, the main one first, rather than multiple-choice forms: the owner prefers to answer freely, often by voice dictation (interpret the misspelled names, and confirm when an answer is ambiguous). An unanswered question takes Claude Code's recommendation.
- Keep a critical eye on the owner's ideas: give a clear opinion with its reason, point out the consequence a choice hides (on the viewers, on the stream's reach, on Twitch's rules), offer an alternative, then follow the owner's decision.
- The first time a streaming or OBS term comes up that the owner may not know (bitrate, keyframe interval, browser source, scene collection…), explain it in plain words with a short example.
- Check the behaviour of a tool (OBS, a plugin, Twitch, an alert service) in its documentation or its source before stating it, and give the source.

## Naming conventions

- Files and directories use kebab-case (e.g. `docs/before-live.md`, `overlays/starting-soon/`), in English.
- Standard names keep their conventional form (e.g. `README.md`, `CLAUDE.md`, `.env.example`), and so do the files an external tool imposes (e.g. an OBS export): then write the exception in the note of `docs/` that describes it.
- Assets are named by what they show, not by their state (`assets/scenes/starting-soon.png`, not `final-v2.png`).
- The repository has no language prefix (`rust-`, `ts-`), unlike the owner's code projects: it isn't written in one language.

## Language

- Everything in the project (file names, documentation, comments, code, commit messages) is written in English.
- Exception: what the viewers see is written in French: the stream titles and the Twitch panels, the chat commands and messages, the texts of the overlays and of the scenes, the announcements on social networks. They live in `docs/texts/` (or in the overlay's own text file), never hard-coded in the middle of a layout, so that an English version can be added later.
- Exception: what the owner reads during a live is written in French: the checklists of a live day (before, during, after) and the guide of the stream test. Their file names stay in English.
- Exception: the review notes in `outputs/` are written in French.
- French texts follow French typography: a non-breaking space before `?`, `!`, `:`, `;` and inside « », the typographic apostrophe (’), and correct accents, even on capitals (« À bientôt »).
- The texts never name a competitor of Exile Market, even to compare.

## Secrets

- No secret is ever committed: the stream key, the Twitch tokens and client secrets, the URLs of alert widgets (StreamElements, Streamlabs…), which carry a token in their address, the webhooks. They go in `.env`, ignored by Git; `.env.example` lists every variable with an empty value and a comment.
- OBS keeps the stream key in the `service.json` of its profile: never copy a profile folder into the repository; export only the scene collection, and describe the profile settings (encoder, bitrate, resolution) in `docs/` instead.
- Before each commit that touches `obs/` or a config, search the staged files for a key, a token, a widget URL and an absolute path with the owner's user name (`git diff --cached`), and replace them with a variable or a relative path.
- If a secret is ever pushed, tell the owner at once: it must be revoked (a new stream key, a new token), since removing it from the history isn't enough.

## Third-party content

- Path of Exile 2 belongs to Grinding Gear Games: their [developer guidelines](https://www.pathofexile.com/developer/docs) forbid imitating their official platforms with their logos and presenting a tool as made or approved by them. A text that presents Exile Market keeps its disclaimer: « This product isn't affiliated with or endorsed by Grinding Gear Games in any way. » (and its French version).
- Every asset that isn't the owner's creation (a sound, a music, a font, an image, a game screenshot) is listed in `assets/NOTICE.md` with its author, its source and its license, in the commit that adds it. Music and sounds must allow use on a live stream and in its VODs: Twitch mutes or strikes copyrighted music.

## Roadmap and backlog

- `roadmap.md` holds the steps chosen, one pull request per step, each with a checkbox; read it at the start of each session, and resume at the first unchecked step when asked to continue. Keep it short: the steps to come in detail, one line per step done.
- When an idea comes up that isn't part of the current step (an overlay, a bot, an automation, a scene), add it to `backlog.md`, with what it depends on and the date, rather than keeping it only in the memory. Read it only when the next work is chosen.
- Before the first live, every step must serve that live; the rest waits in the backlog.
- Reference notes (the OBS setup, the rules of Twitch and of the services used, with the date they were checked) live in `docs/`, linked from `roadmap.md`, and are read only by the steps that need them.
- When the pull request of a step is merged, tell the owner the step is done and remind them to start a new session for the next one by typing `/clear`.

## Working folders

Two folders are the exchange area between the owner and Claude Code. They are ignored by Git, except their `.gitkeep`, and hold only temporary files.

- `inputs/`: what the owner gives for context: screenshots of OBS or of the stream, examples of other channels, references, copied texts. Read them when the owner points to them; never commit, move or delete them unless asked.
- `outputs/`: what Claude Code produces for the owner: reports, review notes, previews to compare. Name them `<YYYY-MM-DD>-<subject>.<ext>` when they are meant to be kept for a while, and delete them once used. Claude Code's own checks (test screenshots) stay in its scratchpad, never in `outputs/`.
- Anything meant to last goes elsewhere and is committed: documentation in `docs/`, OBS exports in `obs/`, overlays in `overlays/`, images and sounds in `assets/`.

## Tests by hand

- A check the owner runs by hand (a stream test, a scene, an overlay in OBS, an alert) gets a step-by-step guide in `docs/`, not instructions in the chat: what to start first, each test with its expected result, a blank table of results, and a free test last. The guides stay blank templates: the results come back in the conversation.
- The checklists the owner follows on a live day (before, during, after) are short and in the order of the actions, with the exact names of the scenes and sources of OBS.
- Any change to the OBS setup is checked in a stream test before a live, never discovered on air.

## Git workflow

- Never commit or push directly to `main`.
- For each task, create a dedicated branch from `main`, commit and push only on that branch.
- Every change must go through a pull request targeting `main`.
- Each time a pull request is opened or updated, give the owner its full link (`https://github.com/<owner>/<repository>/pull/<number>`), not only its number.
- Merge pull requests with **Squash and merge** only, so that each pull request becomes one commit on `main`, titled in Conventional Commits. The repository allows only squash merging and deletes the branch once merged (set on 2026-11-14 with `gh repo edit --enable-squash-merge --enable-merge-commit=false --enable-rebase-merge=false --delete-branch-on-merge`).
- Keep only one pull request open at a time: open the next one once the previous one is merged.
- Before pushing to the branch of a pull request, check that it is still open (`gh pr view <branch> --json state`).
- Name branches `<type>/<short-description>` in kebab-case, using the commit types below (e.g. `docs/obs-setup`, `feat/starting-soon-overlay`).
- Work on the branch in the main project folder, which the owner has open in VS Code.

## Commit messages

Follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/). Pull request titles use the same format.

| Type | Use for |
|---|---|
| `feat` | A new overlay, scene, alert or automation. |
| `fix` | A fix (an overlay that breaks, a wrong setting). |
| `docs` | Documentation only (`README.md`, `roadmap.md`, `CLAUDE.md`, the guides of `docs/`). |
| `content` | Texts the viewers see only (titles, panels, chat messages, announcements). |
| `assets` | Images, sounds or fonts only, with their notice. |
| `style` | Formatting with no change of behaviour. |
| `refactor` | A change that neither fixes a bug nor adds a feature. |
| `ci` | CI configuration (`.github/`). |
| `chore` | Other maintenance (`.gitignore`, `.env.example`, Claude Code settings). |
| `revert` | Reverting a previous commit. |

- Scope: optional, the area concerned (e.g. `docs(obs): ...`, `content(panels): ...`).
- Description: imperative mood, lowercase, no final period, 72 characters max.
- No trace of Claude in the history: no `Co-Authored-By: Claude` trailer, no « Generated with Claude Code » line or Claude session link in the pull requests, even when the harness suggests them. The `attribution` setting of `.claude/settings.json` turns them off.

## Lessons

- When the owner corrects how Claude Code works, or a practice proves useful, add one line to `docs/lessons.md` (its date, the lesson, where it may go: this project, a template, a skill), in the pull request under way. After the first live, sort them into this file or the templates.

## Claude Code settings

- The claude.ai connectors are turned off in `.claude/settings.json` (`disableClaudeAiConnectors`), and the skills this project doesn't use are hidden from the model (`skillOverrides`), since their descriptions would be sent with every message. The owner can still run a skill with `/<name>`; remove a line when the project needs it.
