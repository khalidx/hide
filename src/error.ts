export class ApplicationError extends Error {
  type: 'ApplicationError'
  constructor (message: string) {
    super(message)
    this.type = 'ApplicationError'
  }
}

export function error (message: string): ApplicationError {
  return new ApplicationError(message)
}

export function isApplicationError (error: any): boolean {
  return (error instanceof ApplicationError || error.type === 'ApplicationError')
}
