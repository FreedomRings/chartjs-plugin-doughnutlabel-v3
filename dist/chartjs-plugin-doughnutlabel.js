
  /**
   * npm package:  chartjs-plugin-doughnutlabel-v3 v1.2.0
   * 
   * Chart.js (Version 3) Doughnut Chart plugin to display
   * custom lines of text in the center of the circle.
   * 
   * author: Jeff Brower <jeff@pointhere.net>
   * 
   * supplies:  chartjs-plugin-doughnutlabel.js v1.2.0
   * Released under the MIT license.
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

chart_js.Chart.register(DoughnutLabel);

return DoughnutLabel;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnRqcy1wbHVnaW4tZG91Z2hudXRsYWJlbC5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL3V0aWxzLnRzIiwiLi4vc3JjL2NvcmUudHMiLCIuLi9zcmMvcGx1Z2luLnRzIiwiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExhYmVsVGV4dCB9IGZyb20gJy4vLi4vdHlwZXMvb3B0aW9ucy5kJztcclxuaW1wb3J0IHtDaGFydCwgRm9udFNwZWN9IGZyb20gJ2NoYXJ0LmpzJztcclxuaW1wb3J0IHsgdmFsdWVPckRlZmF1bHQsIGlzTnVsbE9yVW5kZWYsIHRvTGluZUhlaWdodCB9IGZyb20gJ2NoYXJ0LmpzL2hlbHBlcnMnO1xyXG5pbXBvcnQgeyBGb250LCBMYWJlbE9wdGlvbnMgfSBmcm9tICcuLi90eXBlcy9vcHRpb25zJztcclxuXHJcbmNvbnN0IHBhcnNlVGV4dCA9ICh0ZXh0OiBMYWJlbFRleHQsIGNoYXJ0OiBDaGFydCk6IHN0cmluZyA9PiB0eXBlb2YgdGV4dCA9PT0gJ2Z1bmN0aW9uJyA/IHRleHQoY2hhcnQpIDogdGV4dDtcclxuXHJcbmNvbnN0IHBhcnNlRm9udCA9ICh2YWx1ZTogRm9udFNwZWMpOiBGb250ID0+IHtcclxuICBjb25zdCBkZWZhdWx0cyA9IENoYXJ0LmRlZmF1bHRzO1xyXG4gIGNvbnN0IHNpemUgPSAgdmFsdWVPckRlZmF1bHQodmFsdWUuc2l6ZSwgZGVmYXVsdHMuZm9udC5zaXplKTtcclxuICBjb25zdCBmb250OiBGb250ID0ge1xyXG4gICAgZmFtaWx5OiB2YWx1ZU9yRGVmYXVsdCh2YWx1ZS5mYW1pbHksIGRlZmF1bHRzLmZvbnQuZmFtaWx5KSxcclxuICAgIC8vIEZvbnRTcGVjIHR5cGVzIHRoaXMgYXMgYSBudW1iZXJ8c3RyaW5nIGFuZCB0aGUgdG9MaW5lSGVpZ2h0IGZ1bmN0aW9uXHJcbiAgICAvLyByZXR1cm5zIGEgbnVtYmVyLiBUaGUgZmlyc3QgYXJndW1lbnQgJ3ZhbHVlLmxpbmVIZWlnaHQnIGNhbiBiZSBhXHJcbiAgICAvLyBudW1iZXJ8c3RyaW5nIGFuZCAnc2l6ZScgaXMgYSBudW1iZXIuXHJcbiAgICBsaW5lSGVpZ2h0OiB0b0xpbmVIZWlnaHQodmFsdWUubGluZUhlaWdodCBhcyB1bmtub3duIGFzIHN0cmluZywgc2l6ZSksXHJcbiAgICBzaXplOiBzaXplLFxyXG4gICAgc3R5bGU6IHZhbHVlT3JEZWZhdWx0KHZhbHVlLnN0eWxlLCBkZWZhdWx0cy5mb250LnN0eWxlKSxcclxuICAgIHdlaWdodDogdmFsdWVPckRlZmF1bHQodmFsdWUud2VpZ2h0LCBudWxsKSxcclxuICAgIHN0cmluZzogJydcclxuICB9O1xyXG5cclxuICAvLyBBZGQgYSAnc3RyaW5nJyBwcm9wZXJ0eSB0byBvdXIgZm9udCBvYmplY3QuXHJcbiAgZm9udC5zdHJpbmcgPSB1dGlscy50b0ZvbnRTdHJpbmcoZm9udCk7XHJcbiAgcmV0dXJuIGZvbnQ7XHJcbn07XHJcblxyXG5jb25zdCB0b0ZvbnRTdHJpbmcgPSAoZm9udDogRm9udCk6IHN0cmluZyA9PiB7XHJcbiAgaWYgKCFmb250IHx8IGlzTnVsbE9yVW5kZWYoZm9udC5zaXplKSB8fCBpc051bGxPclVuZGVmKGZvbnQuZmFtaWx5KSkge1xyXG4gICAgcmV0dXJuICcnO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChmb250LnN0eWxlID8gZm9udC5zdHlsZSArICcgJyA6ICcnKVxyXG4gICAgKyAoZm9udC53ZWlnaHQgPyBmb250LndlaWdodCArICcgJyA6ICcnKVxyXG4gICAgKyBmb250LnNpemUgKyAncHggJ1xyXG4gICAgKyBmb250LmZhbWlseTtcclxufTtcclxuXHJcbmNvbnN0IHRleHRTaXplID0gKGNoYXJ0OiBDaGFydCwgbGFiZWxzOiBMYWJlbE9wdGlvbnNbXSk6IHtoZWlnaHQ6IG51bWJlciwgd2lkdGg6IG51bWJlcn0gPT4ge1xyXG4gIGNvbnN0IHtjdHh9ID0gY2hhcnQ7XHJcbiAgY29uc3QgcHJldiA9IGN0eC5mb250O1xyXG4gIGxldCB3aWR0aCA9IDA7XHJcbiAgbGV0IGhlaWdodCA9IDA7XHJcblxyXG4gIGxhYmVscy5mb3JFYWNoKGxhYmVsID0+IHtcclxuICAgIC8vIFdlIGFsbG93ICd0ZXh0JyB0byBiZSBhIHN0cmluZyBvciB0aGUgcmV0dXJuIHZhbHVlIG9mIGEgZnVuY3Rpb24gYXMgYSBzdHJpbmcuXHJcbiAgICBjb25zdCB0ZXh0ID0gdHlwZW9mIGxhYmVsLnRleHQgPT09ICdmdW5jdGlvbicgPyBsYWJlbC50ZXh0KGNoYXJ0KSA6IGxhYmVsLnRleHQ7XHJcbiAgICBjdHguZm9udCA9IGxhYmVsLmZvbnQgPyBsYWJlbC5mb250LnN0cmluZyA6ICcnO1xyXG4gICAgd2lkdGggPSBNYXRoLm1heChjdHgubWVhc3VyZVRleHQodGV4dCkud2lkdGgsIHdpZHRoKTtcclxuICAgIGhlaWdodCArPSBsYWJlbC5mb250LmxpbmVIZWlnaHQ7XHJcbiAgfSk7XHJcblxyXG4gIGN0eC5mb250ID0gcHJldjtcclxuXHJcbiAgY29uc3QgcmVzdWx0ID0ge1xyXG4gICAgaGVpZ2h0OiBoZWlnaHQsXHJcbiAgICB3aWR0aDogd2lkdGhcclxuICB9O1xyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCB1dGlscyA9IHtcclxuICBwYXJzZVRleHQsXHJcbiAgcGFyc2VGb250LFxyXG4gIHRvRm9udFN0cmluZyxcclxuICB0ZXh0U2l6ZSxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHV0aWxzO1xyXG4iLCJpbXBvcnQgeyBMYWJlbE9wdGlvbnMsIE9wdGlvbnMgfSBmcm9tICcuLy4uL3R5cGVzL29wdGlvbnMuZCc7XHJcbmltcG9ydCB7Q2hhcnQsIERvdWdobnV0Q29udHJvbGxlcn0gZnJvbSAnY2hhcnQuanMnO1xyXG5pbXBvcnQge3Jlc29sdmV9IGZyb20gJ2NoYXJ0LmpzL2hlbHBlcnMnXHJcbmltcG9ydCB1dGlscyBmcm9tICcuL3V0aWxzJztcclxuXHJcbmNvbnN0IGRyYXdEb3VnaG51dExhYmVsID0gKGNoYXJ0OiBDaGFydCwgb3B0aW9uczogT3B0aW9ucyk6IHZvaWQgPT4ge1xyXG5cclxuICBpZiAoY2hhcnQuY2hhcnRBcmVhICYmIG9wdGlvbnMpIHtcclxuICAgIGNvbnN0IHtsYWJlbHN9ID0gb3B0aW9ucztcclxuICAgIGlmICghbGFiZWxzPy5sZW5ndGgpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3Qge2N0eCwgY2hhcnRBcmVhOiB7dG9wLCByaWdodCwgYm90dG9tLCBsZWZ0fX0gPSBjaGFydDtcclxuXHJcbiAgICBjb25zdCBpbm5lckxhYmVsczogTGFiZWxPcHRpb25zW10gPSBbXTtcclxuXHJcbiAgICAgIGxhYmVscy5mb3JFYWNoKGxhYmVsID0+IHtcclxuICAgICAgICBjb25zdCB0ZXh0ID0gdXRpbHMucGFyc2VUZXh0KGxhYmVsLnRleHQsIGNoYXJ0KTtcclxuICAgICAgICBjb25zdCBmb250ID0gdXRpbHMucGFyc2VGb250KHJlc29sdmUoW2xhYmVsLmZvbnQsIG9wdGlvbnMuZm9udCwgQ2hhcnQuZGVmYXVsdHMuZm9udF0sIGN0eCwgMCkgfHwgQ2hhcnQuZGVmYXVsdHMuZm9udCk7XHJcbiAgICAgICAgY29uc3QgY29sb3IgPSByZXNvbHZlKFxyXG4gICAgICAgICAgW2xhYmVsLmNvbG9yLCBvcHRpb25zLmNvbG9yLCBDaGFydC5kZWZhdWx0cy5jb2xvcl0sXHJcbiAgICAgICAgICBjdHgsXHJcbiAgICAgICAgICAwXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgaW5uZXJMYWJlbCA9IHtcclxuICAgICAgICAgIHRleHQsXHJcbiAgICAgICAgICBmb250LFxyXG4gICAgICAgICAgY29sb3I6IGNvbG9yID8/ICcjMDAwJyxcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlubmVyTGFiZWxzLnB1c2goaW5uZXJMYWJlbCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgbGV0IHRleHRBcmVhU2l6ZSA9IHV0aWxzLnRleHRTaXplKGNoYXJ0LCBpbm5lckxhYmVscyk7XHJcblxyXG4gICAgICAvLyBDYWxjdWxhdGUgdGhlIGFkanVzdG1lbnQgcmF0aW8gdG8gZml0IHRoZSB0ZXh0IGFyZWEgaW50byB0aGUgZG91Z2hudXRcclxuICAgICAgLy8gaW5uZXIgY2lyY2xlXHJcbiAgICAgIGNvbnN0IGh5cG90ZW51c2UgPSBNYXRoLnNxcnQoXHJcbiAgICAgICAgTWF0aC5wb3codGV4dEFyZWFTaXplLndpZHRoLCAyKSArIE1hdGgucG93KHRleHRBcmVhU2l6ZS5oZWlnaHQsIDIpXHJcbiAgICAgICk7XHJcbiAgICAgIGNvbnN0IGlubmVyRGlhbWV0ZXIgPSBEb3VnaG51dENvbnRyb2xsZXIucHJvdG90eXBlLmlubmVyUmFkaXVzICogMjtcclxuICAgICAgY29uc3QgZml0UmF0aW8gPSBpbm5lckRpYW1ldGVyIC8gaHlwb3RlbnVzZTtcclxuXHJcbiAgICAgIC8vIEFkanVzdCB0aGUgZm9udCBpZiBuZWNlc3NhcnkgYW5kIHJlY2FsY3VsYXRlIHRoZSB0ZXh0IGFyZWEgYWZ0ZXJcclxuICAgICAgLy8gYXBwbHlpbmcgdGhlIGZpdCByYXRpb1xyXG4gICAgICBpZiAoZml0UmF0aW8gPCAxKSB7XHJcbiAgICAgICAgaW5uZXJMYWJlbHMuZm9yRWFjaChpbm5lckxhYmVsID0+IHtcclxuICAgICAgICAgIGlubmVyTGFiZWwuZm9udC5zaXplID0gTWF0aC5mbG9vcihpbm5lckxhYmVsLmZvbnQuc2l6ZSAqIGZpdFJhdGlvKTtcclxuICAgICAgICAgIGlubmVyTGFiZWwuZm9udC5saW5lSGVpZ2h0ID0gMS4yOyAvLyB3YXMgdW5kZWZpbmVkXHJcbiAgICAgICAgICBpbm5lckxhYmVsLmZvbnQgPSB1dGlscy5wYXJzZUZvbnQoXHJcbiAgICAgICAgICAgIHJlc29sdmUoW2lubmVyTGFiZWwuZm9udCwgbnVsbF0sIGN0eCwgMCkgfHwgQ2hhcnQuZGVmYXVsdHMuZm9udFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGV4dEFyZWFTaXplID0gdXRpbHMudGV4dFNpemUoY2hhcnQsIGlubmVyTGFiZWxzKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XHJcbiAgICAgIGN0eC50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiO1xyXG5cclxuICAgICAgLy8gVGhlIGNlbnRlciBvZiB0aGUgaW5uZXIgY2lyY2xlXHJcbiAgICAgIGNvbnN0IGNlbnRlclggPSAobGVmdCArIHJpZ2h0KSAvIDI7XHJcbiAgICAgIGNvbnN0IGNlbnRlclkgPSAodG9wICsgYm90dG9tKSAvIDI7XHJcblxyXG4gICAgICAvLyBUaGUgdG9wIFkgY29vcmRpbmF0ZSBvZiB0aGUgdGV4dCBhcmVhXHJcbiAgICAgIGNvbnN0IHRvcFkgPSBjZW50ZXJZIC0gdGV4dEFyZWFTaXplLmhlaWdodCAvIDI7XHJcblxyXG4gICAgICBsZXQgaTtcclxuICAgICAgY29uc3QgaWxlbiA9IGlubmVyTGFiZWxzLmxlbmd0aDtcclxuICAgICAgbGV0IGN1cnJlbnRIZWlnaHQgPSAwO1xyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgaWxlbjsgKytpKSB7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGlubmVyTGFiZWxzW2ldLmNvbG9yO1xyXG4gICAgICAgIGN0eC5mb250ID0gaW5uZXJMYWJlbHNbaV0uZm9udC5zdHJpbmc7XHJcblxyXG4gICAgICAgIC8vIFRoZSBZIGNlbnRlciBvZiBlYWNoIGxpbmVcclxuICAgICAgICBjb25zdCBsaW5lQ2VudGVyWSA9XHJcbiAgICAgICAgICB0b3BZICsgaW5uZXJMYWJlbHNbaV0uZm9udC5saW5lSGVpZ2h0IC8gMiArIGN1cnJlbnRIZWlnaHQ7XHJcbiAgICAgICAgY3VycmVudEhlaWdodCArPSBpbm5lckxhYmVsc1tpXS5mb250LmxpbmVIZWlnaHQ7XHJcblxyXG4gICAgICAgIC8vIFdlIGFsbG93ICd0ZXh0JyB0byBiZSBhIHN0cmluZyBvciB0aGUgcmV0dXJuIHZhbHVlIG9mIGEgZnVuY3Rpb24gYXNcclxuICAgICAgICAvLyBhIHN0cmluZy5cclxuICAgICAgICAvLyBjb25zdCB0ZXh0ID0gdHlwZW9mIGlubmVyTGFiZWxzW2ldLnRleHQgPT09ICdmdW5jdGlvbicgPyBpbm5lckxhYmVsc1tpXS50ZXh0KGNoYXJ0KSA6IGlubmVyTGFiZWxzW2ldLnRleHQ7XHJcbiAgICAgICAgY29uc3QgdGV4dCA9IHV0aWxzLnBhcnNlVGV4dChpbm5lckxhYmVsc1tpXS50ZXh0LCBjaGFydCk7XHJcbiAgICAgICAgLy8gRHJhdyBlYWNoIGxpbmUgb2YgdGV4dFxyXG4gICAgICAgIGN0eC5maWxsVGV4dCh0ZXh0LCBjZW50ZXJYLCBsaW5lQ2VudGVyWSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGNvcmVGdW5jdGlvbnMgPSB7XHJcbiAgZHJhd0RvdWdobnV0TGFiZWwsXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkcmF3RG91Z2hudXRMYWJlbDtcclxuIiwiaW1wb3J0IHsgQ2hhcnQgfSBmcm9tICdjaGFydC5qcyc7XHJcbmltcG9ydCB7IE9wdGlvbnMgfSBmcm9tICcuLi90eXBlcy9vcHRpb25zJztcclxuaW1wb3J0IGRyYXdEb3VnaG51dExhYmVsIGZyb20gJy4vY29yZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgaWQ6ICdkb3VnaG51dExhYmVsJyxcclxuICBkZWZhdWx0czoge1xyXG4gICAgZm9udDoge1xyXG4gICAgICBmYW1pbHk6ICdzYW5zLXNlcmlmJyxcclxuICAgICAgc2l6ZTogMTYsXHJcbiAgICAgIHN0eWxlOiAnbm9ybWFsJyxcclxuICAgICAgd2VpZ2h0OiAnbm9ybWFsJyxcclxuICAgICAgbGluZUhlaWdodDogMS4yLFxyXG4gICAgICBzdHJpbmc6ICcxNnB4IHNhbnMtc2VyaWYnXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgYmVmb3JlRHJhdzogKGNoYXJ0OiBDaGFydCwgYXJnczoge2NhbmNlbGxhYmxlOiB0cnVlfSwgb3B0aW9uczogT3B0aW9ucyk6IHZvaWQgPT4gZHJhd0RvdWdobnV0TGFiZWwoY2hhcnQsIG9wdGlvbnMpLFxyXG59XHJcbiIsImltcG9ydCB7Q2hhcnR9IGZyb20gJ2NoYXJ0LmpzJztcclxuaW1wb3J0IERvdWdobnV0TGFiZWwgZnJvbSAnLi9wbHVnaW4nO1xyXG5cclxuQ2hhcnQucmVnaXN0ZXIoRG91Z2hudXRMYWJlbCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEb3VnaG51dExhYmVsO1xyXG4iXSwibmFtZXMiOlsiQ2hhcnQiLCJ2YWx1ZU9yRGVmYXVsdCIsInRvTGluZUhlaWdodCIsImlzTnVsbE9yVW5kZWYiLCJyZXNvbHZlIiwiRG91Z2hudXRDb250cm9sbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBS0EsTUFBTSxTQUFTLEdBQUcsQ0FBQyxJQUFlLEVBQUUsS0FBWSxLQUFhLE9BQU8sSUFBSSxLQUFLLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBRTdHLE1BQU0sU0FBUyxHQUFHLENBQUMsS0FBZTtJQUNoQyxNQUFNLFFBQVEsR0FBR0EsY0FBSyxDQUFDLFFBQVEsQ0FBQztJQUNoQyxNQUFNLElBQUksR0FBSUMsc0JBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0QsTUFBTSxJQUFJLEdBQVM7UUFDakIsTUFBTSxFQUFFQSxzQkFBYyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7Ozs7UUFJMUQsVUFBVSxFQUFFQyxvQkFBWSxDQUFDLEtBQUssQ0FBQyxVQUErQixFQUFFLElBQUksQ0FBQztRQUNyRSxJQUFJLEVBQUUsSUFBSTtRQUNWLEtBQUssRUFBRUQsc0JBQWMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3ZELE1B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
