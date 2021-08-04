
  /**
   * @scottalan/chartjs-plugin-doughnutlabel v3.0.2
   * @license
   * author: 
   * chartjs-plugin-doughnutlabel.js v3.0.2
   * Released under the ISC license.
   */

import { Chart, DoughnutController } from 'chart.js';
import { valueOrDefault, toLineHeight, isNullOrUndef, resolve } from 'chart.js/helpers';

const parseText = (text, chart) => typeof text === 'function' ? text(chart) : text;
const parseFont = (value) => {
    const defaults = Chart.defaults;
    const size = valueOrDefault(value.size, defaults.font.size);
    const font = {
        family: valueOrDefault(value.family, defaults.font.family),
        // FontSpec types this as a number|string and the toLineHeight function
        // returns a number. The first argument 'value.lineHeight' can be a
        // number|string and 'size' is a number.
        lineHeight: toLineHeight(value.lineHeight, size),
        size: size,
        style: valueOrDefault(value.style, defaults.font.style),
        weight: valueOrDefault(value.weight, null),
        string: ''
    };
    // Add a 'string' property to our font object.
    font.string = utils.toFontString(font);
    return font;
};
const toFontString = (font) => {
    if (!font || isNullOrUndef(font.size) || isNullOrUndef(font.family)) {
        return '';
    }
    return (font.style ? font.style + ' ' : '')
        + (font.weight ? font.weight + ' ' : '')
        + font.size + 'px '
        + font.family;
};
const textSize = (chart, labels) => {
    const { ctx } = chart;
    const prev = ctx.font;
    let width = 0;
    let height = 0;
    labels.forEach(label => {
        // We allow 'text' to be a string or the return value of a function as
        // a string.
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
const utils = {
    parseText,
    parseFont,
    toFontString,
    textSize,
};

const drawDoughnutLabel = (chart, options) => {
    if (chart.chartArea && options) {
        const { labels } = options;
        if (!labels?.length) {
            return;
        }
        const { ctx, chartArea: { top, right, bottom, left } } = chart;
        const innerLabels = [];
        labels.forEach(label => {
            const text = utils.parseText(label.text, chart);
            const font = utils.parseFont(resolve([label.font, options.font, Chart.defaults.font], ctx, 0) || Chart.defaults.font);
            const color = resolve([label.color, options.color, Chart.defaults.color], ctx, 0);
            const innerLabel = {
                text,
                font,
                color: color ?? '#000',
            };
            innerLabels.push(innerLabel);
        });
        let textAreaSize = utils.textSize(chart, innerLabels);
        // Calculate the adjustment ratio to fit the text area into the doughnut
        // inner circle
        const hypotenuse = Math.sqrt(Math.pow(textAreaSize.width, 2) + Math.pow(textAreaSize.height, 2));
        const innerDiameter = DoughnutController.prototype.innerRadius * 2;
        const fitRatio = innerDiameter / hypotenuse;
        // Adjust the font if necessary and recalculate the text area after
        // applying the fit ratio
        if (fitRatio < 1) {
            innerLabels.forEach(innerLabel => {
                innerLabel.font.size = Math.floor(innerLabel.font.size * fitRatio);
                innerLabel.font.lineHeight = 1.2; // was undefined
                innerLabel.font = utils.parseFont(resolve([innerLabel.font, null], ctx, 0) || Chart.defaults.font);
            });
            textAreaSize = utils.textSize(chart, innerLabels);
        }
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // The center of the inner circle
        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 2;
        // The top Y coordinate of the text area
        const topY = centerY - textAreaSize.height / 2;
        let i;
        const ilen = innerLabels.length;
        let currentHeight = 0;
        for (i = 0; i < ilen; ++i) {
            ctx.fillStyle = innerLabels[i].color;
            ctx.font = innerLabels[i].font.string;
            // The Y center of each line
            const lineCenterY = topY + innerLabels[i].font.lineHeight / 2 + currentHeight;
            currentHeight += innerLabels[i].font.lineHeight;
            // We allow 'text' to be a string or the return value of a function as
            // a string.
            // const text = typeof innerLabels[i].text === 'function' ? innerLabels[i].text(chart) : innerLabels[i].text;
            const text = utils.parseText(innerLabels[i].text, chart);
            // Draw each line of text
            ctx.fillText(text, centerX, lineCenterY);
        }
    }
};
const coreFunctions = {
    drawDoughnutLabel,
};

var DoughnutLabel = {
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
    beforeDraw: (chart, args, options) => drawDoughnutLabel(chart, options),
};

export { coreFunctions, DoughnutLabel as default };
