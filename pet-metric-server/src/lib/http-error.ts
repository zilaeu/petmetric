export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

export class NotFoundError extends HttpError {
  constructor(resource: string) {
    super(404, 'NOT_FOUND', `${resource} not found`)
  }
}
