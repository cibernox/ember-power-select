export const numbers = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty'
];

export const numerals = [
  '2',
  '3',
  '5',
  '7',
  '11',
  '13',
  '17',
  '19',
  '23',
  '853'
];

export const names = [
  'María',
  'Søren Larsen',
  'João',
  'Miguel',
  'Marta',
  'Lisa'
];

export const countries = [
  { name: 'United States',  code: 'US', population: 321853000 },
  { name: 'Spain',          code: 'ES', population: 46439864 },
  { name: 'Portugal',       code: 'PT', population: 10374822 },
  { name: 'Russia',         code: 'RU', population: 146588880 },
  { name: 'Latvia',         code: 'LV', population: 1978300 },
  { name: 'Brazil',         code: 'BR', population: 204921000 },
  { name: 'United Kingdom', code: 'GB', population: 64596752 }
];

export const countriesWithDisabled = [
  { name: 'United States',  code: 'US', population: 321853000 },
  { name: 'Spain',          code: 'ES', population: 46439864 },
  { name: 'Portugal',       code: 'PT', population: 10374822, disabled: true },
  { name: 'Russia',         code: 'RU', population: 146588880, disabled: true },
  { name: 'Latvia',         code: 'LV', population: 1978300 },
  { name: 'Brazil',         code: 'BR', population: 204921000, disabled: true },
  { name: 'United Kingdom', code: 'GB', population: 64596752 }
];

export const groupedNumbers = [
  { groupName: 'Smalls', options: ['one', 'two', 'three'] },
  { groupName: 'Mediums', options: ['four', 'five', 'six'] },
  {
    groupName: 'Bigs',
    options: [
      { groupName: 'Fairly big', options: ['seven', 'eight', 'nine'] },
      { groupName: 'Really big', options: ['ten', 'eleven', 'twelve'] },
      'thirteen'
    ]
  },
  'one hundred',
  'one thousand'
];

export const groupedNumbersWithDisabled = [
  { groupName: 'Smalls', disabled: true, options: ['one', 'two', 'three'] },
  { groupName: 'Mediums', options: ['four', 'five', 'six'] },
  {
    groupName: 'Bigs',
    options: [
      { groupName: 'Fairly big', options: ['seven', 'eight', 'nine'] },
      { groupName: 'Really big', options: ['ten', 'eleven', 'twelve'] },
      'thirteen'
    ]
  },
  'one hundred',
  'one thousand'
];

export const namesStartingWithA = [
  'Abigail',
  'Abril',
  'Adriana',
  'Adrián',
  'Agustina',
  'Agustín',
  'Aitana',
  'Alan',
  'Alejandra',
  'Alejandro',
  'Alessandra',
  'Alex',
  'Alexa',
  'Alexander',
  'Allison',
  'Alma',
  'Alonso',
  'Álvaro',
  'Amanda',
  'Amelia',
  'Ana',
  'Andrea',
  'Andrés',
  // These two need to be in the middle.
  'Aaran', // Does not exist, don't look for it.
  'Aarón',
  'Ángel',
  'Anthony',
  'Antonella',
  'Antonia',
  'Antonio',
  'Ariadna',
  'Ariana',
  'Ashley',
  'Axel'
];
