export class MediaError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
