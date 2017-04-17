import { playAudio } from '../utils/AudioManager';
import { FOOD_DATA } from '../constants/FoodConstants';
import { centerObjectInWidth, centerObjectInHeight } from '../utils/UIUtils';
export default class Wiki extends Phaser.State {
  create() {
    const fontWiki = { font: '40px Arial', fill: '#000' };
    this.add.text( 20, 20, 'Wiki', fontWiki );

    const buttonBack = this.add.button( this.world.width - 20, this.game.world.height - 20, 'button-back', this.clickBack, this, 1, 0, 2 );
    buttonBack.anchor.set( 1, 1 );
    buttonBack.x = this.world.width + buttonBack.width + 20;
    this.add.tween( buttonBack ).to( { x: this.world.width - 20 }, 500, Phaser.Easing.Exponential.Out, true );

    this.currentWikiPageIndex = 0;

    this.currentPage = this.add.group();
    this.fillGroupWithFoodData( this.currentPage, 0 );

    this.nextPage = this.add.group();
    this.fillGroupWithFoodData( this.nextPage, 1 );

    this.nextPage.position.x += this.world.width;

    const buttonPrevious = this.add.button( 0, 0, 'button-back', this.goToPreviousWikiPage, this, 1, 0, 2 );
    buttonPrevious.x = -buttonPrevious.width;
    this.add.tween( buttonPrevious ).to( { x: 75 }, 500, Phaser.Easing.Exponential.Out, true );
    centerObjectInHeight( buttonPrevious, this.world );

    const buttonNext = this.add.button( 0, 0, 'button-next', this.goToNextWikiPage, this, 1, 0, 2 );
    buttonNext.x = this.world.width;
    this.add.tween( buttonNext ).to( { x: this.world.width - buttonNext.width - 75 }, 500, Phaser.Easing.Exponential.Out, true );
    centerObjectInHeight( buttonNext, this.world );
  }
  clickBack() {
    playAudio( 'click' );
    this.game.state.start( 'MainMenu' );
  }
  makeFirstLetterCapital( string ) {
    return `${string[ 0 ].toUpperCase()}${string.substring( 1 )}`;
  }
  goToPreviousWikiPage() {
    if ( this.tweenIn != null ) {
      return;
    }
    this.currentWikiPageIndex = ( this.currentWikiPageIndex === 0 ) ? FOOD_DATA.length - 1 : this.currentWikiPageIndex - 1;

    this.nextPage.position.x -= this.world.width * 2;
    this.fillGroupWithFoodData( this.nextPage, this.currentWikiPageIndex );

    this.add.tween( this.currentPage.position ).to( { x: this.currentPage.position.x + this.world.width }, 500, Phaser.Easing.Linear.None, true );
    this.tweenIn = this.add.tween( this.nextPage.position ).to( { x: this.nextPage.position.x + this.world.width }, 500, Phaser.Easing.Linear.None, true );

    this.tweenIn.onComplete.add( () => {
      const tmpPage = this.currentPage;
      this.currentPage = this.nextPage;
      this.nextPage = tmpPage;

      this.tweenIn = null;
    } );
  }
  goToNextWikiPage() {
    if ( this.tweenIn != null ) {
      return;
    }
    this.currentWikiPageIndex = ( this.currentWikiPageIndex + 1 === FOOD_DATA.length ) ? 0 : this.currentWikiPageIndex + 1;

    this.add.tween( this.currentPage.position ).to( { x: this.currentPage.position.x - this.world.width }, 500, Phaser.Easing.Linear.None, true );
    this.tweenIn = this.add.tween( this.nextPage.position ).to( { x: this.nextPage.position.x - this.world.width }, 500, Phaser.Easing.Linear.None, true );

    this.tweenIn.onComplete.add( () => {
      const tmpPage = this.currentPage;

      this.currentPage = this.nextPage;
      const nextIndex = ( this.currentWikiPageIndex + 1 === FOOD_DATA.length ) ? 0 : this.currentWikiPageIndex + 1;
      this.fillGroupWithFoodData( tmpPage, nextIndex );
      tmpPage.position.x += this.world.width * 2;

      this.nextPage = tmpPage;

      this.tweenIn = null;
    } );
  }
  fillGroupWithFoodData( group, index ) {
    group.removeAll( true );
    const fontTitle = { font: '35px Arial', fill: '#fff' };

    const title = this.add.text( 0, 75, this.makeFirstLetterCapital( FOOD_DATA[ index ].name ), fontTitle );
    centerObjectInWidth( title, this.world );
    const sprite = this.add.sprite( 0, 150, 'products', FOOD_DATA[ index ].key );
    centerObjectInWidth( sprite, this.world );
    const fontNutritionFacts = { font: '25px Arial', fill: '#000' };
    const carbohydrates = this.add.text( 0, 325, `Carbohydrates: ${FOOD_DATA[ index ].nutritionFacts.carbohydrates}g`, fontNutritionFacts );
    centerObjectInWidth( carbohydrates, this.world );
    const fats = this.add.text( 0, 375, `Fats: ${FOOD_DATA[ index ].nutritionFacts.fats}g`, fontNutritionFacts );
    centerObjectInWidth( fats, this.world );
    const proteins = this.add.text( 0, 425, `Proteins: ${FOOD_DATA[ index ].nutritionFacts.proteins}g`, fontNutritionFacts );
    centerObjectInWidth( proteins, this.world );

    group.add( title );
    group.add( sprite );
    group.add( carbohydrates );
    group.add( fats );
    group.add( proteins );
  }
}
