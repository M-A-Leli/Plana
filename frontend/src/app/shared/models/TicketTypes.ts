import Ticket from "./Ticket";
import IEvent from "./Event";

export default interface TicketType {
  id?: string,
  event_id: string,
  name: string,
  price: number,
  availability: number,
  group_size?: number,
  is_deleted: boolean,
  tickets?: Ticket[],
  event?: IEvent
}
