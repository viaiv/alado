const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface ParseResult {
  valid: string[]
  invalid: string[]
}

export function parseRecipients(text: string): ParseResult {
  const raw = text
    .split(/[,;\n\r]+/)
    .map((s) => s.trim())
    .filter(Boolean)

  const valid: string[] = []
  const invalid: string[] = []
  const seen = new Set<string>()

  for (const entry of raw) {
    const lower = entry.toLowerCase()
    if (seen.has(lower)) continue
    seen.add(lower)

    if (EMAIL_REGEX.test(entry)) {
      valid.push(lower)
    } else {
      invalid.push(entry)
    }
  }

  return { valid, invalid }
}

export function parseFileContent(content: string): ParseResult {
  return parseRecipients(content)
}
