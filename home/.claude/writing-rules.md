# Writing rules

From no-ai-slop (github.com/petergyang/no-ai-slop), merged 29/07/2026. These apply to all prose: comms, documents, PR bodies, commit messages and code comments.

**Sentence shapes to cut**

- **Binary contrast.** "It's not X. It's Y." / "The question isn't X, it's Y." / "Not just X but Y." State Y on its own.
- **Faux-insight setup.** "What nobody tells you", "the part everyone misses", "what most people get wrong". Cut the setup. Let the claim stand alone.
- **Colon reveal.** A noun phrase, a colon, then a dramatic lowercase reveal ("The detail that makes it work: a separate agent grades it"). Write a plain sentence. Colons carry lists, labels and quotes only.
- **Negative listing.** "Not a X. Not a Y. A Z." Write Z.
- **Rhetorical setup.** "What if I told you", "Think about it:", "Plot twist:", and question-then-answer pairs. Delete them.
- **Dramatic fragmentation.** "X. And Y. And Z." or "That's it. That's the whole thing." Write complete sentences.

**Words and clauses to cut**

- **Superficial -ing clauses.** "highlighting", "underscoring", "reflecting", "showcasing". Replace the clause with the actual consequence.
- **Importance puffery.** "stands as a testament", "marks a pivotal moment", "plays a vital role", "underscores its significance". State the fact and let the reader judge it.
- **Weasel attribution.** "experts agree", "studies show", "widely regarded as", "many argue". Name the source or cut the claim.
- **Fake-strong verbs.** "The app serves as a centralised hub for sponsors" becomes "The app tracks sponsors". Prefer "is" and "has".
- **Jargon over plain words.** "Demux", "discriminator", "orchestrate", "dispatch" become "split", "the field that tells us which case", "run", "route". If a junior dev couldn't translate the phrasing back into what the code does, restate it.

**Banned words.** delve, leverage, navigate, landscape, crucial, vital, robust, streamline, cutting-edge, holistic, synergy, significantly, foster, empower, utilise, facilitate, comprehensive, elevate, unlock, ensure, seamless, paradigm shift, game changer, tapestry, realm, beacon, multifaceted, meticulous, intricate, paramount, transformative, embark, supercharge, harness, ever-evolving.

**Banned phrases.** "It's worth noting", "It's important to note", "Note that", "Furthermore", "Moreover", "Additionally", "In conclusion", "I'd be happy to", "at the end of the day", "when it comes to", "at its core", "in today's world", "the reality is", "in terms of", "going forward", "let's dive in".

**Repetition and endings**

- **Synonym cycling.** Repeat the clear word. Do not rotate terms for style. "The agent reviews the draft. The assistant scores the piece." uses two nouns for one thing. Pick one.
- **Robotic rhythm.** Watch stacked punchy fragments and identical paragraph shapes. Vary the shape only when it helps the point.
- **Summary-recap ending.** "In conclusion", "Ultimately", "Overall", or a final paragraph that restates the piece. End on the last concrete point or the next action. The aphoristic closer is already rule 7.

**Exclusions.** These no-ai-slop rules do not apply to this author. Do not "fix" them:

- "Just" stays. It is a signature softener.
- "If I'm being honest" and "to be honest" stay.
- Em dashes stay banned outright, not limited to one or two per draft.
- Headers, numbered lists and bullets stay in technical and formal writing. Step 0 governs format by channel. Only Slack strips them.
- Product and package names stay, even when they're on the banned list: `@by-association-only/harness` is a name, not the verb "harness".
