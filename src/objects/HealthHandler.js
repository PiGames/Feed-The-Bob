const DAMAGE_VALUE_PER_TICK = 33.4;
const CAN_BE_HARMED_REFRESH_INTERVAL = 2000;

export default class HealthHandler {
  constructor() {
    this.health = 100;
    this.shouldBobBeHarmed = false;
    this.punishementMultiplier = 1;
    this.canBeHarmed = true;

    this.onHealthUpdate = new Phaser.Signal();
  }
  setShouldBobBeHarmed( shouldHeBeHarmed, shouldDoubleThePunishement ) {
    this.shouldBobBeHarmed = shouldHeBeHarmed;
    this.punishementMultiplier = shouldDoubleThePunishement ? 2 : 1;
  }
  doHarmToBob() {
    if ( this.shouldBobBeHarmed === false || this.canBeHarmed === false ) {
      return;
    }
    this.health -= DAMAGE_VALUE_PER_TICK * this.punishementMultiplier;
    this.canBeHarmed = false;
    window.setTimeout( () => this.canBeHarmed = true, CAN_BE_HARMED_REFRESH_INTERVAL );
    this.onHealthUpdate.dispatch( this.health );
  }
}
