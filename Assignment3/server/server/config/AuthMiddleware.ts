import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const SECRET_KEY =
  '8ae9bc42a4e47ce1ae9fc65745c1063cee0e0fe3f61f10436ecf649cff79928030f3300ed24f4362f1bdaf2219498e6fbb53385046f010694025ae126bc125faa280d95b5a64cf3909f0bd84ed35c717cc587c8d0b8366042b70187e359d70a091c647776c8ff54f6c27dc7dd216ce55e0d4dcc08b403819a5559013acc834a2ec1ec26f9b150145f2611471506ee9c8863c11142e911240495164d3d2ff1724cfd61c8f114360d355e77eb3319d481a5e78f6fe6283b96a46f4b6f8a3f9f9f176906aad05c8a3bae0ef2862dc17885ba24afcc910ee3c25034c6ba5da6cd62a8fd21b029a63d3242e1edbde8bcc418a71d837adc1864206bd5bc6ba90882dc5';


 
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.split(' ')[1];
  console.log('Headers:', req.headers);
  if (!token) {
    res.status(401).json({ message: 'Access denied' });
    return;
  }
  console.log("sdasdaswreqwrsad")
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { username: string };
    (req as any).user = decoded.username; // Explicitly assign `user` to the request object
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};
