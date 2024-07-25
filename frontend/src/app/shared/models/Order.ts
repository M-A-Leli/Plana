import Attendee from "./Attendee";
import IEvent from "./Event";
import Payment from "./Payment";
import Ticket from "./Ticket";

export default interface Order {
  id?: string,
  attendee_id: string,
  event_id: string,
  total: number,
  payment_id?: string,
  is_deleted?: boolean,
  updated_at: Date,
  tickets?: Ticket,
  payment?: Payment,
  attendee?: Attendee,
  event?: IEvent
}
