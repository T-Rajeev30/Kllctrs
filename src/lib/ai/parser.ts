export function extractText(response: any): string {
  let text = response.text;

  if (!text) {
    const parts =
      response.candidates?.[0]?.content?.parts ??
      [];

    text = parts
      .map((part: any) => part.text ?? "")
      .join("\n")
      .trim();
  }

  return (
    text ||
    "I couldn't generate a response."
  );
}