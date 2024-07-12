import Ticket from "./Ticket";
import Event from "./Event";

export default interface TicketType {
  id?: string,
  event_id: string,
  name: string,
  type: string,
  price: number,
  availability: number,
  group_size?: number,
  tickets?: Ticket[],
  event?: Event
}
