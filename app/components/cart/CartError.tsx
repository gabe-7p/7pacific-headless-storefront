/** A cart form's inline error line: a rejected quantity or discount code. */
export const CartError = ({ message }: { message: string }) => (
  // palette: Ember on the error line is the existing treatment; PR 7 swaps it for the error token
  <p className="mt-2 text-xs text-ember" role="alert">
    {message}
  </p>
);
