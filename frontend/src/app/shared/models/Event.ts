import EventImage from "./EventImage";
import Organizer from "./Organizer";
import Review from "./Review";
import Ticket from "./Ticket";
import TicketType from "./TicketTypes";

export default interface Event {
  id?: string,
  organizer_id: string,
  title: string,
  description: string,
  date: Date,
  time: Date,
  venue: string,
  category?: string, //!
  average_rating?: number,
  number_of_reviews?: number,
  images?: EventImage[],
  ticket_types?: TicketType[],
  tickets?: Ticket[],
  reviews?: Review[],
  organizer?: Organizer
}
