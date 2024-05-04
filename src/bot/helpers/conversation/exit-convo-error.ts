export class ExitConversationError extends Error {
  conversationError;

  constructor(message?: string) {
    super(message);
    this.conversationError = message;
    Object.setPrototypeOf(this, ExitConversationError.prototype);
  }
}
