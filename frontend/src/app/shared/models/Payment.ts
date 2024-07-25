import Order from "./Order";

export default interface Payment {
  id?: string,
  order_id: string,
  amount: number,
  payment_date: Date,
  status?: string,
  order?: Order
}
