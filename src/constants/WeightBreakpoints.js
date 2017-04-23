export const SUPER_THIN_BREAKPOINT = 4;
export const THIN_BREAKPOINT = 6;
export const FAT_BREAKPOINT = 10;
export const SUPER_FAT_BREAKPOINT = 12;

export const THINNESS_LEVELS = [];
let d = 0;
for ( let i = 0; i < 8; i++ ) {
  THINNESS_LEVELS.push( d++ / 8 );
}

export const FATNESS_LEVELS = [];
d = 7;
for ( let i = 0; i < 6; i++ ) {
  FATNESS_LEVELS.push( d++ / 6 );
}
FATNESS_LEVELS.reverse();
