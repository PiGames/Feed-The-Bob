const resources = {
  'image': [
		[ 'background', 'img/background.png' ],
		[ 'title', 'img/title.png' ],
		[ 'logo-pigames', 'img/logo-pigames.png' ],
		[ 'overlay', 'img/overlay.png' ],

    [ 'nutrition-bar-background', 'img/ui/nutrition-bar-background.png' ],

    [ 'apple', 'img/assets/apple.png' ],
    [ 'chicken', 'img/assets/chicken.png' ],
    [ 'banana', 'img/assets/banana.png' ],
    [ 'hamburger', 'img/assets/hamburger.png' ],
  ],
  'spritesheet': [
		[ 'button-start', 'img/button-start.png', 180, 180 ],
		[ 'button-continue', 'img/button-continue.png', 180, 180 ],
		[ 'button-mainmenu', 'img/button-mainmenu.png', 180, 180 ],
		[ 'button-restart', 'img/button-tryagain.png', 180, 180 ],
		[ 'button-wiki', 'img/button-wiki.png', 110, 110 ],
		[ 'button-pause', 'img/button-pause.png', 80, 80 ],
		[ 'button-audio', 'img/button-sound.png', 80, 80 ],
		[ 'button-back', 'img/button-back.png', 70, 70 ],
		[ 'button-next', 'img/button-next.png', 70, 70 ],
    [ 'bob', 'img/assets/bob.png', 460, 1370 ],
    [ 'nutrition-bar', 'img/ui/nutrition-bar.png', 680, 56 ],
  ],
  'audio': [
		[ 'audio-click', [ 'sfx/audio-button.m4a', 'sfx/audio-button.mp3', 'sfx/audio-button.ogg' ] ],
		[ 'audio-theme', [ 'sfx/music-bitsnbites-liver.m4a', 'sfx/music-bitsnbites-liver.mp3', 'sfx/music-bitsnbites-liver.ogg' ] ],
  ],
};

window.WebFontConfig = {
  google: {
    families: [ 'Gloria Hallelujah' ],
  },
};

export default class Preloader extends Phaser.State {
  preload() {
    this.add.sprite( ( this.world.width - 580 ) * 0.5, ( this.world.height + 150 ) * 0.5, 'loading-background' );
    const preloadProgress = this.add.sprite( ( this.world.width - 540 ) * 0.5, ( this.world.height + 170 ) * 0.5, 'loading-progress' );
    this.load.setPreloadSprite( preloadProgress );

    this._preloadResources();
  }
  _preloadResources() {
    for ( const method in resources ) {
      resources[ method ].forEach( ( args ) => {
        const loader = this.load[ method ];
        loader && loader.apply( this.load, args );
      }, this );
    }

    this.load.script( 'webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js' );
  }
  create() {
    // this.state.start( 'MainMenu' );
    this.state.start( 'Game' );
  }
}
