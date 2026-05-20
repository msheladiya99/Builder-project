import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "builder_secret_token_123_abc";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    let token = "";
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (!token) {
      return res.status(401).json({ error: "Access denied. Authentication token missing." });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      tenantId: decoded.tenantId
    };
    
    // Ensure tenant isolation
    // If user belongs to a specific tenant project, they cannot access another tenant
    if (req.user.tenantId && req.tenantId !== "master" && req.user.tenantId !== req.tenantId) {
      return res.status(403).json({ error: "Access forbidden. Tenant boundary violation." });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ error: "Session expired or invalid authentication token." });
  }
}

/**
 * Middleware to restrict access to specific roles
 * @param allowedRoles Array of strings corresponding to allowed User roles
 */
export function authorize(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required." });
    }
    
    const role = req.user.role;
    if (role === "Super Admin" || allowedRoles.includes(role)) {
      return next();
    }
    
    return res.status(403).json({ error: `Forbidden. Role '${role}' lacks permissions for this action.` });
  };
}
