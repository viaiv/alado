import { SendEmailCommand } from "@aws-sdk/client-ses"
import type { SESClient } from "@aws-sdk/client-ses"

export interface SendResult {
  email: string
  success: boolean
  messageId?: string
  error?: string
}

export interface SendProgress {
  sent: number
  total: number
  results: SendResult[]
}

interface SendOptions {
  client: SESClient
  sender: string
  subject: string
  htmlBody: string
  recipients: string[]
  ratePerSecond: number
  onProgress: (progress: SendProgress) => void
  signal: AbortSignal
}

function delay(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms)
    signal.addEventListener("abort", () => {
      clearTimeout(timer)
      reject(new DOMException("Aborted", "AbortError"))
    }, { once: true })
  })
}

export async function sendEmails(options: SendOptions): Promise<SendResult[]> {
  const { client, sender, subject, htmlBody, recipients, ratePerSecond, onProgress, signal } = options
  const results: SendResult[] = []
  const delayMs = Math.ceil(1000 / ratePerSecond)

  for (let i = 0; i < recipients.length; i++) {
    if (signal.aborted) break

    const email = recipients[i]
    const command = new SendEmailCommand({
      Source: sender,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: subject, Charset: "UTF-8" },
        Body: {
          Html: { Data: htmlBody, Charset: "UTF-8" },
        },
      },
    })

    try {
      const response = await client.send(command, { abortSignal: signal })
      results.push({ email, success: true, messageId: response.MessageId })
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") break
      results.push({
        email,
        success: false,
        error: err instanceof Error ? err.message : String(err),
      })
    }

    onProgress({ sent: i + 1, total: recipients.length, results: [...results] })

    if (i < recipients.length - 1 && !signal.aborted) {
      try {
        await delay(delayMs, signal)
      } catch {
        break
      }
    }
  }

  return results
}
