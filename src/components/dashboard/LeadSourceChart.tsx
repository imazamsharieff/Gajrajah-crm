import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const LeadSourceChart: React.FC = () => {
    const data = {
        labels: ['Website', 'Referrals', 'Social Media', 'Direct', 'Ads'],
        datasets: [
            {
                label: 'Lead Sources',
                data: [120, 85, 65, 38, 20],
                backgroundColor: [
                    '#2B6CB0',
                    '#3182CE',
                    '#4299E1',
                    '#63B3ED',
                    '#90CDF4',
                ],
                borderColor: '#ffffff',
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    padding: 15,
                    font: {
                        size: 12,
                        family: 'Inter, sans-serif',
                    },
                },
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
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow fade-in">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Sources</h3>
            <div className="h-64">
                <Pie data={data} options={options} />
            </div>
        </div>
    );
};

export default LeadSourceChart;
