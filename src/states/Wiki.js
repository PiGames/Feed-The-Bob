import { playAudio } from '../utils/AudioManager';
import { FOOD_DATA } from '../constants/FoodConstants';
import { WIKI_FONT } from '../constants/UIConstants';
import Text from '../UI/Text';

export default class Wiki extends Phaser.State {
  create() {
    this.add.sprite( 0, 0, 'loadingbg' );
    const buttonBack = this.add.button( this.world.width - 20, this.game.world.height - 20, 'button-mainmenu', this.clickBack, this, 1, 0, 2 );
    buttonBack.anchor.set( 1, 1 );
    buttonBack.x = this.world.width + buttonBack.width + 20;
    this.add.tween( buttonBack ).to( { x: this.world.width - 20 }, 500, Phaser.Easing.Exponential.Out, true );
    this.camera.flash( 0x000000, 500, false );

    const buttonNext = this.add.button( 0, this.world.height / 2, 'button-next', this.goToNextWikiPage, this, 1, 0, 2 );
    buttonNext.x = this.world.width - 64;
    buttonNext.anchor.setTo( 1, 0.5 );

    const buttonPrev = this.add.button( 64, this.world.height / 2, 'button-back', this.goToPrevWikiPage, this, 1, 0, 2 );
    buttonPrev.anchor.setTo( 0, 0.5 );


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

    const title = new Text( this.game, 'center', 0, FOOD_DATA[ index ].name, WIKI_FONT );

    const sprite = this.add.sprite( 0, title.height, 'products', FOOD_DATA[ index ].key );
    sprite.scale.setTo( 1.5 );
    sprite.x = this.game.width / 2 - sprite.width / 2;

    const carbohydrates = new Text( this.game, 'center', sprite.y + sprite.height, `Carbohydrates: ${FOOD_DATA[ index ].nutritionFacts.carbohydrates}g`, WIKI_FONT );
    const fats = new Text( this.game, 'center', carbohydrates.y + carbohydrates.height, `Fats: ${FOOD_DATA[ index ].nutritionFacts.fats}g`, WIKI_FONT );
    const proteins = new Text( this.game, 'center', fats.y + fats.height, `Proteins: ${FOOD_DATA[ index ].nutritionFacts.proteins}g`, WIKI_FONT );
    const quantity = new Text( this.game, 'center', proteins.y + proteins.height, `Quantity: ${FOOD_DATA[ index ].quantity}`, WIKI_FONT );

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

    tweenIn.onComplete.add( () => {
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

    tweenIn.onComplete.add( () => {
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
