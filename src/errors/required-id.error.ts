export class RequiredIdError extends Error {
    constructor() {
        super("ID is required in this requisicion!")
    }
}