import { useRef } from "react"
import { Upload, AlertCircle, Users, ChevronDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { parseRecipients, parseFileContent } from "@/lib/parse-recipients"

interface RecipientsProps {
  recipientText: string
  onTextChange: (text: string) => void
  validEmails: string[]
  invalidEmails: string[]
  onParsed: (valid: string[], invalid: string[]) => void
}

export function Recipients({
  recipientText,
  onTextChange,
  validEmails,
  invalidEmails,
  onParsed,
}: RecipientsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleTextChange = (text: string) => {
    onTextChange(text)
    const result = parseRecipients(text)
    onParsed(result.valid, result.invalid)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      const content = ev.target?.result as string
      const combined = recipientText ? recipientText + "\n" + content : content
      onTextChange(combined)
      const result = parseFileContent(combined)
      onParsed(result.valid, result.invalid)
    }
    reader.readAsText(file)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-4 w-4 text-amber" />
          Destinatarios
        </CardTitle>
        <CardDescription>
          Adicione os emails dos destinatarios
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="recipients">Lista de emails</Label>
          <Textarea
            id="recipients"
            placeholder={"email1@exemplo.com\nemail2@exemplo.com\nemail3@exemplo.com"}
            rows={7}
            value={recipientText}
            onChange={(e) => handleTextChange(e.target.value)}
            className="font-mono text-xs leading-relaxed"
          />
          <p className="text-xs text-muted-foreground/70">
            Separe por virgula, ponto e virgula ou quebra de linha
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Importar CSV / TXT
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Stats bar */}
        {(validEmails.length > 0 || invalidEmails.length > 0) && (
          <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-secondary/30 px-4 py-3">
            <Badge variant="success">
              {validEmails.length} validos
            </Badge>
            {invalidEmails.length > 0 && (
              <Badge variant="destructive">
                {invalidEmails.length} invalidos
              </Badge>
            )}
            <span className="ml-auto font-mono text-xs text-muted-foreground">
              {validEmails.length + invalidEmails.length} total
            </span>
          </div>
        )}

        {invalidEmails.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Emails invalidos</AlertTitle>
            <AlertDescription>
              <ul className="mt-1 list-none space-y-0.5 font-mono text-xs">
                {invalidEmails.map((email, i) => (
                  <li key={i} className="opacity-80">{email}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {validEmails.length > 0 && (
          <details className="group">
            <summary className="flex cursor-pointer items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground">
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
              Ver emails validos ({validEmails.length})
            </summary>
            <div className="mt-3 max-h-44 overflow-y-auto rounded-lg border border-border/40 bg-background/50 p-3 font-mono text-xs leading-relaxed text-muted-foreground">
              {validEmails.map((email, i) => (
                <div key={i} className="py-0.5 transition-colors hover:text-foreground">
                  {email}
                </div>
              ))}
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  )
}
