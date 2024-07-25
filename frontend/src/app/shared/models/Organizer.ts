import IEvent from "./Event";
import User from "./User";

export default interface Organizer {
  id?: string,
  user_id?: string,
  company?: string,
  bio?: string,
  is_deleted: boolean,
  approved: boolean,
  events?: IEvent[],
  user?: User,
}
