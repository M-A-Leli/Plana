import Event from "./Event";
import User from "./User";

export default interface Organizer {
  id?: string,
  user_id?: string,
  company?: string,
  bio?: string
  events?: Event[]
  user?: User,
}
