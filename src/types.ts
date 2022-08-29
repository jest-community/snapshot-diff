import type { OldPlugin } from 'pretty-format';
import type { DiffOptions as UpstreamDiffOptions } from 'jest-diff';

export interface DiffOptions extends UpstreamDiffOptions {
  stablePatchmarks?: boolean;
}

export interface DiffSerializer extends OldPlugin {
  diffOptions?: (valueA: unknown, valueB: unknown) => DiffOptions;
}
