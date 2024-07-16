import { BaseEntity } from 'src/domain/entities/base-entity';

export abstract class Repository<T extends BaseEntity<J>, J> {
  protected data: T[];

  constructor() {
    this.data = [];
  }

  abstract store(object: T): void;

  abstract update(id: T['id'], props: T['props']): T;

  load(): T[] {
    return this.data;
  }

  get(id: T['id']): T {
    const founded = this.data.find((item) => item.id === id);

    return founded;
  }

  delete(id: T['id']) {
    const founded = this.data.findIndex((item) => item.id === id);

    this.data.splice(founded, 1);
  }

  protected findItemById(id: T['id']) {
    const foundedItem = this.data.findIndex((item) => item.id === id);

    return foundedItem;
  }
}
