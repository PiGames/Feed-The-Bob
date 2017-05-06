import langFile from '../locales/';

let CURRENT_LANG = 'en_gb';

class i18n {
  text( id, ...args ) {
    if ( args.length > 0 ) {
      return langFile[ CURRENT_LANG ][ id ].text( args ) || '';
    }
    return langFile[ CURRENT_LANG ][ id ].text || '';
  }

  quotes( text ) {
    let quoteTypes = {
      opening: '”',
      closing: '”',
    };

    if ( langFile[ CURRENT_LANG ] && langFile[ CURRENT_LANG ][ 'quote_types' ] ) {
      quoteTypes = langFile[ CURRENT_LANG ][ 'quote_types' ];
    }

    return text.replace( /„/g, quoteTypes.opening ).replace( /”/g, quoteTypes.closing );
  }

  set( lang ) {
    if ( langFile[ lang ] ) {
      CURRENT_LANG = lang;
    }
  }

  get() {
    return CURRENT_LANG;
  }

  image( name ) {
    return `${name}-${CURRENT_LANG}`;
  }
}

export default new i18n();
