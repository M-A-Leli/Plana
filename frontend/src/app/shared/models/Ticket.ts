import Order from "./Order";
import TicketType from "./TicketTypes";

export default interface Ticket {
  id?: string,
  ticket_type_id: string,
  order_id: string,
  quantity: number,
  subtotal: number,
  unique_code?: string,
  is_deleted?: boolean,
  ticket_type?: TicketType,
  order?: Order
}
