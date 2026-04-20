import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import Card from '../../components/UI/Card';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Progress() {
  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Learning Hours',
        data: [1.2, 2.5, 1.8, 3.2, 2.0, 4.5, 3.0],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const barChartData = {
    labels: ['React', 'Node.js', 'System Design', 'Web3', 'UI/UX'],
    datasets: [
      {
        label: 'Completed Modules',
        data: [12, 8, 5, 2, 9],
        backgroundColor: '#8b5cf6',
        borderRadius: 4,
      },
      {
        label: 'Remaining Modules',
        data: [4, 6, 15, 8, 3],
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderRadius: 4,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter' }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#f1f5f9',
        bodyColor: '#a5b4fc',
        padding: 12,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#64748b' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#64748b' }
      }
    }
  };

  return (
    <div className="progress-page">
      <div className="page-header mb-8">
        <h1>Learning Progress</h1>
        <p className="text-secondary">Track your study hours and course completions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="h-96">
          <h2 className="text-lg font-semibold mb-4">Study Hours This Week</h2>
          <div className="h-72">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </Card>

        <Card className="h-96">
          <h2 className="text-lg font-semibold mb-4">Module Completion by Subject</h2>
          <div className="h-72">
             <Bar 
               data={barChartData} 
               options={{
                 ...chartOptions,
                 scales: {
                   x: { stacked: true, grid: { display: false }, ticks: { color: '#64748b' } },
                   y: { stacked: true, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b' } }
                 }
               }} 
             />
          </div>
        </Card>
      </div>
      
      <Card>
        <h2 className="text-lg font-semibold mb-6">Recent Achievements</h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 p-4 rounded-md bg-glass border border-glass">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-warning-light text-2xl">🏆</div>
            <div>
              <h4 className="font-semibold text-primary">7 Day Streak</h4>
              <p className="text-sm text-secondary">You studied for 7 consecutive days!</p>
            </div>
            <div className="ml-auto text-xs text-muted">2 mins ago</div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-md bg-glass border border-glass">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-success-light text-2xl">🎓</div>
            <div>
              <h4 className="font-semibold text-primary">React Hooks Master</h4>
              <p className="text-sm text-secondary">Completed all React Hook modules.</p>
            </div>
            <div className="ml-auto text-xs text-muted">Yesterday</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
