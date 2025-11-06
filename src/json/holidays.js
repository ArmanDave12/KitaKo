const holidays = {
  new_years_day: {
    name: "New Year's Day",
    date: "January 1",
    type: "regular",
    description: "Celebration of the first day of the year"
  },
  araw_ng_kagitingan: {
    name: "Araw ng Kagitingan (Day of Valor)",
    date: "April 9",
    type: "regular",
    description: "Commemoration of the heroism of Filipino and American soldiers during World War II"
  },
  maundy_thursday: {
    name: "Maundy Thursday",
    date: "Variable (Holy Week)",
    type: "regular",
    description: "Commemoration of the Last Supper of Jesus Christ"
  },
  good_friday: {
    name: "Good Friday",
    date: "Variable (Holy Week)",
    type: "regular",
    description: "Commemoration of the crucifixion and death of Jesus Christ"
  },
  labor_day: {
    name: "Labor Day",
    date: "May 1",
    type: "regular",
    description: "Celebration of workers and laborers"
  },
  independence_day: {
    name: "Independence Day",
    date: "June 12",
    type: "regular",
    description: "Commemoration of Philippine independence from Spanish rule in 1898"
  },
  national_heroes_day: {
    name: "National Heroes Day",
    date: "Last Monday of August",
    type: "regular",
    description: "Honors all Filipino heroes who fought for freedom and democracy"
  },
  bonifacio_day: {
    name: "Bonifacio Day",
    date: "November 30",
    type: "regular",
    description: "Commemoration of the birth of Andres Bonifacio, leader of the Katipunan"
  },
  christmas_day: {
    name: "Christmas Day",
    date: "December 25",
    type: "regular",
    description: "Celebration of the birth of Jesus Christ"
  },
  rizal_day: {
    name: "Rizal Day",
    date: "December 30",
    type: "regular",
    description: "Commemoration of the martyrdom of Dr. Jose Rizal"
  },
  chinese_new_year: {
    name: "Chinese New Year",
    date: "Variable (January or February)",
    type: "special",
    description: "Celebration of the beginning of the Lunar New Year"
  },
  edsa_people_power_anniversary: {
    name: "EDSA People Power Revolution Anniversary",
    date: "February 25",
    type: "special",
    description: "Commemoration of the 1986 peaceful revolution that restored democracy"
  },
  black_saturday: {
    name: "Black Saturday",
    date: "Variable (Holy Week)",
    type: "special",
    description: "Commemoration of the day Jesus lay in the tomb"
  },
  ninoy_aquino_day: {
    name: "Ninoy Aquino Day",
    date: "August 21",
    type: "special",
    description: "Commemoration of the assassination of Senator Benigno 'Ninoy' Aquino Jr."
  },
  all_saints_day: {
    name: "All Saints' Day",
    date: "November 1",
    type: "special",
    description: "Honoring all the saints of the Church"
  },
  all_souls_day: {
    name: "All Souls' Day",
    date: "November 2",
    type: "special",
    description: "Day of remembrance for all the faithful departed"
  },
  immaculate_conception: {
    name: "Feast of the Immaculate Conception",
    date: "December 8",
    type: "special",
    description: "Celebration of the Immaculate Conception of the Virgin Mary"
  },
  christmas_eve: {
    name: "Christmas Eve",
    date: "December 24",
    type: "special",
    description: "Celebration of the night before Christmas"
  },
  new_years_eve: {
    name: "New Year's Eve",
    date: "December 31",
    type: "special",
    description: "Celebration of the end of the calendar year"
  }
};

// Special dates for different years
const variableDates = {
  "2025": {
    "Maundy Thursday": "2025-04-17",
    "Good Friday": "2025-04-18",
    "Black Saturday": "2025-04-19",
    "Chinese New Year": "2025-01-29"
  },
  "2024": {
    "Maundy Thursday": "2024-03-28",
    "Good Friday": "2024-03-29",
    "Black Saturday": "2024-03-30",
    "Chinese New Year": "2024-02-10"
  }
};

// Company specific overrides
const companyOverrides = {
  regular: ["All Saints' Day"] // Holidays that should be treated as regular holidays in your company
};

export { holidays, variableDates, companyOverrides };