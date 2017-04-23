export default class Boot extends Phaser.State {
  preload() {
    this.game.stage.backgroundColor = '#dba74b';
    this.game.load.image( 'loadingbg', 'img/loadingbg.png' );
    this.game.load.image( 'loadingbg-50', 'img50/loadingbg.png' );
    this.game.load.image( 'loading-background', 'img/loading-background.png' );
    this.game.load.image( 'loading-progress', 'img/loading-progress.png' );
  }
  create() {
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
    this.game.state.start( 'Preloader' );
  }
}
