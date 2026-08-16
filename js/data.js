/**
 * Static seed data for the app.
 * `daysLeft` is relative to the current date: a negative value marks a closed survey.
 */

const CATEGORIES = [
  'Team activities',
  'Health & Wellness',
  'Gaming & Entertainment',
  'Workplace Culture',
  'Food & Drinks'
];

const MAX_ANSWERS = 6;
const MIN_ANSWERS = 2;
const DAY_IN_MS = 86400000;
const LIVE_INTERVAL_MS = 1800;

const SEED_SURVEYS = [
  {
    category: 'Team activities',
    title: 'Let’s Plan the Next Team Event Together',
    description: 'We want to create team activities that everyone will enjoy – share your preferences and ideas to help us plan better experiences together.',
    daysLeft: 1,
    questions: [
      {
        text: 'Which date would work best for you?',
        multiple: true,
        options: [['19.09.2025, Friday', 27], ['10.10.2025, Friday', 44], ['11.10.2025, Saturday', 3], ['31.10.2025, Friday', 26]]
      },
      {
        text: 'Choose the activities you prefer',
        multiple: true,
        options: [['Outdoor adventure like kayaking', 60], ['Office costume party', 8], ['Bowling, mini-golf, volleyball', 14], ['Beach party, music & cocktails', 26], ['Escape room', 11]]
      },
      {
        text: 'What is most important to you in a team event?',
        multiple: false,
        options: [['Team bonding', 44], ['Food and drinks', 3], ['Trying something new', 26], ['Keeping it low-key and stress-free', 27]]
      },
      {
        text: 'How long would you prefer the event to last?',
        multiple: false,
        options: [['Half a day', 14], ['Full day', 86], ['Evening only', 9]]
      }
    ]
  },
  {
    category: 'Health & Wellness',
    title: 'Healthier future: Fit & wellness survey!',
    description: 'Results feed into next year’s benefits planning – tell us what would actually make a difference to your day.',
    daysLeft: 2,
    questions: [
      {
        text: 'Which wellness perk would you actually use?',
        multiple: true,
        options: [['Gym subsidy', 31], ['Yoga at the office', 14], ['Mental health days', 39], ['Standing desks', 9]]
      },
      {
        text: 'How often would you join a weekly session?',
        multiple: false,
        options: [['Every week', 22], ['Twice a month', 41], ['Rarely', 17]]
      }
    ]
  },
  {
    category: 'Gaming & Entertainment',
    title: 'Gaming habits and favorite games!',
    description: 'A quick look at how the team plays, so we can plan the right kind of game night.',
    daysLeft: 3,
    questions: [
      {
        text: 'How do you mostly play?',
        multiple: false,
        options: [['PC', 42], ['Console', 27], ['Mobile', 19], ['I do not play', 6]]
      },
      {
        text: 'Which genres should we pick for game night?',
        multiple: true,
        options: [['Party games', 51], ['Racing', 24], ['Co-op shooters', 18], ['Puzzle', 12]]
      }
    ]
  },
  {
    category: 'Workplace Culture',
    title: 'How should we run our weekly sync?',
    description: 'We currently spend 60 minutes every Monday. Help us find a format that works.',
    daysLeft: 5,
    questions: [
      {
        text: 'Which format works best for the weekly sync?',
        multiple: false,
        options: [['Keep 60 minutes', 5], ['Cut to 30 minutes', 33], ['Async written update', 21]]
      },
      {
        text: 'Which day suits you best?',
        multiple: false,
        options: [['Monday', 28], ['Wednesday', 19], ['Friday', 11]]
      }
    ]
  },
  {
    category: 'Food & Drinks',
    title: 'Office kitchen restock – what is missing?',
    description: 'Tell us what should be on the shopping list from next month on.',
    daysLeft: 6,
    questions: [
      {
        text: 'What should we add to the kitchen?',
        multiple: true,
        options: [['Oat milk', 22], ['Better coffee beans', 40], ['Fresh fruit', 27], ['Sparkling water', 12]]
      }
    ]
  },
  {
    category: 'Team activities',
    title: 'Summer offsite: city or countryside?',
    description: 'Two nights in mid-July. The budget is set – the destination is not.',
    daysLeft: 9,
    questions: [
      {
        text: 'Where should the summer offsite happen?',
        multiple: false,
        options: [['City trip', 26], ['Countryside cabin', 34], ['Beach', 18]]
      },
      {
        text: 'What should the evenings look like?',
        multiple: true,
        options: [['Shared dinner', 39], ['Free time', 21], ['Organised activity', 14]]
      }
    ]
  },
  {
    category: 'Health & Wellness',
    title: 'Ergonomics check: how is your setup?',
    description: 'A short check-in on your workstation so we know where to invest.',
    daysLeft: -4,
    questions: [
      {
        text: 'How comfortable is your workstation?',
        multiple: false,
        options: [['Very comfortable', 12], ['Okay', 29], ['Needs improvement', 34]]
      }
    ]
  },
  {
    category: 'Gaming & Entertainment',
    title: 'Which game for the next game night?',
    description: 'Mario Kart won – thanks to everyone who voted.',
    daysLeft: -9,
    questions: [
      {
        text: 'Pick the game for game night.',
        multiple: false,
        options: [['Mario Kart', 38], ['Jackbox', 21], ['Among Us', 14]]
      }
    ]
  },
  {
    category: 'Workplace Culture',
    title: 'Remote work: how many days per week?',
    description: 'This poll closed in spring and shaped the current policy.',
    daysLeft: -21,
    questions: [
      {
        text: 'How many remote days do you prefer?',
        multiple: false,
        options: [['1 day', 8], ['2 days', 26], ['3 days', 31], ['Fully remote', 17]]
      }
    ]
  },
  {
    category: 'Food & Drinks',
    title: 'Christmas dinner venue',
    description: 'Booking is done – the Italian place won by a clear margin.',
    daysLeft: -40,
    questions: [
      {
        text: 'Which venue should we book?',
        multiple: false,
        options: [['Italian', 24], ['Steakhouse', 11], ['Vegan bistro', 19]]
      }
    ]
  }
];
