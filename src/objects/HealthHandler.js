const DAMAGE_VALUE_PER_TICK = 12.5;

export default class HealthHandler {
  constructor() {
    this.health = 100;
    this.shouldBobBeHarmed = false;

    this.onHealthUpdate = new Phaser.Signal();
  }
  setShouldBobBeHarmed( shouldHeBeHarmed ) {
    this.shouldBobBeHarmed = shouldHeBeHarmed;
  }
  doHarmToBob() {
    if ( this.shouldBobBeHarmed === false ) {
      return;
    }
    this.health -= DAMAGE_VALUE_PER_TICK;
    this.onHealthUpdate.dispatch( this.health );
  }
}
