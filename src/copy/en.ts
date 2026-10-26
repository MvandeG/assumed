// All user-facing strings. A Dutch file can mirror this shape later.

export const en = {
  appName: 'Assumed',

  common: {
    back: 'Back',
    cancel: 'Cancel',
    next: 'Next',
    done: 'Done',
    save: 'Save',
    thisIsIt: 'This is it',
    menu: 'Menu',
    close: 'Close',
  },

  modes: {
    scene: {
      name: 'Scene',
      placeholder: "Anna hugs me and says: I knew you'd get it.",
      bedtime:
        'When you feel heavy and drowsy, step into your scene. Let it play until you drift off.',
      doubt: 'Run it once in your mind.',
      switchTo: 'Switch to scene mode',
      kept: 'Your phrase is kept. Write a scene to use in scene mode.',
    },
    phrase: {
      name: 'Phrase',
      placeholder: "Every day, in every way, I'm getting better and better.",
      bedtime:
        'When you feel heavy and drowsy, repeat your phrase softly, about 20 times, like a lullaby. No effort.',
      doubt: 'Say it once, softly.',
      switchTo: 'Switch to phrase mode',
      kept: 'Your scene is kept. Write a phrase to use in phrase mode.',
    },
  },

  onboarding: {
    welcome: {
      title: "Assume it's done. Then leave it alone.",
      body: 'A short practice for bedtime. Nothing to track, nothing to keep up with.',
      button: 'Begin',
    },
    how: {
      lines: [
        'At night, relax the way you like.',
        "When you're drowsy, hold one thing in mind as if it's already true.",
        "When doubt shows up, return to it once. That's all.",
      ],
      button: 'Okay',
    },
    choose: {
      title: 'Choose a way.',
      scene: 'Imagine a moment that proves it already happened.',
      phrase: 'Repeat a simple sentence, softly, without effort.',
      note: 'Not sure? Pick the one that sounds easier. You can switch anytime.',
    },
    name: {
      title: 'What do you want?',
      body: 'A few words, just for you.',
      placeholder: 'The new job',
    },
    reminder: {
      title: 'Want a reminder at bedtime?',
      timeLabel: 'Bedtime',
      add: 'Add to my calendar',
      skip: 'No thanks',
    },
    install: {
      title: 'Add Assumed to your home screen so it’s one tap away at night.',
      ios: ['Tap the Share button in Safari.', 'Choose Add to Home Screen.'],
      android: ['Open the browser menu.', 'Choose Install app or Add to Home screen.'],
      other: ['Open your browser menu.', 'Choose Install or Add to Home screen.'],
      done: 'Done',
      later: 'Later',
    },
    ready: {
      title: "That's it. Tonight, open the app in bed and press Begin.",
      button: 'Go to home',
    },
  },

  sceneWriter: {
    step1: "Picture a moment that could only happen if it were already true. Where are you, and who's there?",
    step1Example: 'At dinner with Anna, celebrating.',
    step2: 'What do you hear or feel in that moment? A sentence someone says, a touch, a sound.',
    step2Example: "She hugs me and says: I knew you'd get it.",
    step3: "Here's your scene. Keep it short enough to replay in a few seconds.",
  },

  phraseWriter: {
    prompt: "Write a short sentence as if it's already true. Simple words.",
    coueChip: "Use Coué's original",
    coue: 'Every day, in every way, I’m getting better and better.',
  },

  hints: {
    future: 'Try writing it as if it already happened.',
    negation: "Say what you want, rather than what you don't.",
    length: 'Shorter is easier to hold.',
  },

  home: {
    begin: 'Begin',
    doubt: 'Feeling doubt?',
    allSealed: "It's done. Nothing to do.",
    startNew: 'Start something new',
    sealFirst: 'Seal the current one first?',
    sealIt: 'Seal it',
    menuTools: 'Tools',
    menuHow: 'How this works',
    menuSettings: 'Settings',
  },

  edit: {
    labelField: 'What you want',
    sceneField: 'Your scene',
    phraseField: 'Your phrase',
    feelsDone: 'This feels done',
  },

  bedtime: {
    relax: 'Get comfortable. Relax however you like: breathing, a body scan, a meditation.',
    readOnce: 'Read it once now, so it’s ready.',
    goodNight: 'Good night',
  },

  seal: {
    body: "It's done. You can leave it now.",
    button: 'Seal it',
  },

  doubt: {
    intro: "That's okay. Doubt is just a thought.",
    done: 'Done',
    after: "It's done.",
    different: 'Different one?',
  },

  tools: {
    title: 'Tools',
    intro: 'Use these only when you feel like it.',
    rewrite: {
      name: 'Rewrite',
      step1: "What's replaying in your head?",
      step2: 'How would it go if your wish were already true? Write it that way.',
      step3: 'Close your eyes and run the new version once.',
    },
    impulses: {
      name: 'Impulses',
      intro: 'Had an impulse to do something? Note it, then act on it.',
      placeholder: 'Call Sam about the course',
      add: 'Add',
      tick: 'Mark as done',
      remove: 'Remove',
    },
  },

  how: {
    title: 'How this works',
    cards: [
      {
        title: "Assume it's done.",
        body: "Instead of wanting something, you rest in the feeling of already having it. Wanting keeps attention on what's missing. Assuming moves it to what's already true.",
      },
      {
        title: 'The right moment.',
        body: 'Relax first, in whatever way works for you. The moment to begin is when your body feels heavy and your thoughts start to drift. Half-asleep, you stop arguing with what you imagine.',
      },
      {
        title: 'Why no effort.',
        body: 'Coué noticed that the harder you force something, the more it resists. Let the scene play, let the phrase repeat. If it feels like work, ease off.',
      },
      {
        title: 'Why you seal it.',
        body: "Checking whether it's working is a way of saying it isn't done yet. Once it feels natural, seal it and stop practising.",
      },
      {
        title: 'When doubt shows up.',
        body: 'Doubt is normal. Fighting a thought makes it louder. Return to your scene or phrase once, and move on.',
      },
      {
        title: 'Act on impulses.',
        body: "Assuming doesn't mean waiting. When you feel a natural nudge to do something, do it.",
      },
    ],
  },

  settings: {
    title: 'Settings',
    mode: 'Mode',
    modeHelp: 'Scene: imagine a moment. Phrase: repeat a sentence.',
    reminder: 'Bedtime reminder',
    reminderAdd: 'Add to calendar',
    reminderHelp: 'Adds one daily calendar alert.',
    sealed: 'Sealed',
    sealedHelp: 'These are done. No need to look.',
    sealedEmpty: 'Nothing here.',
    read: 'Read',
    hide: 'Hide',
    restore: 'Restore',
    delete: 'Delete',
    deleteOne: 'Delete this one?',
    data: 'Your data',
    dataHelp: 'Everything stays on this device.',
    export: 'Export',
    import: 'Import',
    deleteAll: 'Delete everything',
    deleteAllConfirm: "Delete everything on this device? This can't be undone.",
    importConfirm: 'Replace everything on this device with this file?',
    importReplace: 'Replace',
    importError: "That file couldn't be read.",
  },

  calendar: {
    summary: 'Assumed',
    description: 'Open Assumed in bed and press Begin.',
    filename: 'assumed-bedtime.ics',
  },
};

export type Copy = typeof en;
export const t: Copy = en;
