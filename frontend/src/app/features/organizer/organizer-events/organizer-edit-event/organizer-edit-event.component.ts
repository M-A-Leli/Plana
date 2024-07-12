import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../../../../core/services/event.service';
import Event from '../../../../shared/models/Event';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-organizer-edit-event',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './organizer-edit-event.component.html',
  styleUrl: './organizer-edit-event.component.css'
})
export class OrganizerEditEventComponent {
  // @Input() eventId: string = '';
  // editEventForm: FormGroup;
  // event!: Event;

  // constructor(private fb: FormBuilder, private eventService: EventService) {
  //   this.editEventForm = this.fb.group({
  //     title: ['', [Validators.required]],
  //     description: ['', [Validators.required]],
  //     date: ['', [Validators.required]],
  //     time: ['', [Validators.required]],
  //     venue: ['', [Validators.required]],
  //     images: this.fb.array([this.fb.control('')])
  //   });
  // }

  // ngOnInit(): void {
  //   this.loadEvent();
  // }

  // loadEvent(): void {
  //   this.eventService.getEventById(this.eventId).subscribe(
  //     event => {
  //       this.event = event;
  //       this.editEventForm.patchValue({
  //         title: event.title,
  //         description: event.description,
  //         date: event.date,
  //         time: event.time,
  //         venue: event.venue
  //       });

  //       // Populate images form array, ensuring event.images is not undefined
  //       if (event.images) {
  //         const imageControls = event.images.map(img => this.fb.control(img.url));
  //         this.editEventForm.setControl('images', this.fb.array(imageControls));
  //       }
  //     },
  //     error => {
  //       console.error('Error loading event:', error);
  //     }
  //   );
  // }

  // onSubmit(): void {
  //   if (this.editEventForm.valid) {
  //     const updatedEvent: Event = {
  //       ...this.event,
  //       ...this.editEventForm.value
  //     };
  //     this.eventService.updateEvent(this.eventId, updatedEvent).subscribe(
  //       response => {
  //         console.log('Event updated successfully:', response);
  //         // Handle successful update (e.g., close the edit form, show a success message, etc.)
  //       },
  //       error => {
  //         console.error('Error updating event:', error);
  //         // Handle error (e.g., show an error message)
  //       }
  //     );
  //   }
  // }

  // addImageField(): void {
  //   (this.editEventForm.get('images') as FormArray)?.push(this.fb.control(''));
  // }

  // removeImageField(index: number): void {
  //   (this.editEventForm.get('images') as FormArray)?.removeAt(index);
  // }
}
