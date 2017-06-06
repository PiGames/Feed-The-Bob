const pl_pl = {
  quote_types: {
    opening: '„',
    closing: '”',
  },
  main_menu_highscore: {
    text: 'Najwyższy wynik',
  },
  carbohydrates_name: {
    text: 'węglowodany',
  },
  fats_name: {
    text: 'tłuszcze',
  },
  proteins_name: {
    text: 'białko',
  },
  wiki_quantity: {
    text: 'ilość',
  },

  products_apple: {
    text: 'jabłko',
  },
  products_butter: {
    text: 'masło',
  },
  products_strawberry_jam: {
    text: 'dżem truskawkowy',
  },
  products_chicken: {
    text: 'kurczak',
  },
  products_donut: {
    text: 'donut',
  },
  products_banana: {
    text: 'banan',
  },
  products_eggs: {
    text: 'jajka',
  },
  products_hamburger: {
    text: 'hamburger',
  },
  products_peanut_butter: {
    text: 'masło orzechowe',
  },
  products_milk: {
    text: 'mleko',
  },
  products_quantity_big_apple: {
    text: ( args ) => {
      const quantity = args[ 0 ];
      if ( quantity === 1 ) {
        return `${quantity} duże jabłko`;
      } else if ( quantity < 5 ) {
        return `${quantity} duże jabłka`;
      } else {
        return `${quantity} dużych jabłek`;
      }
    },
  },
  products_quantity_spoon: {
    text: ( args ) => {
      const quantity = args[ 0 ];
      if ( quantity === 1 ) {
        return `${quantity} łyżka`;
      } else if ( quantity < 5 ) {
        return `${quantity} łyżki`;
      } else {
        return `${quantity} łyżek`;
      }
    },
  },
  products_quantity_gram: {
    text: ( args ) => {
      const quantity = args[ 0 ];
      if ( quantity === 1 ) {
        return `${quantity} gram`;
      } else if ( quantity < 5 ) {
        return `${quantity} gramy`;
      } else {
        return `${quantity} gramów`;
      }
    },
  },
  products_quantity_donut: {
    text: ( args ) => {
      const quantity = args[ 0 ];
      if ( quantity === 1 ) {
        return `${quantity} donut`;
      } else if ( quantity < 5 ) {
        return `${quantity} donuty`;
      } else {
        return `${quantity} donutów`;
      }
    },
  },
  products_quantity_banana: {
    text: ( args ) => {
      const quantity = args[ 0 ];
      if ( quantity === 1 ) {
        return `${quantity} banan`;
      } else if ( quantity < 5 ) {
        return `${quantity} banany`;
      } else {
        return `${quantity} bananów`;
      }
    },
  },
  products_quantity_egg: {
    text: ( args ) => {
      const quantity = args[ 0 ];
      if ( quantity === 1 ) {
        return `${quantity} jajko`;
      } else if ( quantity < 5 ) {
        return `${quantity} jajka`;
      } else {
        return `${quantity} jajek`;
      }
    },
  },
  products_quantity_hamburger: {
    text: ( args ) => {
      const quantity = args[ 0 ];
      if ( quantity === 1 ) {
        return `${quantity} hamburger`;
      } else if ( quantity < 5 ) {
        return `${quantity} hamburgery`;
      } else {
        return `${quantity} hamburgerów`;
      }
    },
  },
  products_quantity_cup: {
    text: ( args ) => {
      const quantity = args[ 0 ];
      if ( quantity === 1 ) {
        return `${quantity} szklanka`;
      } else if ( quantity < 5 ) {
        return `${quantity} szklanki`;
      } else {
        return `${quantity} szklanek`;
      }
    },
  },

  tutorial_step_0: {
    text: 'To jest Bob.\nTwoim zadaniem jest pomóc mu\nutrzymać jego obecną wagę.',
  },
  tutorial_step_1: {
    text: 'To są wskaźniki stanu makroelementów Boba.\nPoprzez utrzymywanie ich na zielonym tle Bob jest zdrowy,\na ty dostajesz punkty.',
  },
  tutorial_step_2: {
    text: 'Wskaźnik makroelementów zmieni kolor na żółty,\na w końcu na czerwony jeśli przekramisz Boba\nmakroelementami lub gdy go nie będziesz nimi karmił.',
  },
  tutorial_step_3: {
    text: 'Bob ma swój własny pasek życia.\nJego wartość spada gdy wkroczysz na żółte\n lub czerowne pole na wskaźniku makroelementów.',
  },
  tutorial_step_4: {
    text: 'Każde jedzenie ma swoje właściwości\nopisane w sekcji „Encyklopedia” w menu głównym.\nZnając jakie makroelementy dane jedzenie posiada\nmożesz być pewien, że nakarmisz Boba poprawnie.',
  },
  tutorial_step_5: {
    text: 'To koniec samouczka.\nMożesz teraz cieszyć się grą!',
  },

  game_health: {
    text: 'Życie',
  },
  game_score: {
    text: 'Wynik',
  },
  game_paused: {
    text: 'Pauza',
  },
  game_level_up: {
    text: 'Idzie ci coraz lepiej!\nWięc gra staje się trudniejsza!',
  },
  game_over: {
    text: 'Koniec gry',
  },
  game_over_text: {
    text: ( args ) => {
      // args[ 0 ] => wynik
      // args[ 1 ] => sposób śmierci

      const secondNumberSuffix = time => ( time > 5 ) ? 'y' : 'ów';

      return `Zdobyłeś ${Math.floor( args[ 0 ] )} punkt${secondNumberSuffix( args[ 0 ] )}\ni umarłeś od ${args[ 1 ]}`;
    },
  },
  game_deathtype_dangerous_nutrition_style: {
    text: 'niebezpiecznego stylu żywienia',
  },

  credits_title: {
    text: 'Autorzy',
  },
  credits_code: {
    text: 'Kod',
  },
  credits_graphics: {
    text: 'Grafika',
  },
  credits_sound: {
    text: 'Dźwięki',
  },
  credits_translators: {
    text: 'Tłumaczenie',
  },
  credits_lang_de: {
    text: 'niemiecki',
  },
  credits_by: {
    text: 'przez',
    // np. stworzone przez ...
  },
};

export default pl_pl;
