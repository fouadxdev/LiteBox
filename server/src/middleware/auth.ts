import type { Request, Response, NextFunction } from 'express';


export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        // user logged in
        return next()
    }

    res.status(401).json({ error: 'Not Authenticated'})
}