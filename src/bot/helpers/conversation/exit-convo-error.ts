export class ExitConversationError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, ExitConversationError.prototype);
  }
}
