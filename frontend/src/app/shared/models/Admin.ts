import User from "./User";

export default interface Admin {
  id?: string,
  user_id?: string,
  level?: number,
  is_deleted?: boolean,
  user?: User
}
