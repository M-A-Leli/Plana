import { Request, Response, NextFunction } from 'express';
import TicketTypeService from '../services/TicketType.service';

class TicketTypeController {

  private ticketTypeService: TicketTypeService;

  constructor() {
    this.ticketTypeService = new TicketTypeService();
  }

  getAllTicketTypes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticketTypes = await this.ticketTypeService.getAllTicketTypes();
      res.status(200).json(ticketTypes);
    } catch (error: any) {
      next(error);
    }
  }

  getTicketTypeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticketType = await this.ticketTypeService.getTicketTypeById(req.params.id);
      res.status(200).json(ticketType);
    } catch (error: any) {
      next(error);
    }
  }

  createTicketType = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticketType = await this.ticketTypeService.createTicketType(req.body);
      res.status(201).json(ticketType);
    } catch (error: any) {
      next(error);
    }
  }

  updateTicketType = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticketType = await this.ticketTypeService.updateTicketType(req.params.id, req.body);
      res.status(200).json(ticketType);
    } catch (error: any) {
      next(error);
    }
  }

  deleteTicketType = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.ticketTypeService.deleteTicketType(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      next(error);
    }
  }

  getTicketTypesByEventId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookings = await this.ticketTypeService.getTicketTypesByEventId(req.params.id);
      res.json(bookings);
    } catch (error) {
      next(error);
    }
  }
}

export default new TicketTypeController();
