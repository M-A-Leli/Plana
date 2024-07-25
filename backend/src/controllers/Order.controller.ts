import { Request, Response, NextFunction } from 'express';
import OrderService from '../services/Order.service';

class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await this.orderService.getAllOrders();
      res.status(200).json(orders);
    } catch (error: any) {
      next(error);
    }
  }

  getPaidOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await this.orderService.getPaidOrders();
      res.status(200).json(orders);
    } catch (error: any) {
      next(error);
    }
  }

  getUnpaidOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await this.orderService.getUnpaidOrders();
      res.status(200).json(orders);
    } catch (error: any) {
      next(error);
    }
  }

  getDeletedOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await this.orderService.getDeletedOrders();
      res.status(200).json(orders);
    } catch (error: any) {
      next(error);
    }
  }

  getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await this.orderService.getOrderById(req.params.id);
      res.status(200).json(order);
    } catch (error: any) {
      next(error);
    }
  }

  createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user?.id as string;
      const order = await this.orderService.createOrder(user_id, req.body);
      res.status(201).json(order);
    } catch (error: any) {
      next(error);
    }
  }

  updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await this.orderService.updateOrder(req.params.id, req.body);
      res.status(200).json(order);
    } catch (error: any) {
      next(error);
    }
  }

  deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.orderService.deleteOrder(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      next(error);
    }
  }

  getOrdersByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user?.id as string;
      const orders = await this.orderService.getOrdersByUserId(user_id);
      res.status(200).json(orders);
    } catch (error: any) {
      next(error);
    }
  }

  getUnpaidOrderByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user?.id as string;
      const order = await this.orderService.getUnpaidOrderByUserId(user_id);
      res.status(200).json(order);
    } catch (error: any) {
      next(error);
    }
  }

  getPaidOrdersByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user?.id as string;
      const order = await this.orderService.getPaidOrdersByUserId(user_id);
      res.status(200).json(order);
    } catch (error: any) {
      next(error);
    }
  }

  checkoutOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user?.id as string;
      await this.orderService.checkoutOrder(user_id);
      res.status(200).json({ message: 'Order checked out successfully' });
    } catch (error: any) {
      next(error);
    }
  }

  getOrderAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const analytics = await this.orderService.getOrderAnalytics();
      res.status(200).json(analytics);
    } catch (error: any) {
      next(error);
    }
  }
}

export default new OrderController();
