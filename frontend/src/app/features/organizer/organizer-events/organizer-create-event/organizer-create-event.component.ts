import { Component } from '@angular/core';
import { EventService } from '../../../../core/services/event.service';
import Event from '../../../../shared/models/Event'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-organizer-create-event',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './organizer-create-event.component.html',
  styleUrl: './organizer-create-event.component.css'
})
export class OrganizerCreateEventComponent {
  eventForm: FormGroup;
  images: File[] = [];

  constructor(private fb: FormBuilder, private eventService: EventService) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      venue: ['', Validators.required],
      images: [null, Validators.required]
    });
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    if (files.length > 4) {
      alert('You can only upload up to 4 images');
      return;
    }
    this.images = files;
    this.eventForm.patchValue({ images: this.images });
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      const event: Event = {
        organizer_id: '12345', // replace with actual organizer ID logic
        ...this.eventForm.value,
      };

      const formData = new FormData();
      formData.append('title', event.title);
      formData.append('description', event.description);
      formData.append('date', event.date.toString());
      formData.append('time', event.time.toString());
      formData.append('venue', event.venue);
      Array.from(this.images).forEach((image, index) => {
        formData.append(`images[${index}]`, image, image.name);
      });

      this.eventService.createEvent(formData).subscribe(response => {
        console.log('Event created successfully:', response);
        this.eventForm.reset();
      }, error => {
        console.error('Error creating event:', error);
      });
    }
  }
}
