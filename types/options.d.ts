import { LabelText } from './options.d';
import { Chart, ChartComponent, Color, FontSpec } from 'chart.js';

// export interface Font extends FontSpec {
//   lineHeight: number;
//   string: string;
// }

export type Font = {
  lineHeight: number;
  string: string;
} & FontSpec;

export type LabelText = ((chart: Chart) => string) | string;

export interface LabelOptions {
  text: LabelText;
  font: Font;
  color: Color;
}

interface foo {
  yo: string;
}
export interface Options extends LabelOptions {
  /**
   * There can be multiple labels.
   */
  labels?: LabelOptions[];
}
