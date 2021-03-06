import { $ } from '../utils/ScaleManager';
import i18n from '../utils/i18n';
import { playAudio } from '../utils/AudioManager';
import { FOOD_DATA } from '../constants/FoodConstants';
import { WIKI_TITLE_FONT, WIKI_FONT } from '../constants/UIConstants';
import Text from '../UI/Text';

import { MENU_BUTTON_OFFSET } from '../constants/UIConstants';

export default class Wiki extends Phaser.State {
  create() {
    this.add.sprite( 0, 0, $( 'loadingbg' ) );
    this.camera.flash( 0x000000, 500, false );

    this.ui = this.add.group();

    const buttonBack = this.add.button( this.world.width - MENU_BUTTON_OFFSET, this.game.world.height - MENU_BUTTON_OFFSET, $( 'button-mainmenu' ), this.clickBack, this, 1, 0, 2 );
    buttonBack.anchor.set( 1, 1 );
    buttonBack.x = this.world.width + buttonBack.width + MENU_BUTTON_OFFSET;
    this.add.tween( buttonBack ).to( { x: this.world.width - MENU_BUTTON_OFFSET }, 500, Phaser.Easing.Exponential.Out, true );

    this.buttonNext = this.add.button( 0, this.world.height / 2, $( 'button-next' ), this.goToNextWikiPage, this, 1, 0, 2 );
    this.buttonNext.x = this.world.width - 64;
    this.buttonNext.anchor.setTo( 1, 0.5 );

    this.buttonPrev = this.add.button( 64, this.world.height / 2, $( 'button-back' ), this.goToPrevWikiPage, this, 1, 0, 2 );
    this.buttonPrev.anchor.setTo( 0, 0.5 );

    this.ui.add( buttonBack );
    this.ui.add( this.buttonNext );
    this.ui.add( this.buttonPrev );

    this.pages = [];
    const prevPage = this.add.group();
    this.fillGroupWithFoodData( prevPage, FOOD_DATA.length - 1 );
    this.pages.push( prevPage );

    prevPage.position.y = this.world.height / 2 - prevPage.height / 2;
    prevPage.position.x -= this.world.width;

    const currentPage = this.add.group();
    this.fillGroupWithFoodData( currentPage, 0 );
    this.pages.push( currentPage );

    currentPage.position.y = this.world.height / 2 - currentPage.height / 2;

    const nextPage = this.add.group();
    this.fillGroupWithFoodData( nextPage, 1 );
    this.pages.push( nextPage );

    nextPage.position.y = this.world.height / 2 - nextPage.height / 2;
    nextPage.position.x += this.world.width;
  }

  fillGroupWithFoodData( group, index ) {
    group.index = index;
    group.removeAll( true );

    const sheet = this.add.sprite( this.game.width / 2, 0, $( 'sheet' ) );
    sheet.anchor.setTo( 0.5, 0 );

    const capitalise = ( text ) => {
      return text.substring( 0, 1 ).toUpperCase() + text.substring( 1 );
    };

    const title = new Text( this.game, 'center', $( 220 ), `${capitalise( i18n.text( FOOD_DATA[ index ].name ) )}`, $( WIKI_TITLE_FONT ), [ null, 1 ] );

    const sprite = this.add.sprite( this.game.width / 2, $( 380 ), $( i18n.image( 'products' ) ), FOOD_DATA[ index ].key );
    sprite.scale.setTo( 1.5 );
    sprite.anchor.setTo( 0.5 );

    const iQuantity = ( args ) => i18n.text( args[ 0 ], args[ 1 ] );

    const carbohydrates = new Text( this.game, 'center', $( 600 ), `${capitalise( i18n.text( 'carbohydrates_name' ) )}: ${FOOD_DATA[ index ].nutritionFacts.carbohydrates}g`, $( WIKI_FONT ), [ null, 1 ] );
    const fats = new Text( this.game, 'center', $( 714 ), `${capitalise( i18n.text( 'fats_name' ) )}: ${FOOD_DATA[ index ].nutritionFacts.fats}g`, $( WIKI_FONT ), [ null, 1 ] );
    const proteins = new Text( this.game, 'center', $( 828 ), `${capitalise( i18n.text( 'proteins_name' ) )}: ${FOOD_DATA[ index ].nutritionFacts.proteins}g`, $( WIKI_FONT ), [ null, 1 ] );
    const quantity = new Text( this.game, 'center', $( 943 ), `${capitalise( i18n.text( 'wiki_quantity' ) )}: ${iQuantity( FOOD_DATA[ index ].quantity )}`, $( WIKI_FONT ), [ null, 1 ] );

    group.add( sheet );
    group.add( title );
    group.add( sprite );
    group.add( carbohydrates );
    group.add( fats );
    group.add( proteins );
    group.add( quantity );
  }

  goToPrevWikiPage() {
    this.add.tween( this.pages[ 1 ].position ).to( { x: this.world.width }, 250, Phaser.Easing.Linear.In, true );
    const tweenIn = this.add.tween( this.pages[ 0 ].position ).to( { x: 0 }, 250, Phaser.Easing.Linear.Out, true );
    this.game.world.bringToTop( this.ui );

    this.buttonPrev.inputEnabled = false;

    tweenIn.onComplete.add( () => {
      this.buttonPrev.inputEnabled = true;
      this.pages[ 0 ].position.x = 0;

      let currentIndex = this.pages[ 0 ].index - 1;

      if ( currentIndex < 0 ) {
        currentIndex = FOOD_DATA.length - 1;
        this.currentPageIndex = FOOD_DATA.length - 1;
      }

      const prevPage = this.add.group();
      this.fillGroupWithFoodData( prevPage, currentIndex );
      prevPage.position.y = this.world.height / 2 - prevPage.height / 2;
      prevPage.position.x = this.world.width * -1;

      this.pages.pop();
      this.pages.unshift( prevPage );
    } );
  }

  goToNextWikiPage() {
    this.add.tween( this.pages[ 1 ].position ).to( { x: this.world.width * -1 }, 250, Phaser.Easing.Linear.In, true );
    const tweenIn = this.add.tween( this.pages[ 2 ].position ).to( { x: 0 }, 250, Phaser.Easing.Linear.Out, true );
    this.game.world.bringToTop( this.ui );
    this.buttonNext.inputEnabled = false;

    tweenIn.onComplete.add( () => {
      this.buttonNext.inputEnabled = true;
      this.pages[ 2 ].position.x = 0;

      let currentIndex = this.pages[ 2 ].index + 1;

      if ( currentIndex >= FOOD_DATA.length ) {
        currentIndex = 0;
        this.currentPageIndex = 0;
      }

      const nextPage = this.add.group();
      this.fillGroupWithFoodData( nextPage, currentIndex );
      nextPage.position.y = this.world.height / 2 - nextPage.height / 2;
      nextPage.position.x = this.world.width;

      this.pages.shift();
      this.pages.push( nextPage );
    } );
  }

  clickBack() {
    playAudio( 'click' );
    this.camera.fade( 0x000000, 200, false );
    this.camera.onFadeComplete.add( () => {
      this.game.state.start( 'MainMenu' );
    }, this );
  }
}
