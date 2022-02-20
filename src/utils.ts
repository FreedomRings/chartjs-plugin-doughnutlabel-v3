import { LabelText } from './../types/options.d';
import {Chart, FontSpec} from 'chart.js';
import { valueOrDefault, isNullOrUndef, toLineHeight } from 'chart.js/helpers';
import { Font, LabelOptions } from '../types/options';

const parseText = (text: LabelText, chart: Chart): string => typeof text === 'function' ? text(chart) : text;

const parseFont = (value: FontSpec): Font => {
  const defaults = Chart.defaults;
  const size =  valueOrDefault(value.size, defaults.font.size);
  const font: Font = {
    family: valueOrDefault(value.family, defaults.font.family),
    // FontSpec types this as a number|string and the toLineHeight function
    // returns a number. The first argument 'value.lineHeight' can be a
    // number|string and 'size' is a number.
    lineHeight: toLineHeight(value.lineHeight as unknown as string, size),
    size: size,
    style: valueOrDefault(value.style, defaults.font.style),
    weight: valueOrDefault(value.weight, null),
    string: ''
  };

  // Add a 'string' property to our font object.
  font.string = utils.toFontString(font);
  return font;
};

const toFontString = (font: Font): string => {
  if (!font || isNullOrUndef(font.size) || isNullOrUndef(font.family)) {
    return '';
  }

  return (font.style ? font.style + ' ' : '')
    + (font.weight ? font.weight + ' ' : '')
    + font.size + 'px '
    + font.family;
};

const textSize = (chart: Chart, labels: LabelOptions[]): {height: number, width: number} => {
  const {ctx} = chart;
  const prev = ctx.font;
  let width = 0;
  let height = 0;

  labels.forEach(label => {
    // We allow 'text' to be a string or the return value of a function as a string.
    const text = typeof label.text === 'function' ? label.text(chart) : label.text;
    ctx.font = label.font ? label.font.string : '';
    width = Math.max(ctx.measureText(text).width, width);
    height += label.font.lineHeight;
  });

  ctx.font = prev;

  const result = {
    height: height,
    width: width
  };

  return result;
};


export const utils = {
  parseText,
  parseFont,
  toFontString,
  textSize,
};

export default utils;
