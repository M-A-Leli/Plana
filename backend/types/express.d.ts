import { UserRole } from "../src/models/types";

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      role: UserRole;
    };
  }
}
