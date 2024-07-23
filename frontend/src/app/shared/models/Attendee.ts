import Review from "./Review";
import Order from "./Order";
import User from "./User";

export default interface Attendee {
  id?: string,
  user_id?: string,
  bio?: string,
  is_deleted?: boolean,
  orders?: Order[],
  reviews?: Review[],
  user?: User
}
