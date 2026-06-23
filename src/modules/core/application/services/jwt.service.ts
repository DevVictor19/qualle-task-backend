export interface JwtPayload {
  userId: string;
  [key: string]: any;
}

export abstract class JwtService {
  abstract sign(payload: JwtPayload, exp?: number): Promise<string>;
  abstract verify<T>(token: string): Promise<T | null>;
}
