export interface JwtPayload {
  userId: string;
  [key: string]: any;
}

export abstract class JwtService {
  abstract sign(payload: JwtPayload, expInSeconds: number): string;
  abstract verify<T>(token: string): T | null;
}
