// Every personalizable string lives here, named, with a PLACEHOLDER marker
// describing what real content should replace it. No command or renderer
// call should ever inline literal user-facing prose -- always import from
// here, so a future editing pass has exactly one file to open.
//
// More constants will be added here in the fast-follow pass (CatOS custom
// commands, fortune/catsay lines, easter egg copy, etc.).

// big ASCII wordmark printed once, at initial page boot (before login/prompt).
export const CATOS_BANNER = ` ██████╗ █████╗ ████████╗ ██████╗ ███████╗
██╔════╝██╔══██╗╚══██╔══╝██╔═══██╗██╔════╝
██║     ███████║   ██║   ██║   ██║███████╗
██║     ██╔══██║   ██║   ██║   ██║╚════██║
╚██████╗██║  ██║   ██║   ╚██████╔╝███████║
 ╚═════╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚══════╝`;

// body text of /home/hitanshu/README.md
export const README_CONTENT = `Hey Hitanshu,

If you're reading this, congratulations.
You've already done what every software engineer does first:
ignore the UI and open the README.

Welcome to CatOS.

This operating system was built specifically for one certified Orange Cat.
You'll probably find missing brain cells, questionable engineering decisions,
and a few surprises hidden around the filesystem.

Nothing here is random.
Keep exploring.

P.S. If you somehow manage to break CatOS...
that just means you're using it correctly.
`;

// boot log printed before the loading bars.
export const BIRTHDAY_BOOT_LOG = `CatOS Birthday Subsystem v28.0
Copyright (c) Kruti Labs

Initializing Birthday Runtime...

[ OK ] Mounting /home/hitanshu
[ OK ] Loading orange_cat.kernel
[ OK ] Starting whisker.service
[ OK ] Connecting to Shared Brain Cell Network...
[WARN] Shared Brain Cell currently occupied by another orange cat.
[ OK ] Falling back to local cache.

[ OK ] Restoring archived memories
[ OK ] Verifying recipient identity
[PASS] Birthday confirmed.

Preparing celebration environment...`;

// boot log printed after the loading bars, before the heartfelt message.
export const BIRTHDAY_LAUNCH_LOG = `No errors detected.
No warnings that matter.

Launching celebration...`;

// loading-bar labels, dot-padded to align with the progress bar.
export const LOADING_STEPS = [
  { label: "Preparing cake................." },
  { label: "Inflating balloons............." },
  { label: "Summoning orange cats.........." },
  { label: "Restoring archived memories...." },
  { label: "Loading birthday wishes........" },
  { label: "Allocating joy................." },
];

// printed instantly before the heartfelt message, framing it as a protected
// file being decrypted and cat'd from the filesystem.
export const MESSAGE_ACCESS_LOG = `[ OK ] Access granted.

File        : birthday_2026.txt
Owner       : Kruti
Recipient   : Hitanshu
Permissions : r--------
Encoding    : UTF-8
Size        : 1 heartfelt message

------------------------------------------------------------

[ OK ] Decrypting protected message...
[ OK ] Opening /home/hitanshu/.messages/birthday.txt

------------------------------------------------------------
$ cat /home/hitanshu/.messages/birthday.txt
------------------------------------------------------------

To      : Hitanshu Shah
From    : Kruti
Priority: ❤️
Status  : Successfully Delivered

<Begin Birthday Message>`;

// printed instantly after the heartfelt message finishes typing.
export const MESSAGE_FOOTER_LOG = `<End Birthday Message>

------------------------------------------------------------
EOF
------------------------------------------------------------`;

// the heartfelt birthday message -- the emotional core of the whole project.
export const HEARTFELT_MESSAGE = `Hey you, my orange cat. 🧡

I hope you enjoyed this little operating system. There's still a lot more to
explore... but I'll let you find those yourself. 😉

More than anything, I just hope this made you smile.

You have no idea how grateful I am to have you in my life. Thank you for
being you. Just like an orange cat. carefree, fun, and completely
unapologetically yourself. I really hope you never lose that part of you.

I can't wait to start this new chapter of life with you. Knowing that I get
to have you by my side makes me happier than I can put into words.

I can't wait to make many more memories with you, one adventure, one laugh,
and one orange cat at a time.

Happy Birthday, my orange cat. ❤️

Love,
Kruti`;

// content of the file written to the filesystem after birthday.exe completes.
export const COMPLETION_FLAG_CONTENT = `============================================================
CatOS Birthday Completion Certificate
============================================================

Execution Status : SUCCESS
Program          : birthday.exe
Exit Code        : ❤️

Subject          : Hitanshu
Classification   : Certified Orange Cat
Certification ID : CAT-2026-HBD

Diagnostic Summary

✔ Sense of Humour      : Excellent
✔ Kindness             : Excellent
✔ Curiosity            : Excellent
✔ Chaos Level          : Acceptable
✔ Birthday Celebrated  : Successfully

Brain Cell Status

Still shared.
Still missing.
Still adorable.

------------------------------------------------------------

Thank you for exploring CatOS.

Some gifts are opened once.
Some are explored.

This one was meant to be explored.

Happy Birthday.

— Kruti

============================================================
`;

// `whoami` output. The shell's real username (shell.user) still drives the
// prompt ("hitanshu@catos:~$") -- only what `whoami` prints is overridden.
export const WHOAMI_RESPONSE = "orange cat";

// help command flavor/tone text -- the command list itself is real/mechanical.
export const HELP_TEXT = `Welcome to CatOS.

This system behaves a lot like Linux...
until it doesn't.

Start with familiar commands.

Curiosity is rewarded.`;

// ---------------------------------------------------------------------------
// Hidden commands (never listed in help, never autocompleted -- see
// terminal/commands.js's HIDDEN / HIDDEN_ANIMATED tables).
// ---------------------------------------------------------------------------

// `cat` with no arguments.
export const CAT_NO_ARG_LINES = ["Usage: cat <file>", "", "The cat stares at you expectantly."];

// random pool for `meow`.
export const MEOW_RESPONSES = ["Meow.", "Meow meow.", "The cat approves.", "Purr..."];

// static output for `purr`.
export const PURR_LINES = ["Purring at maximum efficiency...", "", "System happiness increased."];

// fixed lead-in line for `pspsps`.
export const PSPSPS_INTRO = "Attempting to summon Orange...";

// random pool for `pspsps`.
export const PSPSPS_RESPONSES = [
  "Orange ignored you.",
  "Tiny footsteps approach...",
  "Orange accepted your invitation.",
  "Orange is currently busy sleeping.",
];

// bookend lines for `treat`.
export const TREAT_INTRO = "Dispensing treats...";
export const TREAT_OUTRO = "Orange is pleased.";

// sprite + pointer character used by `laser`.
export const LASER_CAT_SPRITE = "=^..^=";
export const LASER_DOT = "•";

// sprite + trail character used by `zoomies`.
export const ZOOMIES_CAT_SPRITE = "=^..^=";
export const PAW_PRINT_CHAR = "·";

// sequential ASCII frames for `kiss`, printed one at a time with a pause
// between each -- the last frame is the final resting line.
export const KISS_FRAMES = [
  `  /\\_/\\
 ( ^.^ )  *blushes*
  > ~ <`,
  `  /\\_/\\
 ( -.-)~  *hides behind tail*
    ~~~`,
  `   .../\\_/\\
  ...( o.o )  *peeks out*`,
  `(///>ᴗ<///)`,
];

// random pool mixing real cat facts, orange-cat jokes, and CatOS humor.
export const CATFACTS = [
  "Cats spend about 70% of their lives asleep.",
  "A group of cats is called a clowder.",
  "Orange cats are statistically more likely to be food-motivated. Source: this specific orange cat.",
  "Cats can rotate their ears 180 degrees.",
  "CatOS has zero known bugs. All reported issues are undocumented features.",
  "A cat's purr vibrates at a frequency that can promote healing.",
  "Orange cats share one brain cell between all of them. It is currently in use.",
  "Cats have a third eyelid called a nictitating membrane.",
  "This terminal was tested exclusively on one (1) orange cat. It approved.",
  "A cat's nose print is unique, just like a human fingerprint.",
  "Orange cats are not a breed. They are a lifestyle.",
  "Cats can't taste sweetness.",
  "CatOS uptime is measured in naps, not days.",
];

// random pool for `love` -- 20-30 unique reasons.
export const LOVE_MESSAGES = [
  "Because you make people feel safe.",
  "Because your curiosity is contagious.",
  "Because you always show up when it matters.",
  "Because someone spent weeks building CatOS just for you.",
  "Because you're wonderfully, unapologetically yourself.",
  "Because your laugh makes bad days better.",
  "Because you notice the little things.",
  "Because you make hard problems feel solvable.",
  "Because you're kind even when no one's watching.",
  "Because you ask good questions.",
  "Because you remember what people care about.",
  "Because you make everyone around you a little braver.",
  "Because you never stop learning.",
  "Because your patience is a superpower.",
  "Because you say what you mean.",
  "Because you make ordinary days feel a little special.",
  "Because you give better hugs than most people.",
  "Because you're stubborn in all the right ways.",
  "Because you take care of the people you love.",
  "Because you're still exploring this terminal instead of stopping here.",
  "Because you make people want to be better.",
  "Because you're exactly the kind of person worth building something for.",
  "Because your weird sense of humor is one of your best qualities.",
  "Because you deserve this much attention to detail.",
];

// static line for `make_me_happy`.
export const MAKE_ME_HAPPY_LINE = "Already completed ❤️";

// static profile block for `kruti`.
export const KRUTI_PROFILE = [
  "User Profile",
  "──────────────────────────────────────",
  "",
  "Name            : Kruti",
  "Role            : Favorite Human",
  "Status          : Connected",
  "Relationship    : Fiancée",
  "Trust Level     : ██████████ 100%",
  "Hug Access      : Unlimited",
  "Lifetime Plan   : Accepted",
  "Favorite Orange : Hitanshu",
  "",
  "System Note:",
  '"Primary maintainer of CatOS and your biggest supporter."',
  "",
  "Access granted.",
];

// static fake profile block for `hitanshu`.
export const HITANSHU_PROFILE = [
  "User Profile",
  "──────────────────────────────────────",
  "",
  "Name            : Hitanshu Shah",
  "Role            : Software Engineer",
  "Status          : Online",
  "Curiosity       : ██████████ 100%",
  "Kindness        : ██████████ 100%",
  "Humor           : █████████░ 96%",
  "Orange Cat Mode : ENABLED",
  "Favorite Human  : Kruti",
  "Birthday Mode   : ACTIVE",
  "",
  "Profile checksum verified.",
];

// static output for `hug`.
export const HUG_LINES = ["*hug received*", "", "System warmth increased."];

// static line for `smile`.
export const SMILE_LINE = "Mission accomplished :)";

// random pool of ASCII poses for `orange` (each entry is a multi-line block).
export const ORANGE_POSES = [
  `    zzz
  (-.-)
  ( : )
 /     \\`,
  `  ( o.o )
 (       )
  ~~~~~~~
  [ loaf mode engaged ]`,
  `  /\\_/\\
 (  o.o  )~~~~
  \\  Y  /
   "  "
  [ stretching intensifies ]`,
  `   /\\_/\\
  ( o.o )
  (") (")`,
  `   /\\_/\\
  ( -.- )  judging you silently
   >   <`,
];
