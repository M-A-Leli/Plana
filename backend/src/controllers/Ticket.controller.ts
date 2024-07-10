import { Request, Response, NextFunction } from 'express';
import TicketService from '../services/Ticket.service';

class TicketController {

  private ticketService: TicketService;

  constructor() {
    this.ticketService = new TicketService();
  }

  getAllTickets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tickets = await this.ticketService.getAllTickets();
      res.status(200).json(tickets);
    } catch (error: any) {
      next(error);
    }
  }

  getTicketById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticket = await this.ticketService.getTicketById(req.params.id);
      res.status(200).json(ticket);
    } catch (error: any) {
      next(error);
    }
  }

  createTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticket = await this.ticketService.createTicket(req.body);
      res.status(201).json(ticket);
    } catch (error: any) {
      next(error);
    }
  }

  updateTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticket = await this.ticketService.updateTicket(req.params.id, req.body);
      res.status(200).json(ticket);
    } catch (error: any) {
      next(error);
    }
  }

  deleteTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.ticketService.deleteTicket(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      next(error);
    }
  }

  validateTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticket = await this.ticketService.validateTicket(req.params.id);
      res.status(200).json(ticket);
    } catch (error: any) {
      next(error);
    }
  }

  getTicketsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user?.id as string;
      const ticket = await this.ticketService.getTicketsByUserId(user_id);
      res.status(200).json(ticket);
    } catch (error: any) {
      next(error);
    }
  }

  getEventTicketsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user?.id as string;
      const ticket = await this.ticketService.getEventTicketsByUserId(user_id, req.params.id);
      res.status(200).json(ticket);
    } catch (error: any) {
      next(error);
    }
  }

  getTicketsByEventId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticket = await this.ticketService.getTicketsByEventId(req.params.id);
      res.status(200).json(ticket);
    } catch (error: any) {
      next(error);
    }
  }
}

export default new TicketController();
