
  /**
   * chartjs-plugin-doughnutlabel-v3 v3.0.3
   * @license
   * author: Jeff Brower
   * chartjs-plugin-doughnutlabel.js v3.0.3
   * Released under the ISC license.
   */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('chart.js'), require('chart.js/helpers')) :
typeof define === 'function' && define.amd ? define(['chart.js', 'chart.js/helpers'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global['chartjs-plugin-doughnutlabel'] = factory(global.Chart, global.Chart.helpers));
}(this, (function (chart_js, helpers) { 'use strict';

const parseText = (text, chart) => typeof text === 'function' ? text(chart) : text;
const parseFont = (value) => {
    const defaults = chart_js.Chart.defaults;
    const size = helpers.valueOrDefault(value.size, defaults.font.size);
    const font = {
        family: helpers.valueOrDefault(value.family, defaults.font.family),
        // FontSpec types this as a number|string and the toLineHeight function
        // returns a number. The first argument 'value.lineHeight' can be a
        // number|string and 'size' is a number.
        lineHeight: helpers.toLineHeight(value.lineHeight, size),
        size: size,
        style: helpers.valueOrDefault(value.style, defaults.font.style),
        weight: helpers.valueOrDefault(value.weight, null),
        string: ''
    };
    // Add a 'string' property to our font object.
    font.string = utils.toFontString(font);
    return font;
};
const toFontString = (font) => {
    if (!font || helpers.isNullOrUndef(font.size) || helpers.isNullOrUndef(font.family)) {
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
            const font = utils.parseFont(helpers.resolve([label.font, options.font, chart_js.Chart.defaults.font], ctx, 0) || chart_js.Chart.defaults.font);
            const color = helpers.resolve([label.color, options.color, chart_js.Chart.defaults.color], ctx, 0);
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
        const innerDiameter = chart_js.DoughnutController.prototype.innerRadius * 2;
        const fitRatio = innerDiameter / hypotenuse;
        // Adjust the font if necessary and recalculate the text area after
        // applying the fit ratio
        if (fitRatio < 1) {
            innerLabels.forEach(innerLabel => {
                innerLabel.font.size = Math.floor(innerLabel.font.size * fitRatio);
                innerLabel.font.lineHeight = 1.2; // was undefined
                innerLabel.font = utils.parseFont(helpers.resolve([innerLabel.font, null], ctx, 0) || chart_js.Chart.defaults.font);
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

chart_js.Chart.register(DoughnutLabel, ...chart_js.registerables);

return DoughnutLabel;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnRqcy1wbHVnaW4tZG91Z2hudXRsYWJlbC5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL3V0aWxzLnRzIiwiLi4vc3JjL2NvcmUudHMiLCIuLi9zcmMvcGx1Z2luLnRzIiwiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExhYmVsVGV4dCB9IGZyb20gJy4vLi4vdHlwZXMvb3B0aW9ucy5kJztcclxuaW1wb3J0IHtDaGFydCwgRm9udFNwZWN9IGZyb20gJ2NoYXJ0LmpzJztcclxuaW1wb3J0IHsgdmFsdWVPckRlZmF1bHQsIGlzTnVsbE9yVW5kZWYsIHRvTGluZUhlaWdodCB9IGZyb20gJ2NoYXJ0LmpzL2hlbHBlcnMnO1xyXG5pbXBvcnQgeyBGb250LCBMYWJlbE9wdGlvbnMgfSBmcm9tICcuLi90eXBlcy9vcHRpb25zJztcclxuXHJcblxyXG5jb25zdCBwYXJzZVRleHQgPSAodGV4dDogTGFiZWxUZXh0LCBjaGFydDogQ2hhcnQpOiBzdHJpbmcgPT4gdHlwZW9mIHRleHQgPT09ICdmdW5jdGlvbicgPyB0ZXh0KGNoYXJ0KSA6IHRleHQ7XHJcblxyXG5jb25zdCBwYXJzZUZvbnQgPSAodmFsdWU6IEZvbnRTcGVjKTogRm9udCA9PiB7XHJcbiAgY29uc3QgZGVmYXVsdHMgPSBDaGFydC5kZWZhdWx0cztcclxuICBjb25zdCBzaXplID0gIHZhbHVlT3JEZWZhdWx0KHZhbHVlLnNpemUsIGRlZmF1bHRzLmZvbnQuc2l6ZSk7XHJcbiAgY29uc3QgZm9udDogRm9udCA9IHtcclxuICAgIGZhbWlseTogdmFsdWVPckRlZmF1bHQodmFsdWUuZmFtaWx5LCBkZWZhdWx0cy5mb250LmZhbWlseSksXHJcbiAgICAvLyBGb250U3BlYyB0eXBlcyB0aGlzIGFzIGEgbnVtYmVyfHN0cmluZyBhbmQgdGhlIHRvTGluZUhlaWdodCBmdW5jdGlvblxyXG4gICAgLy8gcmV0dXJucyBhIG51bWJlci4gVGhlIGZpcnN0IGFyZ3VtZW50ICd2YWx1ZS5saW5lSGVpZ2h0JyBjYW4gYmUgYVxyXG4gICAgLy8gbnVtYmVyfHN0cmluZyBhbmQgJ3NpemUnIGlzIGEgbnVtYmVyLlxyXG4gICAgbGluZUhlaWdodDogdG9MaW5lSGVpZ2h0KHZhbHVlLmxpbmVIZWlnaHQgYXMgdW5rbm93biBhcyBzdHJpbmcsIHNpemUpLFxyXG4gICAgc2l6ZTogc2l6ZSxcclxuICAgIHN0eWxlOiB2YWx1ZU9yRGVmYXVsdCh2YWx1ZS5zdHlsZSwgZGVmYXVsdHMuZm9udC5zdHlsZSksXHJcbiAgICB3ZWlnaHQ6IHZhbHVlT3JEZWZhdWx0KHZhbHVlLndlaWdodCwgbnVsbCksXHJcbiAgICBzdHJpbmc6ICcnXHJcbiAgfTtcclxuXHJcbiAgLy8gQWRkIGEgJ3N0cmluZycgcHJvcGVydHkgdG8gb3VyIGZvbnQgb2JqZWN0LlxyXG4gIGZvbnQuc3RyaW5nID0gdXRpbHMudG9Gb250U3RyaW5nKGZvbnQpO1xyXG4gIHJldHVybiBmb250O1xyXG59O1xyXG5cclxuY29uc3QgdG9Gb250U3RyaW5nID0gKGZvbnQ6IEZvbnQpOiBzdHJpbmcgPT4ge1xyXG4gIGlmICghZm9udCB8fCBpc051bGxPclVuZGVmKGZvbnQuc2l6ZSkgfHwgaXNOdWxsT3JVbmRlZihmb250LmZhbWlseSkpIHtcclxuICAgIHJldHVybiAnJztcclxuICB9XHJcblxyXG4gIHJldHVybiAoZm9udC5zdHlsZSA/IGZvbnQuc3R5bGUgKyAnICcgOiAnJylcclxuICAgICsgKGZvbnQud2VpZ2h0ID8gZm9udC53ZWlnaHQgKyAnICcgOiAnJylcclxuICAgICsgZm9udC5zaXplICsgJ3B4ICdcclxuICAgICsgZm9udC5mYW1pbHk7XHJcbn07XHJcblxyXG5jb25zdCB0ZXh0U2l6ZSA9IChjaGFydDogQ2hhcnQsIGxhYmVsczogTGFiZWxPcHRpb25zW10pOiB7aGVpZ2h0OiBudW1iZXIsIHdpZHRoOiBudW1iZXJ9ID0+IHtcclxuICBjb25zdCB7Y3R4fSA9IGNoYXJ0O1xyXG4gIGNvbnN0IHByZXYgPSBjdHguZm9udDtcclxuICBsZXQgd2lkdGggPSAwO1xyXG4gIGxldCBoZWlnaHQgPSAwO1xyXG5cclxuICBsYWJlbHMuZm9yRWFjaChsYWJlbCA9PiB7XHJcbiAgICAvLyBXZSBhbGxvdyAndGV4dCcgdG8gYmUgYSBzdHJpbmcgb3IgdGhlIHJldHVybiB2YWx1ZSBvZiBhIGZ1bmN0aW9uIGFzXHJcbiAgICAvLyBhIHN0cmluZy5cclxuICAgIGNvbnN0IHRleHQgPSB0eXBlb2YgbGFiZWwudGV4dCA9PT0gJ2Z1bmN0aW9uJyA/IGxhYmVsLnRleHQoY2hhcnQpIDogbGFiZWwudGV4dDtcclxuICAgIGN0eC5mb250ID0gbGFiZWwuZm9udCA/IGxhYmVsLmZvbnQuc3RyaW5nIDogJyc7XHJcbiAgICB3aWR0aCA9IE1hdGgubWF4KGN0eC5tZWFzdXJlVGV4dCh0ZXh0KS53aWR0aCwgd2lkdGgpO1xyXG4gICAgaGVpZ2h0ICs9IGxhYmVsLmZvbnQubGluZUhlaWdodDtcclxuICB9KTtcclxuXHJcbiAgY3R4LmZvbnQgPSBwcmV2O1xyXG5cclxuICBjb25zdCByZXN1bHQgPSB7XHJcbiAgICBoZWlnaHQ6IGhlaWdodCxcclxuICAgIHdpZHRoOiB3aWR0aFxyXG4gIH07XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHV0aWxzID0ge1xyXG4gIHBhcnNlVGV4dCxcclxuICBwYXJzZUZvbnQsXHJcbiAgdG9Gb250U3RyaW5nLFxyXG4gIHRleHRTaXplLFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgdXRpbHM7XHJcbiIsImltcG9ydCB7IExhYmVsT3B0aW9ucywgT3B0aW9ucyB9IGZyb20gJy4vLi4vdHlwZXMvb3B0aW9ucy5kJztcclxuaW1wb3J0IHtDaGFydCwgRG91Z2hudXRDb250cm9sbGVyfSBmcm9tICdjaGFydC5qcyc7XHJcbmltcG9ydCB7cmVzb2x2ZX0gZnJvbSAnY2hhcnQuanMvaGVscGVycydcclxuaW1wb3J0IHV0aWxzIGZyb20gJy4vdXRpbHMnO1xyXG5cclxuY29uc3QgZHJhd0RvdWdobnV0TGFiZWwgPSAoY2hhcnQ6IENoYXJ0LCBvcHRpb25zOiBPcHRpb25zKTogdm9pZCA9PiB7XHJcblxyXG4gIGlmIChjaGFydC5jaGFydEFyZWEgJiYgb3B0aW9ucykge1xyXG4gICAgY29uc3Qge2xhYmVsc30gPSBvcHRpb25zO1xyXG4gICAgaWYgKCFsYWJlbHM/Lmxlbmd0aCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCB7Y3R4LCBjaGFydEFyZWE6IHt0b3AsIHJpZ2h0LCBib3R0b20sIGxlZnR9fSA9IGNoYXJ0O1xyXG5cclxuICAgIGNvbnN0IGlubmVyTGFiZWxzOiBMYWJlbE9wdGlvbnNbXSA9IFtdO1xyXG5cclxuICAgICAgbGFiZWxzLmZvckVhY2gobGFiZWwgPT4ge1xyXG4gICAgICAgIGNvbnN0IHRleHQgPSB1dGlscy5wYXJzZVRleHQobGFiZWwudGV4dCwgY2hhcnQpO1xyXG4gICAgICAgIGNvbnN0IGZvbnQgPSB1dGlscy5wYXJzZUZvbnQocmVzb2x2ZShbbGFiZWwuZm9udCwgb3B0aW9ucy5mb250LCBDaGFydC5kZWZhdWx0cy5mb250XSwgY3R4LCAwKSB8fCBDaGFydC5kZWZhdWx0cy5mb250KTtcclxuICAgICAgICBjb25zdCBjb2xvciA9IHJlc29sdmUoXHJcbiAgICAgICAgICBbbGFiZWwuY29sb3IsIG9wdGlvbnMuY29sb3IsIENoYXJ0LmRlZmF1bHRzLmNvbG9yXSxcclxuICAgICAgICAgIGN0eCxcclxuICAgICAgICAgIDBcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCBpbm5lckxhYmVsID0ge1xyXG4gICAgICAgICAgdGV4dCxcclxuICAgICAgICAgIGZvbnQsXHJcbiAgICAgICAgICBjb2xvcjogY29sb3IgPz8gJyMwMDAnLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaW5uZXJMYWJlbHMucHVzaChpbm5lckxhYmVsKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBsZXQgdGV4dEFyZWFTaXplID0gdXRpbHMudGV4dFNpemUoY2hhcnQsIGlubmVyTGFiZWxzKTtcclxuXHJcbiAgICAgIC8vIENhbGN1bGF0ZSB0aGUgYWRqdXN0bWVudCByYXRpbyB0byBmaXQgdGhlIHRleHQgYXJlYSBpbnRvIHRoZSBkb3VnaG51dFxyXG4gICAgICAvLyBpbm5lciBjaXJjbGVcclxuICAgICAgY29uc3QgaHlwb3RlbnVzZSA9IE1hdGguc3FydChcclxuICAgICAgICBNYXRoLnBvdyh0ZXh0QXJlYVNpemUud2lkdGgsIDIpICsgTWF0aC5wb3codGV4dEFyZWFTaXplLmhlaWdodCwgMilcclxuICAgICAgKTtcclxuICAgICAgY29uc3QgaW5uZXJEaWFtZXRlciA9IERvdWdobnV0Q29udHJvbGxlci5wcm90b3R5cGUuaW5uZXJSYWRpdXMgKiAyO1xyXG4gICAgICBjb25zdCBmaXRSYXRpbyA9IGlubmVyRGlhbWV0ZXIgLyBoeXBvdGVudXNlO1xyXG5cclxuICAgICAgLy8gQWRqdXN0IHRoZSBmb250IGlmIG5lY2Vzc2FyeSBhbmQgcmVjYWxjdWxhdGUgdGhlIHRleHQgYXJlYSBhZnRlclxyXG4gICAgICAvLyBhcHBseWluZyB0aGUgZml0IHJhdGlvXHJcbiAgICAgIGlmIChmaXRSYXRpbyA8IDEpIHtcclxuICAgICAgICBpbm5lckxhYmVscy5mb3JFYWNoKGlubmVyTGFiZWwgPT4ge1xyXG4gICAgICAgICAgaW5uZXJMYWJlbC5mb250LnNpemUgPSBNYXRoLmZsb29yKGlubmVyTGFiZWwuZm9udC5zaXplICogZml0UmF0aW8pO1xyXG4gICAgICAgICAgaW5uZXJMYWJlbC5mb250LmxpbmVIZWlnaHQgPSAxLjI7IC8vIHdhcyB1bmRlZmluZWRcclxuICAgICAgICAgIGlubmVyTGFiZWwuZm9udCA9IHV0aWxzLnBhcnNlRm9udChcclxuICAgICAgICAgICAgcmVzb2x2ZShbaW5uZXJMYWJlbC5mb250LCBudWxsXSwgY3R4LCAwKSB8fCBDaGFydC5kZWZhdWx0cy5mb250XHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0ZXh0QXJlYVNpemUgPSB1dGlscy50ZXh0U2l6ZShjaGFydCwgaW5uZXJMYWJlbHMpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcclxuICAgICAgY3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XHJcblxyXG4gICAgICAvLyBUaGUgY2VudGVyIG9mIHRoZSBpbm5lciBjaXJjbGVcclxuICAgICAgY29uc3QgY2VudGVyWCA9IChsZWZ0ICsgcmlnaHQpIC8gMjtcclxuICAgICAgY29uc3QgY2VudGVyWSA9ICh0b3AgKyBib3R0b20pIC8gMjtcclxuXHJcbiAgICAgIC8vIFRoZSB0b3AgWSBjb29yZGluYXRlIG9mIHRoZSB0ZXh0IGFyZWFcclxuICAgICAgY29uc3QgdG9wWSA9IGNlbnRlclkgLSB0ZXh0QXJlYVNpemUuaGVpZ2h0IC8gMjtcclxuXHJcbiAgICAgIGxldCBpO1xyXG4gICAgICBjb25zdCBpbGVuID0gaW5uZXJMYWJlbHMubGVuZ3RoO1xyXG4gICAgICBsZXQgY3VycmVudEhlaWdodCA9IDA7XHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBpbGVuOyArK2kpIHtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gaW5uZXJMYWJlbHNbaV0uY29sb3I7XHJcbiAgICAgICAgY3R4LmZvbnQgPSBpbm5lckxhYmVsc1tpXS5mb250LnN0cmluZztcclxuXHJcbiAgICAgICAgLy8gVGhlIFkgY2VudGVyIG9mIGVhY2ggbGluZVxyXG4gICAgICAgIGNvbnN0IGxpbmVDZW50ZXJZID1cclxuICAgICAgICAgIHRvcFkgKyBpbm5lckxhYmVsc1tpXS5mb250LmxpbmVIZWlnaHQgLyAyICsgY3VycmVudEhlaWdodDtcclxuICAgICAgICBjdXJyZW50SGVpZ2h0ICs9IGlubmVyTGFiZWxzW2ldLmZvbnQubGluZUhlaWdodDtcclxuXHJcbiAgICAgICAgLy8gV2UgYWxsb3cgJ3RleHQnIHRvIGJlIGEgc3RyaW5nIG9yIHRoZSByZXR1cm4gdmFsdWUgb2YgYSBmdW5jdGlvbiBhc1xyXG4gICAgICAgIC8vIGEgc3RyaW5nLlxyXG4gICAgICAgIC8vIGNvbnN0IHRleHQgPSB0eXBlb2YgaW5uZXJMYWJlbHNbaV0udGV4dCA9PT0gJ2Z1bmN0aW9uJyA/IGlubmVyTGFiZWxzW2ldLnRleHQoY2hhcnQpIDogaW5uZXJMYWJlbHNbaV0udGV4dDtcclxuICAgICAgICBjb25zdCB0ZXh0ID0gdXRpbHMucGFyc2VUZXh0KGlubmVyTGFiZWxzW2ldLnRleHQsIGNoYXJ0KTtcclxuICAgICAgICAvLyBEcmF3IGVhY2ggbGluZSBvZiB0ZXh0XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KHRleHQsIGNlbnRlclgsIGxpbmVDZW50ZXJZKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY29yZUZ1bmN0aW9ucyA9IHtcclxuICBkcmF3RG91Z2hudXRMYWJlbCxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRyYXdEb3VnaG51dExhYmVsO1xyXG4iLCJpbXBvcnQgeyBDaGFydCB9IGZyb20gJ2NoYXJ0LmpzJztcclxuaW1wb3J0IHsgT3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzL29wdGlvbnMnO1xyXG5pbXBvcnQgZHJhd0RvdWdobnV0TGFiZWwgZnJvbSAnLi9jb3JlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBpZDogJ2RvdWdobnV0TGFiZWwnLFxyXG4gIGRlZmF1bHRzOiB7XHJcbiAgICBmb250OiB7XHJcbiAgICAgIGZhbWlseTogJ3NhbnMtc2VyaWYnLFxyXG4gICAgICBzaXplOiAxNixcclxuICAgICAgc3R5bGU6ICdub3JtYWwnLFxyXG4gICAgICB3ZWlnaHQ6ICdub3JtYWwnLFxyXG4gICAgICBsaW5lSGVpZ2h0OiAxLjIsXHJcbiAgICAgIHN0cmluZzogJzE2cHggc2Fucy1zZXJpZidcclxuICAgIH0sXHJcbiAgfSxcclxuICBiZWZvcmVEcmF3OiAoY2hhcnQ6IENoYXJ0LCBhcmdzOiB7Y2FuY2VsbGFibGU6IHRydWV9LCBvcHRpb25zOiBPcHRpb25zKTogdm9pZCA9PiBkcmF3RG91Z2hudXRMYWJlbChjaGFydCwgb3B0aW9ucyksXHJcbn1cclxuIiwiaW1wb3J0IHtDaGFydCwgcmVnaXN0ZXJhYmxlc30gZnJvbSAnY2hhcnQuanMnO1xyXG5pbXBvcnQgRG91Z2hudXRMYWJlbCBmcm9tICcuL3BsdWdpbic7XHJcblxyXG5DaGFydC5yZWdpc3RlcihEb3VnaG51dExhYmVsLCAuLi5yZWdpc3RlcmFibGVzKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IERvdWdobnV0TGFiZWw7XHJcbiJdLCJuYW1lcyI6WyJDaGFydCIsInZhbHVlT3JEZWZhdWx0IiwidG9MaW5lSGVpZ2h0IiwiaXNOdWxsT3JVbmRlZiIsInJlc29sdmUiLCJEb3VnaG51dENvbnRyb2xsZXIiLCJyZWdpc3RlcmFibGVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFNQSxNQUFNLFNBQVMsR0FBRyxDQUFDLElBQWUsRUFBRSxLQUFZLEtBQWEsT0FBTyxJQUFJLEtBQUssVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUM7QUFFN0csTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFlO0lBQ2hDLE1BQU0sUUFBUSxHQUFHQSxjQUFLLENBQUMsUUFBUSxDQUFDO0lBQ2hDLE1BQU0sSUFBSSxHQUFJQyxzQkFBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3RCxNQUFNLElBQUksR0FBUztRQUNqQixNQUFNLEVBQUVBLHNCQUFjLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7OztRQUkxRCxVQUFVLEVBQUVDLG9CQUFZLENBQUMsS0FBSyxDQUFDLFVBQStCLEVBQUUsSUFBSSxDQUFDO1FBQ3JFLElBQUksRUFBRSxJQUFJO1FBQ1YsS0FBSyxFQUFFRCxzQkFBYyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDdkQsTUFBTSxFQUFFQSxzQkFBYyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDO1FBQzFDLE1BQU0sRUFBRSxFQUFFO0tBQ1gsQ0FBQzs7SUFHRixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkMsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDLENBQUM7QUFFRixNQUFNLFlBQVksR0FBRyxDQUFDLElBQVU7SUFDOUIsSUFBSSxDQUFDLElBQUksSUFBSUUscUJBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUlBLHFCQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ25FLE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFFRCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsR0FBRyxFQUFFO1dBQ3JDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDO1VBQ3RDLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSztVQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ2xCLENBQUMsQ0FBQztBQUVGLE1BQU0sUUFBUSxHQUFHLENBQUMsS0FBWSxFQUFFLE1BQXNCO0lBQ3BELE1BQU0sRUFBQyxHQUFHLEVBQUMsR0FBRyxLQUFLLENBQUM7SUFDcEIsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztJQUN0QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDZCxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFFZixNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUs7OztRQUdsQixNQUFNLElBQUksR0FBRyxPQUFPLEtBQUssQ0FBQyxJQUFJLEtBQUssVUFBVSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztRQUMvRSxHQUFHLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQy9DLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JELE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztLQUNqQyxDQUFDLENBQUM7SUFFSCxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUVoQixNQUFNLE1BQU0sR0FBRztRQUNiLE1BQU0sRUFBRSxNQUFNO1FBQ2QsS0FBSyxFQUFFLEtBQUs7S0FDYixDQUFDO0lBRUYsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBR0ssTUFBTSxLQUFLLEdBQUc7SUFDbkIsU0FBUztJQUNULFNBQVM7SUFDVCxZQUFZO0lBQ1osUUFBUTtDQUNUOztBQ2pFRCxNQUFNLGlCQUFpQixHQUFHLENBQUMsS0FBWSxFQUFFLE9BQWdCO0lBRXZELElBQUksS0FBSyxDQUFDLFNBQVMsSUFBSSxPQUFPLEVBQUU7UUFDOUIsTUFBTSxFQUFDLE1BQU0sRUFBQyxHQUFHLE9BQU8sQ0FBQztRQUN6QixJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRTtZQUNuQixPQUFPO1NBQ1I7UUFDRCxNQUFNLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxFQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBQyxFQUFDLEdBQUcsS0FBSyxDQUFDO1FBRTNELE1BQU0sV0FBVyxHQUFtQixFQUFFLENBQUM7UUFFckMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLO1lBQ2xCLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNoRCxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDQyxlQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUVKLGNBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJQSxjQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RILE1BQU0sS0FBSyxHQUFHSSxlQUFPLENBQ25CLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFSixjQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUNsRCxHQUFHLEVBQ0gsQ0FBQyxDQUNGLENBQUM7WUFFRixNQUFNLFVBQVUsR0FBRztnQkFDakIsSUFBSTtnQkFDSixJQUFJO2dCQUNKLEtBQUssRUFBRSxLQUFLLElBQUksTUFBTTthQUN2QixDQUFDO1lBQ0YsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM5QixDQUFDLENBQUM7UUFFSCxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQzs7O1FBSXRELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQzFCLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQ25FLENBQUM7UUFDRixNQUFNLGFBQWEsR0FBR0ssMkJBQWtCLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFDbkUsTUFBTSxRQUFRLEdBQUcsYUFBYSxHQUFHLFVBQVUsQ0FBQzs7O1FBSTVDLElBQUksUUFBUSxHQUFHLENBQUMsRUFBRTtZQUNoQixXQUFXLENBQUMsT0FBTyxDQUFDLFVBQVU7Z0JBQzVCLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUM7Z0JBQ25FLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztnQkFDakMsVUFBVSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUMvQkQsZUFBTyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUlKLGNBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUNoRSxDQUFDO2FBQ0gsQ0FBQyxDQUFDO1lBRUgsWUFBWSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1NBQ25EO1FBRUQsR0FBRyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDekIsR0FBRyxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUM7O1FBRzVCLE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDLENBQUM7UUFDbkMsTUFBTSxPQUFPLEdBQUcsQ0FBQyxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsQ0FBQzs7UUFHbkMsTUFBTSxJQUFJLEdBQUcsT0FBTyxHQUFHLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBRS9DLElBQUksQ0FBQyxDQUFDO1FBQ04sTUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztRQUNoQyxJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUM7UUFDdEIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDekIsR0FBRyxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQ3JDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7O1lBR3RDLE1BQU0sV0FBVyxHQUNmLElBQUksR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUFDO1lBQzVELGFBQWEsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQzs7OztZQUtoRCxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7O1lBRXpELEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztTQUMxQztLQUNGO0FBQ0wsQ0FBQzs7QUNuRkQsb0JBQWU7SUFDYixFQUFFLEVBQUUsZUFBZTtJQUNuQixRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUU7WUFDSixNQUFNLEVBQUUsWUFBWTtZQUNwQixJQUFJLEVBQUUsRUFBRTtZQUNSLEtBQUssRUFBRSxRQUFRO1lBQ2YsTUFBTSxFQUFFLFFBQVE7WUFDaEIsVUFBVSxFQUFFLEdBQUc7WUFDZixNQUFNLEVBQUUsaUJBQWlCO1NBQzFCO0tBQ0Y7SUFDRCxVQUFVLEVBQUUsQ0FBQyxLQUFZLEVBQUUsSUFBeUIsRUFBRSxPQUFnQixLQUFXLGlCQUFpQixDQUFDLEtBQUssRUFBRSxPQUFPLENBQUM7Q0FDbkg7O0FDZERBLGNBQUssQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUdNLHNCQUFhLENBQUM7Ozs7Ozs7OyJ9
