import { BaseEntity, BaseEntityProps } from '../../base.entity';

class StubEntity extends BaseEntity {
  constructor(props: BaseEntityProps) {
    super(props);
  }
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('BaseEntity', () => {
  it('should generate a uuid when id is not provided', () => {
    const entity = new StubEntity({});

    expect(entity.id).toMatch(UUID_REGEX);
  });

  it('should use the provided id', () => {
    const id = '123e4567-e89b-42d3-a456-426614174000';
    const entity = new StubEntity({ id });

    expect(entity.id).toBe(id);
  });

  it('should generate createdAt when not provided', () => {
    const entity = new StubEntity({});

    expect(entity.createdAt).toBeInstanceOf(Date);
  });

  it('should use the provided createdAt', () => {
    const createdAt = new Date('2024-01-01T00:00:00.000Z');
    const entity = new StubEntity({ createdAt });

    expect(entity.createdAt).toBe(createdAt);
  });

  it('should generate updatedAt when not provided', () => {
    const entity = new StubEntity({});

    expect(entity.updatedAt).toBeInstanceOf(Date);
  });

  it('should use the provided updatedAt', () => {
    const updatedAt = new Date('2024-06-01T00:00:00.000Z');
    const entity = new StubEntity({ updatedAt });

    expect(entity.updatedAt).toBe(updatedAt);
  });

  it('should generate a different id for each entity when id is not provided', () => {
    const entityA = new StubEntity({});
    const entityB = new StubEntity({});

    expect(entityA.id).not.toBe(entityB.id);
  });
});
