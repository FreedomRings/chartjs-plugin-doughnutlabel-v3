import { Chart } from 'chart.js';
import { Options } from '../types/options';
import drawDoughnutLabel from './core';

export default {
  id: 'doughnutLabel',
  defaults: {
    font: {
      family: 'sans-serif',
      size: 16,
      style: 'normal',
      weight: 'normal',
      lineHeight: 1.2,
      string: '16px sans-serif'
    },
  },
  beforeDraw: (chart: Chart, args: {cancellable: true}, options: Options): void => drawDoughnutLabel(chart, options),
}
