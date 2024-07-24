import { Request, Response, NextFunction } from 'express';
import AnalyticsService from '../services/Analytics.service';

class AnalyticsController {

    private analyticsService: AnalyticsService;

    constructor() {
        this.analyticsService = new AnalyticsService();
    }

    getAttendeeDashboardAnalytics = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_id = req.user?.id as string;
            const analytics = await this.analyticsService.getAttendeeDashboardAnalytics(user_id);
            res.status(200).json(analytics);
        } catch (error: any) {
            next(error);
        }
    }

    getOrganizerAnalytics = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_id = req.user?.id as string;
            // const analytics = await this.analyticsService.getOrganizerAnalytics(user_id);
            // res.status(200).json(analytics);
        } catch (error: any) {
            next(error);
        }
    }

    getAdminAnalytics = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_id = req.user?.id as string;
            // const analytics = await this.analyticsService.getAdminAnalytics(user_id);
            // res.status(200).json(analytics);
        } catch (error: any) {
            next(error);
        }
    }
}

export default new AnalyticsController();
