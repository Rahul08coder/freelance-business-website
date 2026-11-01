// Apni taraf se koi error dena ho toh: throw new HttpError(404, 'Project not found.')
// errorHandler ise pakad ke sahi status aur message ke saath JSON bhej deta hai.
export class HttpError extends Error {
  constructor(statusCode, message, details) {
    super(message)
    this.name = 'HttpError'
    this.statusCode = statusCode
    this.details = details
  }
}