import User from "./User";

export default interface Notification {
  id?: string,
  user_id: string,
  type?: string,
  message: string,
  read?: boolean,
  is_deleted?: boolean,
  created_at?: Date,
  user?: User
}
