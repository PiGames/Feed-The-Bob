const langFile = {
  'en_en': {
    main_menu_highscore: {
      text: 'Highscore',
    },
    carbohydrates_name: {
      text: 'carbohydrates',
    },
    fats_name: {
      text: 'fats',
    },
    proteins_name: {
      text: 'proteins',
    },
    wiki_quantity: {
      text: 'quantity',
    },

    products_apple: {
      text: 'apple',
    },
    products_butter: {
      text: 'butter',
    },
    products_strawberry_jam: {
      text: 'strawberry jam',
    },
    products_chicken: {
      text: 'chicken',
    },
    products_donut: {
      text: 'donut',
    },
    products_banana: {
      text: 'banana',
    },
    products_eggs: {
      text: 'eggs',
    },
    products_hamburger: {
      text: 'hamburger',
    },
    products_peanut_butter: {
      text: 'peanut butter',
    },
    products_milk: {
      text: 'milk',
    },

    tutorial_step_0: {
      text: 'This is Bob.\nYour job is to help him\nmaintain his current weight.',
    },
    tutorial_step_1: {
      text: 'These are Bob’s current macroelements indicators.\nBy keeping them green you keep Bob healthy and score points.',
    },
    tutorial_step_2: {
      text: 'Bob’s macroelements indicators will turn\nyellow and eventually red if you overfeed\nhim with a certain type of macroelement\nor if you dont’t feed him with it.',
    },
    tutorial_step_3: {
      text: 'Bob has his own health bar,\nits value drops when you enter yellow\nor red zone on macroelement indicator.',
    },
    tutorial_step_4: {
      text: 'Every food has its own nutrition\ninfo in Wiki section availible from the menu.\nKnowing what macroelements food consists of,\nyou can be sure that you will feed Bob properly.',
    },
    tutorial_step_5: {
      text: 'This is the end of tutorial. You can now enjoy the game!',
    },

    game_health: {
      text: 'Health',
    },
    game_score: {
      text: 'Score',
    },
    game_paused: {
      text: 'Paused',
    },
    game_level_up: {
      text: 'You are getting better!\nSo game is gonna become harder!',
    },
    game_over: {
      text: 'Game over',
    },

    game_over_text: {
      text: ( args ) => {
        const secondNumberSuffix = time => ( time === 1 ) ? '' : 's';

        return `You have scored ${Math.floor( args[ 0 ] )} point${secondNumberSuffix( args[ 0 ] )}\nand died from ${args[ 1 ]}`;
      },
    },
    game_deathtype_dangerous_nutrition_style: {
      text: 'dangerous nutrition style',
    },
  },
  'pl_pl': {
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
        const secondNumberSuffix = time => ( time > 5 ) ? 'y' : 'ów';

        return `Zdobyłeś ${Math.floor( args[ 0 ] )} punkt${secondNumberSuffix( args[ 0 ] )}\ni umarłeś od ${args[ 1 ]}`;
      },
    },
    game_deathtype_dangerous_nutrition_style: {
      text: 'niebezipecznego stylu żywienia',
    },
  },
};

let CURRENT_LANG = 'en_en';
CURRENT_LANG = 'pl_pl';

class i18n {
  text( id, ...args ) {
    if ( langFile[ CURRENT_LANG ] && langFile[ CURRENT_LANG ][ id ] ) {
      if ( args.length > 0 ) {
        return langFile[ CURRENT_LANG ][ id ].text( args ) || '';
      }
      return langFile[ CURRENT_LANG ][ id ].text || '';
    } else if ( langFile[ 'en_en' ] && langFile[ 'en_en' ][ id ] ) {
      if ( args.length > 0 ) {
        return langFile[ 'en_en' ][ id ].text( id, args ) || '';
      }
      return langFile[ 'en_en' ][ id ].text || '';
    } else {
      return '';
    }
  }
}

export default new i18n();
