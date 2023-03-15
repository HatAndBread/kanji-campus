import { Controller } from "@hotwired/stimulus";
import { Chart } from "chart.js/auto";

export default class extends Controller {
  static targets = ["chartCanvas"];

  connect() {
    this.chartData = JSON.parse(this.element.dataset.data);
    Chart.defaults.color = window.isDarkMode() ? "white" : "#313641"
    Chart.defaults.borderColor = window.isDarkMode() ? "rgb(125, 125, 125)" : "rgb(200,200,200)"
    const data = {
      labels: this.chartData.map((d) =>
        new Date(d.created * 1000).toDateString()
      ),
      datasets: [
        {
          data: this.chartData.map((d) => d.percentage),
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
    const config = {
      type: "line",
      data: data,
      options: {
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: {
              callback: (v) => `${v}%`,
            },
          },
        },
      },
    };
    const element = this.chartCanvasTarget;
    const ctx = element.getContext("2d");
    this.chart = new Chart(ctx, config);
  }

  disconnect() {
    this.chart.destroy();
    this.chart = undefined;
  }
}
