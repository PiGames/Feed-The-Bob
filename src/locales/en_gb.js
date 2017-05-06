const en_gb = {
  quote_types: {
    opening: '’',
    closing: '’',
  },
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
  products_quantity_big_apple: {
    text: ( args ) => {
      const quantity = args[ 0 ];
      if ( quantity === 1 ) {
        return `${quantity} big apple`;
      } else {
        return `${quantity} big apples`;
      }
    },
  },
  products_quantity_spoon: {
    text: ( args ) => {
      const quantity = args[ 0 ];
      if ( quantity === 1 ) {
        return `${quantity} spoon`;
      } else {
        return `${quantity} spoons`;
      }
    },
  },
  products_quantity_gram: {
    text: ( args ) => {
      const quantity = args[ 0 ];
      if ( quantity === 1 ) {
        return `${quantity} gram`;
      } else {
        return `${quantity} grams`;
      }
    },
  },
  products_quantity_donut: {
    text: ( args ) => {
      const quantity = args[ 0 ];
      if ( quantity === 1 ) {
        return `${quantity} donut`;
      } else {
        return `${quantity} donuts`;
      }
    },
  },
  products_quantity_banana: {
    text: ( args ) => {
      const quantity = args[ 0 ];
      if ( quantity === 1 ) {
        return `${quantity} banana`;
      } else {
        return `${quantity} bananas`;
      }
    },
  },
  products_quantity_egg: {
    text: ( args ) => {
      const quantity = args[ 0 ];
      if ( quantity === 1 ) {
        return `${quantity} egg`;
      } else {
        return `${quantity} eggs`;
      }
    },
  },
  products_quantity_hamburger: {
    text: ( args ) => {
      const quantity = args[ 0 ];
      if ( quantity === 1 ) {
        return `${quantity} hamburger`;
      } else {
        return `${quantity} hamburgers`;
      }
    },
  },
  products_quantity_cup: {
    text: ( args ) => {
      const quantity = args[ 0 ];
      if ( quantity === 1 ) {
        return `${quantity} cup`;
      } else {
        return `${quantity} cups`;
      }
    },
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
      // args[ 0 ] => score
      // args[ 1 ] => deathtype

      const secondNumberSuffix = time => ( time === 1 ) ? '' : 's';

      return `You have scored ${Math.floor( args[ 0 ] )} point${secondNumberSuffix( args[ 0 ] )}\nand died from ${args[ 1 ]}`;
    },
  },
  game_deathtype_dangerous_nutrition_style: {
    text: 'dangerous nutrition style',
  },

  credits_title: {
    text: 'Credits',
  },
  credits_code: {
    text: 'Coding',
  },
  credits_graphics: {
    text: 'Graphics',
  },
  credits_sound: {
    text: 'Sounds',
  },
  credits_translators: {
    text: 'Translators',
  },
  credits_lang_de: {
    text: 'German',
  },
  credits_by: {
    text: 'by',
    // eg. created by
  },
};

export default en_gb;
