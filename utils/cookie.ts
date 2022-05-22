import { serialize, CookieSerializeOptions } from "cookie"
import { ServerResponse } from "http"

/**
 * This sets `cookie` using the `res` object
 */

export const setCookie = (
  res: ServerResponse,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = {}
) => {
  const stringValue = typeof value === "object" ? "j:" + JSON.stringify(value) : String(value)

  if (options.maxAge) {
    options.expires = new Date(Date.now() + options.maxAge)
    options.maxAge /= 1000
  }

  res.setHeader("Set-Cookie", serialize(name, stringValue, options))
}
