import React from 'react';
import Card from '../../components/UI/Card';
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

export default function TeacherAnalytics() {
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Course Revenue ($)',
        data: [1250, 2100, 1800, 3200, 4800, 5200, 6100],
        borderColor: '#10B981', // Success color
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const barChartData = {
    labels: ['React Masterclass', 'Node.js Backend', 'System Design', 'UI/UX Fundamentals'],
    datasets: [
      {
        label: 'Total Enrollments',
        data: [120, 85, 45, 60],
        backgroundColor: '#6366f1',
        borderRadius: 4,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#94a3b8' } },
      tooltip: { backgroundColor: 'rgba(17, 24, 39, 0.9)', titleColor: '#f1f5f9', bodyColor: '#a5b4fc', padding: 12, cornerRadius: 8 }
    },
    scales: {
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b' } },
      x: { grid: { display: false }, ticks: { color: '#64748b' } }
    }
  };

  return (
    <div className="teacher-analytics max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Metrics & Analytics</h1>
        <p className="text-secondary">Analyze your content performance and revenue generation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="h-96">
          <h2 className="text-lg font-semibold mb-4">Gross Revenue History</h2>
          <div className="h-72">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </Card>

        <Card className="h-96">
          <h2 className="text-lg font-semibold mb-4">Enrollments by Course</h2>
          <div className="h-72">
             <Bar data={barChartData} options={chartOptions} />
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-6">Top Performing Students</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
             <div key={i} className="flex flex-col items-center p-6 bg-bg-secondary rounded-xl border border-glass text-center">
                <div className="w-16 h-16 rounded-full bg-accent-light text-accent text-2xl flex items-center justify-center mb-4">
                  ⭐
                </div>
                <h4 className="font-bold">Student {i}</h4>
                <p className="text-sm text-secondary mb-2">100% Completion Rate</p>
                <span className="text-success text-xs font-semibold">Top 1%</span>
             </div>
          ))}
        </div>
      </Card>
      
      <style>{`
        .h-96 { height: 24rem; }
        .h-72 { height: 18rem; }
      `}</style>
    </div>
  );
}
