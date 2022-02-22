# Chart.js (Version 3) Doughnut Chart plugin to display custom lines of text in the center of the circle.

This Chart.js plugin module allows you to display multiple lines of dynamic text centered in the middle area of the Doughnut Chart - which can be customized for the font, color, size and other attributes.  This is a fork from Ciprian Ciurea (ciprianciurea) who wrote it for Chart.js Version 2 and later modified by Alan Scott (scottalan) for Chart.js Version 3 (which still required the application of a stale commit).  I still had problems after I went to Version 3 of Chart.js but I really liked their work.  Since I wanted to use the plugin with both CommonJS and the combination of TypeScript, Angular and Electron this seemed like a great place to start.  This plugin is a combination of these other authors work with a few updates and usage notes to make it easier for those on my path.  Please enjoy.

## Demo
If JavaScript is your thing, have a look at the prototype:
[Click here to see the HTML/JavaScript/CSS demo page](https://stackblitz.com/edit/web-platform-cc9kgs).

For an example on how to use this plugin with angular, please check this stackblitz prototype:
[Click here to see the plugin in angular 13](https://stackblitz.com/edit/angular-ivy-kow4wa)


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

This sample code is available in the Samples folder.

For straight HTML/JavaScript the useage is pretty straighforward.  Your HTML simply pulls
in the scripts for Chart.js (Version 3) and the script for this plugin, then attaches your
HTML to the backing JavaScript for the page.

```
<!DOCTYPE html>
<html lang="en-US">

<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>chartjs-plugin-doughnutlabel / samples</title>
	<link rel="stylesheet" type="text/css" href="index.css">
	<link rel="icon" type="image/ico" href="favicon.ico">
	<script src="https://cdn.jsdelivr.net/npm/chart.js@3.5.0/dist/chart.min.js"></script>
	<script src="chartjs-plugin-doughnutlabel.js"></script>
</head>

<body>
	<div id="header">
		<div class="title">
			<span class="main">chartjs-plugin-doughnutlabel-v3</span>
			<span class="name">Sample Chart</span>
		</div>
		<div class="caption">
			<a href="http://www.chartjs.org">Chart.js</a> plugin for doughnut chart to display lines of text in the center</div>
		<div class="links">
			<a class="btn btn-gh" href="https://github.com/FreedomRings/chartjs-plugin-doughnutlabel-v3">GitHub</a>
		</div>
	</div>

	<div>
		<canvas id="chart1" width="500" height="500"></canvas>
	</div>

	<div>
		<button id="randomizeData">Randomize Data</button>
	</div>
	
</body>

<script type="text/javascript" src="index.js"></script>

</html>
```

The backing Java Script is also straightforward, just remember that the Chart Options have
changed in Verion 3 and you will find that some of the Version 2 options have been moved 
into plugins (for example).  Obviously, Chart.js still has its issues for responsive sizing, 
so I normally do fixed sizing for predictable results, even when printing.
```
const DEFAULT_COLORS1 = ['#f08700', '#f49f0a', '#efca08', '#00a6a6', '#bbdef0']
const DEFAULT_COLORS2 = ['#7fb7be', '#357266', '#dacc3e', '#bc2c1a', '#7d1538']

const randomScalingFactor = function() {
	return Math.round(Math.random() * 100)
};

document.getElementById('randomizeData').addEventListener('click', function() {
	sampleChart.config.data.datasets[0].data = [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
	sampleChart.update()
})

const getTotal = function(myChart) {
	const sum = myChart.config.data.datasets[0].data.reduce((a, b) => a + b, 0)
	return `Total: ${sum}`
}

// Doughnut with multiple lines of text in the center
const ctx = document.getElementById('chart1').getContext('2d')
const sampleChart = new Chart(ctx, {
  type: 'doughnut',
	data: {
		datasets: [{
			data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
			backgroundColor: DEFAULT_COLORS2,
			label: 'Dataset 1'
		}],
		labels: ['Item one', 'Item two', 'Item three', 'Item four']
	},
	options: {
		responsive: false,
		animation: {
			animateScale: true,
			animateRotate: true
		},
		plugins: {
			title: {
				display: true,
				fullSize: true,
				text: 'Multiple Lines of Text',
				padding: {
          top: 20,
          bottom: 10
        }
			},
			subtitle: {
				display: true,
				fullSize: true,
				text: '(With calculations!)',
				padding: {
          bottom: 20
        }
			},
			legend: {
				display: true,
				position: 'top',
			},
			doughnutLabel: {
				labels: [
					{
						text: 'The Title',
						color: 'blue',
						font: {
							size: '35',
							family: 'Arial, Helvetica, sans-serif',
							style: 'italic',
							weight: 'bold'
						}
					},
					{
						text: 'The Subtitle',
						font: {
							size: '25'
						},
						color: 'grey'
					},
					{
						text: '$100.00',
						font: {
							size: '20'
						},
						color: 'red'
					},
					{
						text: getTotal,
						font: {
							size: '20'
						},
						color: 'green'
					},
				]
			}
		}
	}
})
```

### Usage without a module bundler
The plugin can be manually downloaded from the 
[Releases page on GitHub!](https://github.com/freedomrings/chartjs-plugin-doughnutlabel-v3/releases)
```
<script src="chartjs-plugin-doughnutlabel.js"></script>
```
or use the minified version
```
<script src="chartjs-plugin-doughnutlabel.min.js"></script>
```
or use the ECMAScript (ECM) version
```
<script src="chartjs-plugin-doughnutlabel.esm.js"></script>
```

## Development

You first need to install node dependencies (requires [Node.js](https://nodejs.org/)):

    > npm install chartjs-plugin-doughnutlabel-v3


## License

`chartjs-plugin-doughnutlabel-v3` is available under the [MIT license](LICENSE.md).
