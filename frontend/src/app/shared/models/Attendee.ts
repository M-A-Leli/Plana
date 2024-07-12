import Review from "./Review";
import Ticket from "./Ticket";
import User from "./User";

export default interface Attendee {
  id?: string,
  user_id?: string,
  first_name?: string,
  last_name?: string,
  bio?: string,
  tickets?: Ticket[],
  reviews?: Review[],
  user?: User
}
