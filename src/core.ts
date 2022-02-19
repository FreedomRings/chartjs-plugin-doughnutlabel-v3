import { LabelOptions, Options } from './../types/options.d';
import {Chart, DoughnutController} from 'chart.js';
import {resolve} from 'chart.js/helpers'
import utils from './utils';

const drawDoughnutLabel = (chart: Chart, options: Options): void => {

  if (chart.chartArea && options) {
    const {labels} = options;
    if (!labels?.length) {
      return;
    }
    const {ctx, chartArea: {top, right, bottom, left}} = chart;

    const innerLabels: LabelOptions[] = [];

      labels.forEach(label => {
        const text = utils.parseText(label.text, chart);
        const font = utils.parseFont(resolve([label.font, options.font, Chart.defaults.font], ctx, 0) || Chart.defaults.font);
        const color = resolve(
          [label.color, options.color, Chart.defaults.color],
          ctx,
          0
        );

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
      const hypotenuse = Math.sqrt(
        Math.pow(textAreaSize.width, 2) + Math.pow(textAreaSize.height, 2)
      );
      const innerDiameter = DoughnutController.prototype.innerRadius * 2;
      const fitRatio = innerDiameter / hypotenuse;

      // Adjust the font if necessary and recalculate the text area after
      // applying the fit ratio
      if (fitRatio < 1) {
        innerLabels.forEach(innerLabel => {
          innerLabel.font.size = Math.floor(innerLabel.font.size * fitRatio);
          innerLabel.font.lineHeight = 1.2; // was undefined
          innerLabel.font = utils.parseFont(
            resolve([innerLabel.font, null], ctx, 0) || Chart.defaults.font
          );
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
        const lineCenterY =
          topY + innerLabels[i].font.lineHeight / 2 + currentHeight;
        currentHeight += innerLabels[i].font.lineHeight;

        // We allow 'text' to be a string or the return value of a function as
        // a string.
        // const text = typeof innerLabels[i].text === 'function' ? innerLabels[i].text(chart) : innerLabels[i].text;
        const text = utils.parseText(innerLabels[i].text, chart);
        // Draw each line of text
        ctx.fillText(text, centerX, lineCenterY);
      }
    }
}

export const coreFunctions = {
  drawDoughnutLabel,
};

export default drawDoughnutLabel;
