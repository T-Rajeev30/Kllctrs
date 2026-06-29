import { ChatContext } from "./context";

export function mergeContext(
  args: any,
  context: ChatContext
) {
  return {
    ...context,
    ...args,
  };
}