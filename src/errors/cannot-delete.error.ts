export class CannotDeleteError extends Error {
    constructor() {
        super("Cannot delete!")
    }
}