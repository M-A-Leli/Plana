import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Chart, CategoryScale, LinearScale , LineController, PointElement, LineElement, Filler} from 'chart.js';

// Register the CategoryScale
Chart.register(CategoryScale, LinearScale, LineController, PointElement, LineElement, Filler );

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  highlightCards = [
    { title: 'Total Organizers', value: 50 },
    { title: 'Total Attendees', value: 200 },
    { title: 'Total Events', value: 30 },
    { title: 'Tickets Sold', value: 150 },
    { title: 'Total Revenue', value: '$20,000' },
    { title: 'Active Events', value: 10 }
  ];

  otherAnalytics = [
    { title: 'Average Attendance', value: '85%' },
    { title: 'Event Satisfaction', value: '90%' },
    { title: 'New Signups', value: 120 },
    { title: 'Returning Users', value: '75%' }
  ];

  ngOnInit(): void {
    this.renderYearlyGraph();
  }

  renderYearlyGraph(): void {
    const ctx = document.getElementById('yearlyGraph') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
          {
            label: 'Organizers',
            data: [10, 22, 25, 35, 44, 50, 59, 66, 72, 79, 89, 95],
            borderColor: '#cb3cff',
            backgroundColor: 'rgba(203, 60, 255, 0.2)',
            fill: true
          },
          {
            label: 'Attendees',
            data: [30, 42, 55, 68, 79, 85, 95, 110, 121, 130, 145, 160],
            borderColor: '#0e43fb',
            backgroundColor: 'rgba(14, 67, 251, 0.2)',
            fill: true
          },
          {
            label: 'Events',
            data: [5, 12, 15, 22, 28, 35, 39, 45, 50, 58, 63, 70],
            borderColor: '#00c2ff',
            backgroundColor: 'rgba(0, 194, 255, 0.2)',
            fill: true
          },
          {
            label: 'Tickets Sold',
            data: [50, 60, 75, 88, 95, 105, 115, 130, 142, 150, 165, 180],
            borderColor: '#aeb9e1',
            backgroundColor: 'rgba(174, 185, 225, 0.2)',
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
