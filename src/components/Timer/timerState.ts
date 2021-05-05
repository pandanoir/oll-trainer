const createStringEnum = <
  T extends { [K in string]: unknown },
  Prefix extends string
>(
  _prefix: Prefix,
  obj: {
    [K in keyof T]: K extends string ? `${Prefix}_${Lowercase<K>}` : never;
  }
) => obj;

const timerStatePrefix = 'timer_state';

export const {
  IDOLING,
  WORKING,
  STEADY,
  READY,
  INSPECTION,
  INSPECTION_READY,
  INSPECTION_STEADY,
} = createStringEnum(timerStatePrefix, {
  IDOLING: `${timerStatePrefix}_idoling`,
  WORKING: `${timerStatePrefix}_working`,
  STEADY: `${timerStatePrefix}_steady`,
  READY: `${timerStatePrefix}_ready`,
  INSPECTION: `${timerStatePrefix}_inspection`,
  INSPECTION_READY: `${timerStatePrefix}_inspection_ready`,
  INSPECTION_STEADY: `${timerStatePrefix}_inspection_steady`,
} as const);

export type TimerState =
  | typeof IDOLING
  | typeof WORKING
  | typeof READY
  | typeof STEADY
  | typeof INSPECTION
  | typeof INSPECTION_READY
  | typeof INSPECTION_STEADY;
