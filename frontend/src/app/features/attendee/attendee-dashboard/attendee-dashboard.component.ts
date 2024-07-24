import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
// import { Label } from 'ng2-charts';

@Component({
  selector: 'app-attendee-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './attendee-dashboard.component.html',
  styleUrl: './attendee-dashboard.component.css'
})
export class AttendeeDashboardComponent {
  // totalEventsAttended = 0;
  // totalOrders = 0;
  // totalReviewsWritten = 0;
  // totalTicketsPurchased = 0;

  // monthlyEventParticipationData = [{ data: [], label: 'Event Participation' }];
  // monthlyOrdersData = [{ data: [], label: 'Orders' }];
  // ratingsDistributionData = [{ data: [], backgroundColor: [], label: 'Ratings Distribution' }];

  // monthlyLabels: Label[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  // ratingsLabels: Label[] = ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'];

  // chartOptions: ChartOptions = {
  //   responsive: true,
  //   scales: {
  //     xAxes: [{ gridLines: { color: '#aeb9e1' }, ticks: { fontColor: '#ffffff' } }],
  //     yAxes: [{ gridLines: { color: '#aeb9e1' }, ticks: { fontColor: '#ffffff' } }]
  //   },
  //   legend: {
  //     labels: {
  //       fontColor: '#ffffff'
  //     }
  //   }
  // };

  // constructor(private http: HttpClient) {}

  // ngOnInit(): void {
  //   this.fetchAnalytics();
  // }

  // fetchAnalytics(): void {
  //   this.http.get('/api/user/analytics').subscribe((data: any) => {
  //     this.totalEventsAttended = data.totalEventsAttended;
  //     this.totalOrders = data.totalOrders;
  //     this.totalReviewsWritten = data.totalReviewsWritten;
  //     this.totalTicketsPurchased = data.totalTicketsPurchased;

  //     this.monthlyEventParticipationData = [
  //       {
  //         data: data.monthlyEventParticipation.map((entry: any) => entry.count),
  //         label: 'Event Participation'
  //       }
  //     ];

  //     this.monthlyOrdersData = [
  //       {
  //         data: data.monthlyOrders.map((entry: any) => entry.count),
  //         label: 'Orders'
  //       }
  //     ];

  //     this.ratingsDistributionData = [
  //       {
  //         data: data.ratingsDistribution.map((entry: any) => entry.count),
  //         backgroundColor: ['#081028', '#061027', '#0b1739', '#cb3cff', '#00c2ff'],
  //         label: 'Ratings Distribution'
  //       }
  //     ];
  //   });
  // }
}
