export class AlreadyExistsError extends Error {
  constructor() {
    super('This already exists in system!');
  }
}
