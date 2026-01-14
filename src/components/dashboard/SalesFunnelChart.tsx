import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const SalesFunnelChart: React.FC = () => {
    const data = {
        labels: ['New Leads', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'],
        datasets: [
            {
                label: 'Count',
                data: [328, 245, 180, 95, 42],
                backgroundColor: [
                    '#2B6CB0',
                    '#3182CE',
                    '#4299E1',
                    '#63B3ED',
                    '#90CDF4',
                ],
                borderRadius: 6,
            },
        ],
    };

    const options = {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#1a202c',
                padding: 12,
                titleFont: {
                    size: 14,
                    family: 'Inter, sans-serif',
                },
                bodyFont: {
                    size: 13,
                    family: 'Inter, sans-serif',
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 12,
                        family: 'Inter, sans-serif',
                    },
                },
            },
            y: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 12,
                        family: 'Inter, sans-serif',
                    },
                },
            },
        },
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow fade-in">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Funnel</h3>
            <div className="h-64">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default SalesFunnelChart;
