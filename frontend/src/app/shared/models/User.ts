import Admin from "./Admin";
import Attendee from "./Attendee";
import Notification from "./Notification";
import Organizer from "./Organizer";

export default interface User {
  id?: string,
  email: string,
  password?: string,
  username: string,
  phone_number?: string,
  profile_img?: string,
  attendees?: Attendee,
  organizers?: Organizer,
  admin?: Admin,
  notifications?: Notification[]
}
