import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import * as API from "../Endpoint/Endpoint"; // Adjust the path to your API endpoints

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, ArcElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState('category');
  const [incidentData, setIncidentData] = useState({ labels: [], datasets: [] });
  const [resolutionData, setResolutionData] = useState({ labels: [], datasets: [] });
  const [incidentTrendData, setIncidentTrendData] = useState({ labels: [], datasets: [] });
  const [priorityData, setPriorityData] = useState({ labels: [], datasets: [] });
  const [totalIncidents, setTotalIncidents] = useState(0);
  const [totalResolutions, setTotalResolutions] = useState(0);

  useEffect(() => {
    const fetchIncidentData = async () => {
      try {
        const response = await axios.get(API.GET_INCIDENT);
        const incidents = response.data || [];

        const incidentLabels = incidents.map(incident => incident.category || 'Unknown');
        const incidentCounts = incidents.map(incident => incident.count || 0);

        setIncidentData({
          labels: incidentLabels,
          datasets: [{
            label: 'Incident Categories',
            data: incidentCounts,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }],
        });

        setTotalIncidents(incidents.reduce((sum, incident) => sum + (incident.count || 0), 0));

        const trendLabels = incidents.map(incident => incident.date || 'Unknown');
        const trendCounts = incidents.map(incident => incident.count || 0);

        setIncidentTrendData({
          labels: trendLabels,
          datasets: [{
            label: 'Incident Trends Over Time',
            data: trendCounts,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
          }],
        });

        const priorityLabels = incidents.map(incident => incident.priority || 'Unknown');
        const priorityCounts = incidents.map(incident => incident.count || 0);

        setPriorityData({
          labels: priorityLabels,
          datasets: [{
            label: 'Incident Priority',
            data: priorityCounts,
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
            borderWidth: 1,
          }],
        });
      } catch (error) {
        console.error('Error fetching incident data:', error);
      }
    };

    const fetchResolutionData = async () => {
      try {
        const response = await axios.get(API.GET_ADMIN_RESOLUTION);
        const resolutions = response.data || [];

        const resolutionLabels = resolutions.map(resolution => resolution.status || 'Unknown');
        const resolutionCounts = resolutions.map(resolution => resolution.count || 0);

        setResolutionData({
          labels: resolutionLabels,
          datasets: [{
            label: 'Resolution Statuses',
            data: resolutionCounts,
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
            borderWidth: 1,
          }],
        });

        setTotalResolutions(resolutions.reduce((sum, resolution) => sum + (resolution.count || 0), 0));
      } catch (error) {
        console.error('Error fetching resolution data:', error);
      }
    };

    fetchIncidentData();
    fetchResolutionData();
  }, []);

  return (
    <div className="flex-1 p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>
      <div className="flex space-x-4 mb-6">
        <button
          className={`w-full py-2 px-4 text-white font-semibold rounded-lg shadow-md ${currentView === 'category' ? 'bg-blue-600' : 'bg-blue-400'}`}
          onClick={() => setCurrentView('category')}
        >
          Incident Categories
        </button>
        <button
          className={`w-full py-2 px-4 text-white font-semibold rounded-lg shadow-md ${currentView === 'incident' ? 'bg-blue-600' : 'bg-blue-400'}`}
          onClick={() => setCurrentView('incident')}
        >
          Incidents
        </button>
        <button
          className={`w-full py-2 px-4 text-white font-semibold rounded-lg shadow-md ${currentView === 'resolution' ? 'bg-blue-600' : 'bg-blue-400'}`}
          onClick={() => setCurrentView('resolution')}
        >
          Resolutions
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Total Incidents</h2>
          <p className="text-3xl font-bold text-center">{totalIncidents}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Total Resolutions</h2>
          <p className="text-3xl font-bold text-center">{totalResolutions}</p>
        </div>
      </div>
      <div className="space-y-6">
        {currentView === 'category' && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Incident Categories</h2>
            <Bar
              data={incidentData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.dataset.label}: ${context.raw}`,
                    },
                  },
                },
              }}
            />
          </div>
        )}
        {currentView === 'incident' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Incident Trends Over Time</h2>
              <Line
                data={incidentTrendData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.dataset.label}: ${context.raw}`,
                      },
                    },
                  },
                }}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Incident Priority</h2>
              <Doughnut
                data={priorityData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.label}: ${context.raw}`,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        )}
        {currentView === 'resolution' && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Resolution Statuses</h2>
            <Pie
              data={resolutionData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.label}: ${context.raw}`,
                    },
                  },
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
