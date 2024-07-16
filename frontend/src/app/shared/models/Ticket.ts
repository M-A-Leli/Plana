import Attendee from "./Attendee";
import Event from "./Event";
import Payment from "./Payment";
import TicketType from "./TicketTypes";

export default interface Ticket {
  id?: string,
  ticket_type_id: string,
  attendee_id: string,
  event_id: string,
  unique_code: string,
  ticket_type?: TicketType,
  attendee?: Attendee,
  event?: Event
  payment?: Payment
}
