
  /**
   * @scottalan/chartjs-plugin-doughnutlabel v3.0.2
   * @license
   * author: 
   * chartjs-plugin-doughnutlabel.js v3.0.2
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnRqcy1wbHVnaW4tZG91Z2hudXRsYWJlbC5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL3V0aWxzLnRzIiwiLi4vc3JjL2NvcmUudHMiLCIuLi9zcmMvcGx1Z2luLnRzIiwiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExhYmVsVGV4dCB9IGZyb20gJy4vLi4vdHlwZXMvb3B0aW9ucy5kJztcbmltcG9ydCB7Q2hhcnQsIEZvbnRTcGVjfSBmcm9tICdjaGFydC5qcyc7XG5pbXBvcnQgeyB2YWx1ZU9yRGVmYXVsdCwgaXNOdWxsT3JVbmRlZiwgdG9MaW5lSGVpZ2h0IH0gZnJvbSAnY2hhcnQuanMvaGVscGVycyc7XG5pbXBvcnQgeyBGb250LCBMYWJlbE9wdGlvbnMgfSBmcm9tICcuLi90eXBlcy9vcHRpb25zJztcblxuXG5jb25zdCBwYXJzZVRleHQgPSAodGV4dDogTGFiZWxUZXh0LCBjaGFydDogQ2hhcnQpOiBzdHJpbmcgPT4gdHlwZW9mIHRleHQgPT09ICdmdW5jdGlvbicgPyB0ZXh0KGNoYXJ0KSA6IHRleHQ7XG5cbmNvbnN0IHBhcnNlRm9udCA9ICh2YWx1ZTogRm9udFNwZWMpOiBGb250ID0+IHtcbiAgY29uc3QgZGVmYXVsdHMgPSBDaGFydC5kZWZhdWx0cztcbiAgY29uc3Qgc2l6ZSA9ICB2YWx1ZU9yRGVmYXVsdCh2YWx1ZS5zaXplLCBkZWZhdWx0cy5mb250LnNpemUpO1xuICBjb25zdCBmb250OiBGb250ID0ge1xuICAgIGZhbWlseTogdmFsdWVPckRlZmF1bHQodmFsdWUuZmFtaWx5LCBkZWZhdWx0cy5mb250LmZhbWlseSksXG4gICAgLy8gRm9udFNwZWMgdHlwZXMgdGhpcyBhcyBhIG51bWJlcnxzdHJpbmcgYW5kIHRoZSB0b0xpbmVIZWlnaHQgZnVuY3Rpb25cbiAgICAvLyByZXR1cm5zIGEgbnVtYmVyLiBUaGUgZmlyc3QgYXJndW1lbnQgJ3ZhbHVlLmxpbmVIZWlnaHQnIGNhbiBiZSBhXG4gICAgLy8gbnVtYmVyfHN0cmluZyBhbmQgJ3NpemUnIGlzIGEgbnVtYmVyLlxuICAgIGxpbmVIZWlnaHQ6IHRvTGluZUhlaWdodCh2YWx1ZS5saW5lSGVpZ2h0IGFzIHVua25vd24gYXMgc3RyaW5nLCBzaXplKSxcbiAgICBzaXplOiBzaXplLFxuICAgIHN0eWxlOiB2YWx1ZU9yRGVmYXVsdCh2YWx1ZS5zdHlsZSwgZGVmYXVsdHMuZm9udC5zdHlsZSksXG4gICAgd2VpZ2h0OiB2YWx1ZU9yRGVmYXVsdCh2YWx1ZS53ZWlnaHQsIG51bGwpLFxuICAgIHN0cmluZzogJydcbiAgfTtcblxuICAvLyBBZGQgYSAnc3RyaW5nJyBwcm9wZXJ0eSB0byBvdXIgZm9udCBvYmplY3QuXG4gIGZvbnQuc3RyaW5nID0gdXRpbHMudG9Gb250U3RyaW5nKGZvbnQpO1xuICByZXR1cm4gZm9udDtcbn07XG5cbmNvbnN0IHRvRm9udFN0cmluZyA9IChmb250OiBGb250KTogc3RyaW5nID0+IHtcbiAgaWYgKCFmb250IHx8IGlzTnVsbE9yVW5kZWYoZm9udC5zaXplKSB8fCBpc051bGxPclVuZGVmKGZvbnQuZmFtaWx5KSkge1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIHJldHVybiAoZm9udC5zdHlsZSA/IGZvbnQuc3R5bGUgKyAnICcgOiAnJylcbiAgICArIChmb250LndlaWdodCA/IGZvbnQud2VpZ2h0ICsgJyAnIDogJycpXG4gICAgKyBmb250LnNpemUgKyAncHggJ1xuICAgICsgZm9udC5mYW1pbHk7XG59O1xuXG5jb25zdCB0ZXh0U2l6ZSA9IChjaGFydDogQ2hhcnQsIGxhYmVsczogTGFiZWxPcHRpb25zW10pOiB7aGVpZ2h0OiBudW1iZXIsIHdpZHRoOiBudW1iZXJ9ID0+IHtcbiAgY29uc3Qge2N0eH0gPSBjaGFydDtcbiAgY29uc3QgcHJldiA9IGN0eC5mb250O1xuICBsZXQgd2lkdGggPSAwO1xuICBsZXQgaGVpZ2h0ID0gMDtcblxuICBsYWJlbHMuZm9yRWFjaChsYWJlbCA9PiB7XG4gICAgLy8gV2UgYWxsb3cgJ3RleHQnIHRvIGJlIGEgc3RyaW5nIG9yIHRoZSByZXR1cm4gdmFsdWUgb2YgYSBmdW5jdGlvbiBhc1xuICAgIC8vIGEgc3RyaW5nLlxuICAgIGNvbnN0IHRleHQgPSB0eXBlb2YgbGFiZWwudGV4dCA9PT0gJ2Z1bmN0aW9uJyA/IGxhYmVsLnRleHQoY2hhcnQpIDogbGFiZWwudGV4dDtcbiAgICBjdHguZm9udCA9IGxhYmVsLmZvbnQgPyBsYWJlbC5mb250LnN0cmluZyA6ICcnO1xuICAgIHdpZHRoID0gTWF0aC5tYXgoY3R4Lm1lYXN1cmVUZXh0KHRleHQpLndpZHRoLCB3aWR0aCk7XG4gICAgaGVpZ2h0ICs9IGxhYmVsLmZvbnQubGluZUhlaWdodDtcbiAgfSk7XG5cbiAgY3R4LmZvbnQgPSBwcmV2O1xuXG4gIGNvbnN0IHJlc3VsdCA9IHtcbiAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICB3aWR0aDogd2lkdGhcbiAgfTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuXG5leHBvcnQgY29uc3QgdXRpbHMgPSB7XG4gIHBhcnNlVGV4dCxcbiAgcGFyc2VGb250LFxuICB0b0ZvbnRTdHJpbmcsXG4gIHRleHRTaXplLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgdXRpbHM7XG4iLCJpbXBvcnQgeyBMYWJlbE9wdGlvbnMsIE9wdGlvbnMgfSBmcm9tICcuLy4uL3R5cGVzL29wdGlvbnMuZCc7XG5pbXBvcnQge0NoYXJ0LCBEb3VnaG51dENvbnRyb2xsZXJ9IGZyb20gJ2NoYXJ0LmpzJztcbmltcG9ydCB7cmVzb2x2ZX0gZnJvbSAnY2hhcnQuanMvaGVscGVycydcbmltcG9ydCB1dGlscyBmcm9tICcuL3V0aWxzJztcblxuY29uc3QgZHJhd0RvdWdobnV0TGFiZWwgPSAoY2hhcnQ6IENoYXJ0LCBvcHRpb25zOiBPcHRpb25zKTogdm9pZCA9PiB7XG5cbiAgaWYgKGNoYXJ0LmNoYXJ0QXJlYSAmJiBvcHRpb25zKSB7XG4gICAgY29uc3Qge2xhYmVsc30gPSBvcHRpb25zO1xuICAgIGlmICghbGFiZWxzPy5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qge2N0eCwgY2hhcnRBcmVhOiB7dG9wLCByaWdodCwgYm90dG9tLCBsZWZ0fX0gPSBjaGFydDtcblxuICAgIGNvbnN0IGlubmVyTGFiZWxzOiBMYWJlbE9wdGlvbnNbXSA9IFtdO1xuXG4gICAgICBsYWJlbHMuZm9yRWFjaChsYWJlbCA9PiB7XG4gICAgICAgIGNvbnN0IHRleHQgPSB1dGlscy5wYXJzZVRleHQobGFiZWwudGV4dCwgY2hhcnQpO1xuICAgICAgICBjb25zdCBmb250ID0gdXRpbHMucGFyc2VGb250KHJlc29sdmUoW2xhYmVsLmZvbnQsIG9wdGlvbnMuZm9udCwgQ2hhcnQuZGVmYXVsdHMuZm9udF0sIGN0eCwgMCkgfHwgQ2hhcnQuZGVmYXVsdHMuZm9udCk7XG4gICAgICAgIGNvbnN0IGNvbG9yID0gcmVzb2x2ZShcbiAgICAgICAgICBbbGFiZWwuY29sb3IsIG9wdGlvbnMuY29sb3IsIENoYXJ0LmRlZmF1bHRzLmNvbG9yXSxcbiAgICAgICAgICBjdHgsXG4gICAgICAgICAgMFxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IGlubmVyTGFiZWwgPSB7XG4gICAgICAgICAgdGV4dCxcbiAgICAgICAgICBmb250LFxuICAgICAgICAgIGNvbG9yOiBjb2xvciA/PyAnIzAwMCcsXG4gICAgICAgIH07XG4gICAgICAgIGlubmVyTGFiZWxzLnB1c2goaW5uZXJMYWJlbCk7XG4gICAgICB9KTtcblxuICAgICAgbGV0IHRleHRBcmVhU2l6ZSA9IHV0aWxzLnRleHRTaXplKGNoYXJ0LCBpbm5lckxhYmVscyk7XG5cbiAgICAgIC8vIENhbGN1bGF0ZSB0aGUgYWRqdXN0bWVudCByYXRpbyB0byBmaXQgdGhlIHRleHQgYXJlYSBpbnRvIHRoZSBkb3VnaG51dFxuICAgICAgLy8gaW5uZXIgY2lyY2xlXG4gICAgICBjb25zdCBoeXBvdGVudXNlID0gTWF0aC5zcXJ0KFxuICAgICAgICBNYXRoLnBvdyh0ZXh0QXJlYVNpemUud2lkdGgsIDIpICsgTWF0aC5wb3codGV4dEFyZWFTaXplLmhlaWdodCwgMilcbiAgICAgICk7XG4gICAgICBjb25zdCBpbm5lckRpYW1ldGVyID0gRG91Z2hudXRDb250cm9sbGVyLnByb3RvdHlwZS5pbm5lclJhZGl1cyAqIDI7XG4gICAgICBjb25zdCBmaXRSYXRpbyA9IGlubmVyRGlhbWV0ZXIgLyBoeXBvdGVudXNlO1xuXG4gICAgICAvLyBBZGp1c3QgdGhlIGZvbnQgaWYgbmVjZXNzYXJ5IGFuZCByZWNhbGN1bGF0ZSB0aGUgdGV4dCBhcmVhIGFmdGVyXG4gICAgICAvLyBhcHBseWluZyB0aGUgZml0IHJhdGlvXG4gICAgICBpZiAoZml0UmF0aW8gPCAxKSB7XG4gICAgICAgIGlubmVyTGFiZWxzLmZvckVhY2goaW5uZXJMYWJlbCA9PiB7XG4gICAgICAgICAgaW5uZXJMYWJlbC5mb250LnNpemUgPSBNYXRoLmZsb29yKGlubmVyTGFiZWwuZm9udC5zaXplICogZml0UmF0aW8pO1xuICAgICAgICAgIGlubmVyTGFiZWwuZm9udC5saW5lSGVpZ2h0ID0gMS4yOyAvLyB3YXMgdW5kZWZpbmVkXG4gICAgICAgICAgaW5uZXJMYWJlbC5mb250ID0gdXRpbHMucGFyc2VGb250KFxuICAgICAgICAgICAgcmVzb2x2ZShbaW5uZXJMYWJlbC5mb250LCBudWxsXSwgY3R4LCAwKSB8fCBDaGFydC5kZWZhdWx0cy5mb250XG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGV4dEFyZWFTaXplID0gdXRpbHMudGV4dFNpemUoY2hhcnQsIGlubmVyTGFiZWxzKTtcbiAgICAgIH1cblxuICAgICAgY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XG4gICAgICBjdHgudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcblxuICAgICAgLy8gVGhlIGNlbnRlciBvZiB0aGUgaW5uZXIgY2lyY2xlXG4gICAgICBjb25zdCBjZW50ZXJYID0gKGxlZnQgKyByaWdodCkgLyAyO1xuICAgICAgY29uc3QgY2VudGVyWSA9ICh0b3AgKyBib3R0b20pIC8gMjtcblxuICAgICAgLy8gVGhlIHRvcCBZIGNvb3JkaW5hdGUgb2YgdGhlIHRleHQgYXJlYVxuICAgICAgY29uc3QgdG9wWSA9IGNlbnRlclkgLSB0ZXh0QXJlYVNpemUuaGVpZ2h0IC8gMjtcblxuICAgICAgbGV0IGk7XG4gICAgICBjb25zdCBpbGVuID0gaW5uZXJMYWJlbHMubGVuZ3RoO1xuICAgICAgbGV0IGN1cnJlbnRIZWlnaHQgPSAwO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGlsZW47ICsraSkge1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gaW5uZXJMYWJlbHNbaV0uY29sb3I7XG4gICAgICAgIGN0eC5mb250ID0gaW5uZXJMYWJlbHNbaV0uZm9udC5zdHJpbmc7XG5cbiAgICAgICAgLy8gVGhlIFkgY2VudGVyIG9mIGVhY2ggbGluZVxuICAgICAgICBjb25zdCBsaW5lQ2VudGVyWSA9XG4gICAgICAgICAgdG9wWSArIGlubmVyTGFiZWxzW2ldLmZvbnQubGluZUhlaWdodCAvIDIgKyBjdXJyZW50SGVpZ2h0O1xuICAgICAgICBjdXJyZW50SGVpZ2h0ICs9IGlubmVyTGFiZWxzW2ldLmZvbnQubGluZUhlaWdodDtcblxuICAgICAgICAvLyBXZSBhbGxvdyAndGV4dCcgdG8gYmUgYSBzdHJpbmcgb3IgdGhlIHJldHVybiB2YWx1ZSBvZiBhIGZ1bmN0aW9uIGFzXG4gICAgICAgIC8vIGEgc3RyaW5nLlxuICAgICAgICAvLyBjb25zdCB0ZXh0ID0gdHlwZW9mIGlubmVyTGFiZWxzW2ldLnRleHQgPT09ICdmdW5jdGlvbicgPyBpbm5lckxhYmVsc1tpXS50ZXh0KGNoYXJ0KSA6IGlubmVyTGFiZWxzW2ldLnRleHQ7XG4gICAgICAgIGNvbnN0IHRleHQgPSB1dGlscy5wYXJzZVRleHQoaW5uZXJMYWJlbHNbaV0udGV4dCwgY2hhcnQpO1xuICAgICAgICAvLyBEcmF3IGVhY2ggbGluZSBvZiB0ZXh0XG4gICAgICAgIGN0eC5maWxsVGV4dCh0ZXh0LCBjZW50ZXJYLCBsaW5lQ2VudGVyWSk7XG4gICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgY29yZUZ1bmN0aW9ucyA9IHtcbiAgZHJhd0RvdWdobnV0TGFiZWwsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBkcmF3RG91Z2hudXRMYWJlbDtcbiIsImltcG9ydCB7IENoYXJ0IH0gZnJvbSAnY2hhcnQuanMnO1xuaW1wb3J0IHsgT3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzL29wdGlvbnMnO1xuaW1wb3J0IGRyYXdEb3VnaG51dExhYmVsIGZyb20gJy4vY29yZSc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgaWQ6ICdkb3VnaG51dExhYmVsJyxcbiAgZGVmYXVsdHM6IHtcbiAgICBmb250OiB7XG4gICAgICBmYW1pbHk6ICdzYW5zLXNlcmlmJyxcbiAgICAgIHNpemU6IDE2LFxuICAgICAgc3R5bGU6ICdub3JtYWwnLFxuICAgICAgd2VpZ2h0OiAnbm9ybWFsJyxcbiAgICAgIGxpbmVIZWlnaHQ6IDEuMixcbiAgICAgIHN0cmluZzogJzE2cHggc2Fucy1zZXJpZidcbiAgICB9LFxuICB9LFxuICBiZWZvcmVEcmF3OiAoY2hhcnQ6IENoYXJ0LCBhcmdzOiB7Y2FuY2VsbGFibGU6IHRydWV9LCBvcHRpb25zOiBPcHRpb25zKTogdm9pZCA9PiBkcmF3RG91Z2hudXRMYWJlbChjaGFydCwgb3B0aW9ucyksXG59XG4iLCJpbXBvcnQge0NoYXJ0LCByZWdpc3RlcmFibGVzfSBmcm9tICdjaGFydC5qcyc7XG5pbXBvcnQgRG91Z2hudXRMYWJlbCBmcm9tICcuL3BsdWdpbic7XG5cbkNoYXJ0LnJlZ2lzdGVyKERvdWdobnV0TGFiZWwsIC4uLnJlZ2lzdGVyYWJsZXMpO1xuXG5leHBvcnQgZGVmYXVsdCBEb3VnaG51dExhYmVsO1xuIl0sIm5hbWVzIjpbIkNoYXJ0IiwidmFsdWVPckRlZmF1bHQiLCJ0b0xpbmVIZWlnaHQiLCJpc051bGxPclVuZGVmIiwicmVzb2x2ZSIsIkRvdWdobnV0Q29udHJvbGxlciIs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
