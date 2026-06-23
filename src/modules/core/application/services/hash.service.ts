export abstract class HashService {
  abstract hash(value: string, salt?: number): Promise<string>;
  abstract compare(value: string, hash: string): Promise<boolean>;
}
