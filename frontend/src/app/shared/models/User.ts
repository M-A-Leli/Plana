import Admin from "./Admin";
import Attendee from "./Attendee";
import Notification from "./Notification";
import Organizer from "./Organizer";

export default interface User {
  id?: string,
  email: string,
  password?: string,
  username: string,
  is_deleted?: string,
  is_suspended?: string,
  profile_img?: string,
  attendees?: Attendee,
  organizers?: Organizer,
  admin?: Admin,
  notifications?: Notification[]
}
