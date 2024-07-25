import IEvent from "./Event";

export default interface EventImage {
  id?: string,
  url: string,
  event_id: string,
  event?: IEvent
}
