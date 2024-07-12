import Ticket from "./Ticket";

export default interface Payment {
  id?: string,
  ticket_id: string,
  amount: number,
  payment_date: Date,
  status?: string,
  ticket?: Ticket
}
