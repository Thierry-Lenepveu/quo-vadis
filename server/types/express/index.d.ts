import type { JwtPayload } from "jsonwebtoken";

declare global {
  export type QuoVadisPayload = JwtPayload & { sub: string; isAdmin: boolean };

  namespace Express {
    export interface Request {
      /* ************************************************************************* */
      // Add your custom properties here, for example:
      //
      // user?: { ... }
      auth: QuoVadisPayload;
      /* ************************************************************************* */
    }
  }
}
