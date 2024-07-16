export class CannotWatchLessonError extends Error {
  constructor(cause?: string) {
    super(`Cannot watch lesson${cause ? `, because ${cause}` : '.'}`);
  }
}
