/**
 * charts.js - Charts initialization helpers
 */

const Charts = {
    line(elementId, series, categories, options = {}) {
        const defaultOptions = {
            series: series,
            chart: {
                height: 350,
                type: 'line',
                toolbar: { show: false },
                zoom: { enabled: false },
                fontFamily: 'Inter, sans-serif',
            },
            colors: [getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#3b82f6'],
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth', width: 3 },
            xaxis: { categories: categories },
            grid: { borderColor: '#f1f1f1' },
            ...options
        };

        const chart = new ApexCharts(document.querySelector(`#${elementId}`), defaultOptions);
        chart.render();
        return chart;
    },

    area(elementId, series, categories, options = {}) {
        const defaultOptions = {
            series: series,
            chart: {
                height: 350,
                type: 'area',
                toolbar: { show: false },
                fontFamily: 'Inter, sans-serif',
            },
            colors: [getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#3b82f6'],
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth' },
            xaxis: { categories: categories },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 90, 100]
                }
            },
            ...options
        };

        const chart = new ApexCharts(document.querySelector(`#${elementId}`), defaultOptions);
        chart.render();
        return chart;
    },

    bar(elementId, series, categories, options = {}) {
        const defaultOptions = {
            series: series,
            chart: {
                height: 350,
                type: 'bar',
                toolbar: { show: false },
                fontFamily: 'Inter, sans-serif',
            },
            colors: [getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#3b82f6'],
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    horizontal: false,
                }
            },
            dataLabels: { enabled: false },
            xaxis: { categories: categories },
            ...options
        };

        const chart = new ApexCharts(document.querySelector(`#${elementId}`), defaultOptions);
        chart.render();
        return chart;
    },

    donut(elementId, series, labels, options = {}) {
        const defaultOptions = {
            series: series,
            chart: {
                height: 350,
                type: 'donut',
                fontFamily: 'Inter, sans-serif',
            },
            labels: labels,
            colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: { width: 200 },
                    legend: { position: 'bottom' }
                }
            }],
            ...options
        };

        const chart = new ApexCharts(document.querySelector(`#${elementId}`), defaultOptions);
        chart.render();
        return chart;
    }
};
