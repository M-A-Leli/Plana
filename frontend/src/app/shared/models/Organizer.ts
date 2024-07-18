import Event from "./Event";
import User from "./User";

export default interface Organizer {
  id?: string,
  user_id?: string,
  company?: string,
  bio?: string,
  is_deleted: boolean,
  approved: boolean,
  events?: Event[],
  user?: User,
}
