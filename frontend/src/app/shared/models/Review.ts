import Attendee from "./Attendee";
import IEvent from "./Event";

export default interface Review {
  id?: string,
  attendee_id: string,
  event_id: string,
  rating: number,
  comment: string,
  is_deleted?: boolean,
  attendee?: Attendee
  event?: IEvent
}
