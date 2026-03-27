export function sanitizeForEmailHeader(value: string): string {
  return value.replace(/[\r\n]/g, " ").trim().slice(0, 200);
}

export function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "").trim();
}
