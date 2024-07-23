import EventImage from "./EventImage";
import Organizer from "./Organizer";
import Review from "./Review";
import Order from "./Order";
import TicketType from "./TicketTypes";

export default interface IEvent {
  id?: string,
  organizer_id?: string,
  title: string,
  description: string,
  date: Date,
  start_time: string,
  end_time: string,
  venue: string,
  average_rating?: number,
  number_of_reviews?: number,
  is_deleted?: boolean,
  is_featured?: boolean,
  images?: EventImage[],
  ticket_types?: TicketType[],
  orders?: Order[],
  reviews?: Review[],
  organizer?: Organizer
}
