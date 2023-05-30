import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import './homepage.css';

const HomePage = () => {
  const [visitorsToday, setVisitorsToday] = useState(0);
  const [visitorsYesterday, setVisitorsYesterday] = useState(0);
  const [visitorsLast7Days, setVisitorsLast7Days] = useState(0);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/statistics')
      .then((response) => response.json())
      .then((data) => {
        setVisitorsToday(data.today);
        setVisitorsYesterday(data.yesterday);
        setVisitorsLast7Days(data.last7Days);
        setTotalVisitors(data.total);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching visitor statistics:', error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const renderGraphs = () => {
        // Destroy previous chart instances if they exist
        Chart.getChart('lineChart')?.destroy();
        Chart.getChart('barChart')?.destroy();
        Chart.getChart('doughnutChart')?.destroy();
        Chart.getChart('pieChart')?.destroy();

        const lineChartCtx = document.getElementById('lineChart').getContext('2d');
        new Chart(lineChartCtx, {
          type: 'line',
          data: {
            labels: ['Today', 'Yesterday', 'Last 7 Days'],
            datasets: [
              {
                label: 'Visitors',
                data: [visitorsToday, visitorsYesterday, visitorsLast7Days],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                precision: 0,
              },
            },
          },
        });

        const barData = [visitorsToday, visitorsYesterday, visitorsLast7Days];
        const barLabels = ['Today', 'Yesterday', 'Last 7 Days'];
        const barColors = ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)'];

        const barChartCtx = document.getElementById('barChart').getContext('2d');
        new Chart(barChartCtx, {
          type: 'bar',
          data: {
            labels: barLabels,
            datasets: [
              {
                label: 'Visitors',
                data: barData,
                backgroundColor: barColors,
                borderColor: barColors,
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                precision: 0,
              },
            },
          },
        });

        const pieChartCtx = document.getElementById('pieChart').getContext('2d');
        new Chart(pieChartCtx, {
          type: 'pie',
          data: {
            labels: ['Today', 'Yesterday', 'Last 7 Days'],
            datasets: [
              {
                label: 'Visitors',
                data: [visitorsToday, visitorsYesterday, visitorsLast7Days],
                backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(75, 192, 192)'],
              },
            ],
          },
        });
      };

      renderGraphs();
    }
  }, [isLoading, visitorsToday, visitorsYesterday, visitorsLast7Days]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="homepage">
      <h2>Visitor Statistics</h2>
      <div className="card-container">
        <div className="card">
          <h4 className="card-title">Today's Visitors</h4>
          <div className="card-content">{visitorsToday}</div>
        </div>
        <div className="card">
          <h4 className="card-title">Yesterday's Visitors</h4>
          <div className="card-content">{visitorsYesterday}</div>
        </div>
        <div className="card">
          <h4 className="card-title">Last 7 Days Visitors</h4>
          <div className="card-content">{visitorsLast7Days}</div>
        </div>
        <div className="card">
          <h4 className="card-title">Total Visitors</h4>
          <div className="card-content">{totalVisitors}</div>
        </div>
      </div>
      <div className="graph-container">
        <canvas id="lineChart" width="400" height="200"></canvas>
        <canvas id="barChart" width="400" height="200"></canvas>
        <canvas id="pieChart" width="400" height="200"></canvas>
      </div>
    </div>
  );
};

export default HomePage;