import Attendee from "./Attendee";
import Event from "./Event";

export default interface Review {
  id?: string,
  attendee_id: string,
  event_id: string,
  rating: number,
  comment: string,
  attendee?: Attendee
  event?: Event
}
