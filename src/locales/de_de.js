const de_de = {
  quote_types: {
    opening: '„',
    closing: '”',
  },
  main_menu_highscore: {
    text: 'Bestes Ergebnis',
  },
  carbohydrates_name: {
    text: 'Kohlenhydrate',
  },
  fats_name: {
    text: 'Fette',
  },
  proteins_name: {
    text: 'Proteine',
  },
  wiki_quantity: {
    text: 'Menge',
  },

  products_apple: {
    text: 'Apfel',
  },
  products_butter: {
    text: 'Butter',
  },
  products_strawberry_jam: {
    text: 'Erdbeermarmelade',
  },
  products_chicken: {
    text: 'Chicken',
  },
  products_donut: {
    text: 'Donut',
  },
  products_banana: {
    text: 'Banane',
  },
  products_eggs: {
    text: 'Eier',
  },
  products_hamburger: {
    text: 'Hamburger',
  },
  products_peanut_butter: {
    text: 'Nuss-Nugat-Creme',
  },
  products_milk: {
    text: 'Milch',
  },
  products_quantity_big_apple: {
    text: ( args ) => {
      const quantity = args[ 0 ];
      if ( quantity === 1 ) {
        return `${quantity} ein großer Apfel`;
      } else if ( quantity < 5 ) {
        return `${quantity} große Apfel`;
      } else {
        return `${quantity} große Apfel`;
      }
    },
  },
  products_quantity_spoon: {
    text: ( args ) => {
      const quantity = args[ 0 ];
      if ( quantity === 1 ) {
        return `${quantity} Löffel`;
      } else if ( quantity < 5 ) {
        return `${quantity} Löffel`;
      } else {
        return `${quantity} Löffel`;
      }
    },
  },
  products_quantity_gram: {
    text: ( args ) => {
      const quantity = args[ 0 ];
      if ( quantity === 1 ) {
        return `${quantity} Gramm`;
      } else if ( quantity < 5 ) {
        return `${quantity} Gramm`;
      } else {
        return `${quantity} Gramm`;
      }
    },
  },
  products_quantity_donut: {
    text: ( args ) => {
      const quantity = args[ 0 ];
      if ( quantity === 1 ) {
        return `${quantity} Donat`;
      } else if ( quantity < 5 ) {
        return `${quantity} Donats`;
      } else {
        return `${quantity} Donats`;
      }
    },
  },
  products_quantity_banana: {
    text: ( args ) => {
      const quantity = args[ 0 ];
      if ( quantity === 1 ) {
        return `${quantity} Banane`;
      } else if ( quantity < 5 ) {
        return `${quantity} Bananen`;
      } else {
        return `${quantity} Bananen`;
      }
    },
  },
  products_quantity_egg: {
    text: ( args ) => {
      const quantity = args[ 0 ];
      if ( quantity === 1 ) {
        return `${quantity} Ei`;
      } else if ( quantity < 5 ) {
        return `${quantity} Eier`;
      } else {
        return `${quantity} Eier`;
      }
    },
  },
  products_quantity_hamburger: {
    text: ( args ) => {
      const quantity = args[ 0 ];
      if ( quantity === 1 ) {
        return `${quantity} Hamburger`;
      } else if ( quantity < 5 ) {
        return `${quantity} Hamburger`;
      } else {
        return `${quantity} Hamburger`;
      }
    },
  },
  products_quantity_cup: {
    text: ( args ) => {
      const quantity = args[ 0 ];
      if ( quantity === 1 ) {
        return `${quantity} Glas`;
      } else if ( quantity < 5 ) {
        return `${quantity} Gläser`;
      } else {
        return `${quantity} Gläser`;
      }
    },
  },

  tutorial_step_0: {
    text: 'Das ist Bob.\nHelf ihm dabei sein Körpergewicht zu halten. ',
  },
  tutorial_step_1: {
    text: 'Das sind die Nährstoffanzeiger von Bob.\nWenn der Hintergrund der Anzeige grün ist, dann ist Bob gesund und du bekommst Punkte',
  },
  tutorial_step_2: {
    text: 'Die Anzeige wird gelb, wenn Bob zu wenige oder zu viele Nährstoffe bekommt. Wenn du dann nicht handelst, verliert Bob leben und die Anzeige kann auf rot wechseln!',
  },
  tutorial_step_4: {
    text: 'Jedes Essen hat bestimmte Eingeschafte,\ndie in der "Encyklopädie" im Hauptmenü zu fonden sind.\nWenn du die Eigenschaften des Essens kennst, weißt du wie du Bob füttern musst.',
  },
  tutorial_step_5: {
    text: 'Das war das Tutorial, jetzt kannst du endlich anfangen zu spielen!',
  },

  game_health: {
    text: 'Leben',
  },
  game_score: {
    text: 'Ergebnis',
  },
  game_paused: {
    text: 'Pause',
  },
  game_level_up: {
    text: 'Es geht dir jedes mal besser!\n, das Spiel wird schwieriger!',
  },
  game_over: {
    text: 'Game Over',
  },
  game_over_text: {
    text: ( args ) => {
      // args[ 0 ] => wynik //Ergebnis
      // args[ 1 ] => sposób śmierci  //Ursache des Todes

      const secondNumberSuffix = time => ( time > 5 ) ? 'y' : 'ów';

      return `Du hast ${Math.floor( args[ 0 ] )}eereicht  punkt${secondNumberSuffix( args[ 0 ] )}\ni Du bist wegen: ${args[ 1 ]}gestorben.`;
    },
  },
  game_deathtype_dangerous_nutrition_style: {
    text: 'Gefährlicher Ernährungstil',
  },

  credits_title: {
    text: 'Autoren',
  },
  credits_code: {
    text: 'Code',
  },
  credits_graphics: {
    text: 'Grafik',
  },
  credits_sound: {
    text: 'Sound',
  },
  credits_translators: {
    text: 'Übersetzung',
  },
  credits_lang_de: {
    text: 'Deutsch',
  },

  credits_by: {
    text: 'von',
    // np. gemacht durch ...
  },
};

export default de_de;
