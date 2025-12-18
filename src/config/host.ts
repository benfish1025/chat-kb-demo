export const apiHost: string =
  (import.meta.env.CHAT_API_HOST as string | undefined)?.replace(/\/+$/, "") || "";

export const referenceFileHost: string =
  (import.meta.env.CHAT_REFERENCE_FILE_HOST as string | undefined)?.replace(/\/+$/, "") || "";