export class CannotApproveStudentError extends Error {
    constructor(cause?: string) {
        super(`Cannot approve student${cause ? `, because ${cause}` : "."}`)
    }
}