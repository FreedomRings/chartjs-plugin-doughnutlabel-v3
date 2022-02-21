'use strict';

var DEFAULT_COLORS1 = ['#f08700', '#f49f0a', '#efca08', '#00a6a6', '#bbdef0'];
var DEFAULT_COLORS2 = ['#7fb7be', '#357266', '#dacc3e', '#bc2c1a', '#7d1538'];

var randomScalingFactor = function() {
	return Math.round(Math.random() * 100);
};

document.getElementById('randomizeData').addEventListener('click', function() {
	sampleChart.config.data.datasets[0].data = [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()];
	sampleChart.update();
});

var getTotal = function(myChart) {
	var sum = myChart.config.data.datasets[0].data.reduce((a, b) => a + b, 0);
	return `Total: ${sum}`;
}

// Doughnut with multiple lines of text in the center
var ctx = document.getElementById('chart1').getContext('2d');
var sampleChart = new Chart(ctx, {
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
		title: {
			display: true,
			fontSize: 20,
			text: 'Multiple lines of text'
		},
		animation: {
			animateScale: true,
			animateRotate: true
		},
		plugins: {
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
});
