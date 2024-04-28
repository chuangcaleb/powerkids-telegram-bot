/** Thrown in grammy conversations, nowhere else. Should not need message prop, since its intent should be clear by the error name. */
export class ExitConversationError extends Error {
  // constructor(message?: string) {
  //   super(message);
  //   Object.setPrototypeOf(this, ExitConversationError.prototype);
  // }
}
