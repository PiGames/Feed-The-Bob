import { $ } from '../utils/ScaleManager';
import i18n from '../utils/i18n';

import { CREDITS_FONT, CREDITS_TITLE_FONT, MENU_BUTTON_OFFSET, CREDITS_FONT_SMALL } from '../constants/UIConstants';
import { playAudio } from '../utils/AudioManager';

import Text from '../UI/Text';

export default class Wiki extends Phaser.State {
  create() {
    this.add.sprite( 0, 0, 'loadingbg' );
    this.camera.resetFX();
    this.camera.flash( 0x000000, 500, false );

    const buttonBack = this.add.button( this.world.width - MENU_BUTTON_OFFSET, this.game.world.height - MENU_BUTTON_OFFSET, $( 'button-mainmenu' ), this.clickBack, this, 1, 0, 2 );
    buttonBack.anchor.set( 1, 1 );
    buttonBack.x = this.world.width + buttonBack.width + MENU_BUTTON_OFFSET;
    this.add.tween( buttonBack ).to( { x: this.world.width - MENU_BUTTON_OFFSET }, 500, Phaser.Easing.Exponential.Out, true );

    const textGroup = this.game.add.group();

    const creditsTitle = new Text( this.game, 'center', 0, `${i18n.text( 'credits_title' )}:`, $( CREDITS_TITLE_FONT ) );
    const creditsCodingTitle = new Text( this.game, 'center', 0, i18n.text( 'credits_code' ), $( CREDITS_FONT_SMALL ) );
    const creditsCoding = new Text( this.game, 'center', 0, i18n.quotes( 'Bartek „bibixx” Legięć\nKacper Pietrzak' ), $( CREDITS_FONT ) );
    const creditsGraphicsTitle = new Text( this.game, 'center', 0, i18n.text( 'credits_graphics' ), $( CREDITS_FONT_SMALL ) );
    const creditsGraphics = new Text( this.game, 'center', 0, i18n.quotes( 'Magda „Enna” Nowak' ), $( CREDITS_FONT ) );
    const creditsTextTranslate = new Text( this.game, 'center', 0, i18n.quotes( `\n${i18n.text( 'credits_translators' )}\nKrystian Kwiatkowski (${i18n.text( 'credits_lang_de' )})` ), $( CREDITS_FONT_SMALL ) );
    const creditsTextSound = new Text( this.game, 'center', 0, i18n.quotes( `\n${i18n.text( 'credits_sound' )}\n„Farty McSty”\n${i18n.text( 'credits_by' )} Eric Matyas (www.soundimage.org)\n\n„Click2 Sound”\n${i18n.text( 'credits_by' )} Sebastian (www.soundbible.com)` ), $( CREDITS_FONT_SMALL ) );

    textGroup.add( creditsTitle );
    textGroup.add( creditsCodingTitle );
    textGroup.add( creditsCoding );
    textGroup.add( creditsGraphicsTitle );
    textGroup.add( creditsGraphics );
    textGroup.add( creditsTextTranslate );
    textGroup.add( creditsTextSound );

    let prevText = null;
    textGroup.forEach( ( text ) => {
      if ( prevText ) {
        text.y = prevText.y + prevText.height;
      }

      prevText = text;
    } );

    textGroup.position.x = 0;
    textGroup.position.y = this.game.height / 2 - textGroup.height / 2;
  }

  clickBack() {
    playAudio( 'click' );
    this.camera.fade( 0x000000, 200, false );
    this.time.events.add( 200, () => {
      this.game.state.start( 'MainMenu' );
    } );
  }
}
