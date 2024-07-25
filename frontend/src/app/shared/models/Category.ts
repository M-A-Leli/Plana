import IEvent from "./Event"

export default interface Category {
  id?: string,
  name: string,
  events?: IEvent[]
}
