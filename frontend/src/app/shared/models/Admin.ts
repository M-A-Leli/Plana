import User from "./User";

export default interface Admin {
  id?: string,
  user_id?: string,
  is_deleted?: boolean,
  user?: User
}
