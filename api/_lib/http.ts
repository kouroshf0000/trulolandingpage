type ApiRequest = {
  body?: unknown;
  method?: string;
  headers: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  send: (body: string) => void;
  setHeader: (name: string, value: string | string[]) => void;
};

export async function readJsonBody(req: ApiRequest): Promise<Record<string, unknown>> {
  if (req.body == null) return {};
  if (typeof req.body === "string") {
    return JSON.parse(req.body) as Record<string, unknown>;
  }
  if (Buffer.isBuffer(req.body)) {
    return JSON.parse(req.body.toString("utf8")) as Record<string, unknown>;
  }
  if (typeof req.body === "object") {
    return req.body as Record<string, unknown>;
  }
  throw new Error("Invalid JSON body");
}

export function sendJson(res: ApiResponse, status: number, body: unknown): void {
  res.status(status).json(body);
}

export function methodNotAllowed(res: ApiResponse, methods: string[]): void {
  res.setHeader("Allow", methods.join(", "));
  sendJson(res, 405, { error: "Method not allowed" });
}

export function firstHeader(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function queryValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
