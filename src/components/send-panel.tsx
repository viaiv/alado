import { useState, useRef, useCallback } from "react"
import { Send, Square, CheckCircle2, XCircle, Rocket, Gauge } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { createSesClient, type AwsCredentials } from "@/lib/ses-client"
import { sendEmails, type SendProgress, type SendResult } from "@/lib/email-sender"

interface SendPanelProps {
  credentials: AwsCredentials
  sender: string
  subject: string
  htmlBody: string
  recipients: string[]
}

export function SendPanel({ credentials, sender, subject, htmlBody, recipients }: SendPanelProps) {
  const [sending, setSending] = useState(false)
  const [progress, setProgress] = useState<SendProgress | null>(null)
  const [results, setResults] = useState<SendResult[]>([])
  const [ratePerSecond, setRatePerSecond] = useState(1)
  const abortRef = useRef<AbortController | null>(null)

  const isReady =
    credentials.accessKeyId &&
    credentials.secretAccessKey &&
    credentials.region &&
    sender &&
    subject &&
    htmlBody &&
    recipients.length > 0

  const handleSend = useCallback(async () => {
    const controller = new AbortController()
    abortRef.current = controller

    setSending(true)
    setProgress(null)
    setResults([])

    const client = createSesClient(credentials)

    try {
      const finalResults = await sendEmails({
        client,
        sender,
        subject,
        htmlBody,
        recipients,
        ratePerSecond,
        onProgress: (p) => setProgress({ ...p }),
        signal: controller.signal,
      })
      setResults(finalResults)
    } catch {
      // AbortError is expected when user cancels
    } finally {
      setSending(false)
      abortRef.current = null
    }
  }, [credentials, sender, subject, htmlBody, recipients, ratePerSecond])

  const handleStop = () => {
    abortRef.current?.abort()
  }

  const successCount = results.filter((r) => r.success).length
  const failCount = results.filter((r) => !r.success).length
  const progressPercent = progress ? (progress.sent / progress.total) * 100 : 0

  const missingItems = []
  if (!credentials.accessKeyId || !credentials.secretAccessKey) missingItems.push("Credenciais AWS")
  if (!sender) missingItems.push("Remetente")
  if (!subject) missingItems.push("Assunto")
  if (!htmlBody) missingItems.push("Conteudo HTML")
  if (recipients.length === 0) missingItems.push("Destinatarios")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-4 w-4 text-amber" />
          Enviar
        </CardTitle>
        <CardDescription>Revise as configuracoes e inicie o disparo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Summary grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Remetente", value: sender, mono: true },
            { label: "Regiao", value: credentials.region, mono: true },
            { label: "Assunto", value: subject, mono: false },
            { label: "Destinatarios", value: recipients.length > 0 ? `${recipients.length}` : undefined, mono: true },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-border/40 bg-secondary/20 px-3.5 py-2.5"
            >
              <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60">
                {item.label}
              </div>
              <div
                className={`mt-0.5 truncate text-sm ${
                  item.value
                    ? item.mono ? "font-mono text-foreground" : "text-foreground"
                    : "text-muted-foreground/40 italic"
                }`}
              >
                {item.value || "—"}
              </div>
            </div>
          ))}
        </div>

        {/* Rate control */}
        <div className="space-y-2">
          <Label htmlFor="rate" className="flex items-center gap-1.5">
            <Gauge className="h-3 w-3" />
            Velocidade (emails/segundo)
          </Label>
          <Input
            id="rate"
            type="number"
            min={1}
            max={50}
            value={ratePerSecond}
            onChange={(e) =>
              setRatePerSecond(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-28 font-mono"
            disabled={sending}
          />
          <p className="text-xs text-muted-foreground/60">
            Sandbox: 1/seg &middot; Producao: ~14/seg (varia por conta)
          </p>
        </div>

        {/* Missing items warning */}
        {!isReady && missingItems.length > 0 && (
          <div className="rounded-lg border border-amber/20 bg-amber/5 px-4 py-3 text-xs text-amber">
            <span className="font-medium">Faltando:</span>{" "}
            {missingItems.join(", ")}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-1">
          <Button
            onClick={handleSend}
            disabled={!isReady || sending}
            size="lg"
            className={isReady && !sending ? "animate-pulse-glow" : ""}
          >
            <Send className="mr-2 h-4 w-4" />
            {sending ? "Enviando..." : "Disparar emails"}
          </Button>
          {sending && (
            <Button variant="destructive" onClick={handleStop} size="lg">
              <Square className="mr-2 h-4 w-4" />
              Parar
            </Button>
          )}
        </div>

        {/* Progress */}
        {progress && (
          <div className="space-y-3 rounded-lg border border-border/40 bg-secondary/20 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Progresso
              </span>
              <span className="font-mono text-sm text-amber">
                {progress.sent}
                <span className="text-muted-foreground"> / {progress.total}</span>
              </span>
            </div>
            <Progress value={progressPercent} />
            <div className="text-right font-mono text-xs text-muted-foreground">
              {Math.round(progressPercent)}%
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="success">{successCount} enviados</Badge>
              {failCount > 0 && (
                <Badge variant="destructive">{failCount} falharam</Badge>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto rounded-lg border border-border/40">
              <table className="w-full">
                <thead className="sticky top-0 bg-card">
                  <tr className="border-b border-border/40">
                    <th className="px-3 py-2.5 text-left text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                      Email
                    </th>
                    <th className="px-3 py-2.5 text-center text-[10px] font-medium uppercase tracking-widest text-muted-foreground w-16">
                      Status
                    </th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                      Detalhe
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr
                      key={i}
                      className="border-b border-border/20 transition-colors hover:bg-secondary/30"
                    >
                      <td className="px-3 py-2 font-mono text-xs text-foreground/80">
                        {r.email}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {r.success ? (
                          <CheckCircle2 className="mx-auto h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="mx-auto h-4 w-4 text-destructive" />
                        )}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                        {r.success ? r.messageId : r.error}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
