import { $set } from '../utils/ScaleManager';
import i18n from '../utils/i18n';
import { PPTStorage, setStorage } from '../utils/StorageManager';

const resources = {
  'image': [
		[ 'background', 'img/background.png' ],
		[ 'title', 'img/title.png' ],
		[ 'logo-pigames', 'img/logo-pigames.png' ],
		[ 'overlay', 'img/ui/overlay.png' ],
		[ 'sheet', 'img/ui/sheet.png' ],

    [ 'minute-dial', 'img/assets/minute-dial.png' ],
    [ 'hour-dial', 'img/assets/hour-dial.png' ],
    [ 'nutrition-bar-background', 'img/ui/nutrition-bar-background.png' ],
    [ 'nutrition-bar-indicator', 'img/ui/nutrition-bar-indicator.png' ],
    [ 'heart', 'img/assets/heart.png' ],
  ],
  'spritesheet': [
    [ 'button-start', 'img/ui/button-start.png', 320, 320 ],
    [ 'button-continue', 'img/ui/button-start.png', 320, 320 ],
		[ 'button-mainmenu', 'img/ui/button-mainmenu.png', 160, 160 ],
		[ 'button-restart', 'img/ui/button-tryagain.png', 160, 160 ],
    [ 'button-options', 'img/ui/button-options.png', 160, 160 ],
    [ 'button-credits-en_gb', 'img/ui/button-credits-en_gb.png', 160, 160 ],
    [ 'button-credits-pl_pl', 'img/ui/button-credits-pl_pl.png', 160, 160 ],
    [ 'button-credits-de_de', 'img/ui/button-credits-pl_pl.png', 160, 160 ],
    [ 'button-help', 'img/ui/button-help.png', 160, 160 ],
		[ 'button-wiki', 'img/ui/button-wiki.png', 160, 160 ],
		[ 'button-pause', 'img/ui/button-pause.png', 160, 160 ],
		[ 'button-audio', 'img/ui/button-sound.png', 160, 160 ],
    [ 'button-back', 'img/ui/button-back.png', 160, 170 ],
		[ 'button-next', 'img/ui/button-next.png', 160, 170 ],
    [ 'button-lang-en_gb', 'img/ui/button-lang-en_gb.png', 160, 160 ],
		[ 'button-lang-pl_pl', 'img/ui/button-lang-pl_pl.png', 160, 160 ],
		[ 'button-lang-de_de', 'img/ui/button-lang-de_de.png', 160, 160 ],
    [ 'bob', 'img/assets/bob.png', 458, 989 ],
    [ 'nutrition-bar', 'img/ui/nutrition-bar.png', 680, 56 ],
    [ 'products-en_gb', 'img/assets/products-en_gb.png', 200, 150 ],
    [ 'products-pl_pl', 'img/assets/products-pl_pl.png', 200, 150 ],
    [ 'products-de_de', 'img/assets/products-de_de.png', 200, 150 ],
		[ 'button-quality', 'img/ui/button-quality.png', 160, 160 ],
  ],
  'audio': [
		[ 'audio-click', [ 'sfx/click.mp3', 'sfx/click.ogg' ] ],
		[ 'audio-theme', [ 'sfx/farty-mcsty.m4a', 'sfx/farty-mcsty.mp3', 'sfx/farty-mcsty.ogg' ] ],
    [ 'audio-bite', [ 'sfx/bite.mp3', 'sfx/bite.ogg' ] ],
  ],
};

export default class Preloader extends Phaser.State {
  preload() {
    this.add.sprite( 0, 0, 'loadingbg' );
    this.add.sprite( ( this.world.width - 580 ) * 0.5, ( this.world.height + 150 ) * 0.5, 'loading-background' );
    const preloadProgress = this.add.sprite( ( this.world.width - 540 ) * 0.5, ( this.world.height + 170 ) * 0.5, 'loading-progress' );
    this.load.setPreloadSprite( preloadProgress );

    this._preloadResources();
  }
  _preloadResources() {
    this.span = document.createElement( 'span' );
    this.span.innerHTML = 'Zażółć';
    this.span.setAttribute( 'style', 'position: absolute; font-family: Arial,  monospace; font-size: 300px; top: -99999px; left: -99999px; opacity: 0;' );
    document.body.appendChild( this.span );
    this.initialFontSize = this.span.clientHeight;
    this.span.style.fontFamily = '"Bromine"';

    for ( const method in resources ) {
      resources[ method ].forEach( ( args ) => {
        const loader = this.load[ method ];
        if ( method === 'image' || method === 'spritesheet' ) {
          const args50 = args.concat();
          args50[ 0 ] += '-50';
          args50[ 1 ] = args50[ 1 ].replace( 'img/', 'img50/' );
          args50[ 2 ] /= 2;
          args50[ 3 ] /= 2;

          loader && loader.apply( this.load, args50 );
        }

        loader && loader.apply( this.load, args );
      }, this );
    }
  }
  update() {
    if ( this.initialFontSize !== this.span.clientHeight ) {
      setStorage( this.game.plugins.add( Phaser.Plugin.Storage ) );

      if ( PPTStorage.get( 'PPT-quality' ) === 0.5 ) {
        $set.call( this, 0.5 );
      }

      for ( let x = 0; x < navigator.languages.length; x++ ) {
        const lang = navigator.languages[ x ];
        if ( lang.toLowerCase().indexOf( 'en' ) >= 0 ) {
          i18n.set( 'en_gb' );
          break;
        }

        if ( lang.toLowerCase().indexOf( 'pl' ) >= 0 ) {
          i18n.set( 'pl_pl' );
          break;
        }

        if ( lang.toLowerCase().indexOf( 'de' ) >= 0 ) {
          i18n.set( 'de_de' );
          break;
        }
      }

      if ( PPTStorage.get( 'PPT-lang' ) ) {
        i18n.set( PPTStorage.get( 'PPT-lang' ) );
      }

      document.body.removeChild( this.span );
      this.state.start( 'MainMenu' );
      // this.state.start( 'Game' );
    }
  }
}
