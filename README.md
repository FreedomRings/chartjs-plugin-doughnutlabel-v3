# Chart.js (Version 3) Doughnut Chart plugin to display custom lines of text in the center of the circle.

This Chart.js plugin module allows you to display multiple lines of dynamic text centered in the middle area of the Doughnut Chart - which can be customized for the font, color, size and other attributes.  This is a fork from Ciprian Ciurea (ciprianciurea) who wrote it for Chart.js Version 2 and later modified by Alan Scott (scottalan) for Chart.js Version 3 (which still required the application of a stale commit).  I still had problems after I went to Version 3 of Chart.js but I really liked their work, especially since I wanted to use the plugin with TypeScript, Angular and Electron.  This plugin is a combination of these other authors work with a few updates and usage notes to make it easier for those on my path.  Please enjoy.

## Demo
Have a look at the [Demo page](https://FreedomRings.github.io/chartjs-plugin-doughnutlabel-v3/samples/index.html).

## Table of contents

- [Installation](#installation)
- [Usage example](#usage)
- [Development](#development)
- [License](#license)

## Installation

Install through npm:
```
npm install --save chartjs-plugin-doughnutlabel-v3
```

## Usage 

```
var myDoughnutChart = new Chart(ctx, {
  type: 'doughnut',
  data: data,
  options: {
    plugins: {
      doughnutlabel: {
        labels: [
          {
            text: 'The title',
            font: {
              size: '60'
            }
          },
          {
            text: getTotal,
            font: {
              size: '50'
            },
            color: 'grey'
          },
          {
            text: '$100.000',
            font: {
              size: '30'
            },
            color: 'red'
          },
          {
            text: '95%',
            font: {
              size: '45'
            },
          color: 'green'
          }
        ]
      }
    }		
  }
});

var getTotal = function(myDoughnutChart) {
	var sum = myDoughnutChart.config.data.datasets[0].data.reduce((a, b) => a + b, 0);
	return `Total: ${sum}`;
}
```

### Usage without a module bundler
The plugin can be manually downloaded from the 
[Releases page on GitHub!](https://github.com/freedomrings/chartjs-plugin-doughnutlabel-v3/releases)
```
<script src="chartjs-plugin-doughnutlabel-v3.js"></script>
```
or use the minified version
```
<script src="chartjs-plugin-doughnutlabel-v3.min.js"></script>
```

## Development

You first need to install node dependencies (requires [Node.js](https://nodejs.org/)):

    > npm install

The following commands will then be available from the repository root:

    > gulp lint             // perform code linting
    > gulp build            // build dist files
    > gulp build --watch    // build and watch for changes
    > gulp package          // create an archive with dist files and samples

## In Angular

For an example on how to use this plugin with angular, please check this stackblitz prototype:
[doughnutlabel plugin in angular](https://stackblitz.com/edit/angular-v9tfg7)

## License

`chartjs-plugin-doughnutlabel-v3` is available under the [MIT license](LICENSE.md).
