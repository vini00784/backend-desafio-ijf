export abstract class BaseEntity<T> {
  #id: string;
  #createdAt = new Date();
  #props: T;

  constructor(id: string, props: T) {
    this.#id = id;
    this.#props = props;
  }

  get id(): string {
    return this.#id;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get props(): T {
    return this.#props;
  }

  protected set props(props: T) {
    this.#props = props;
  }
}
