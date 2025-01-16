import { IoReactNativeCbor } from './proxy';

export function multiply(a: number, b: number): Promise<number> {
  return IoReactNativeCbor.multiply(a, b);
}
