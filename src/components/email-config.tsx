import { useRef } from "react"
import { Upload, Mail, FileText, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export interface EmailData {
  sender: string
  subject: string
  htmlBody: string
  fileName: string
}

interface EmailConfigProps {
  emailData: EmailData
  onChange: (data: EmailData) => void
}

export function EmailConfig({ emailData, onChange }: EmailConfigProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      const content = ev.target?.result as string
      onChange({ ...emailData, htmlBody: content, fileName: file.name })
    }
    reader.readAsText(file)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-amber" />
          Configuracao do Email
        </CardTitle>
        <CardDescription>
          Defina o remetente, assunto e conteudo HTML
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="sender">Remetente (From)</Label>
          <Input
            id="sender"
            type="email"
            placeholder="noreply@seudominio.com"
            value={emailData.sender}
            onChange={(e) =>
              onChange({ ...emailData, sender: e.target.value })
            }
          />
          <p className="text-xs text-muted-foreground/70">
            Deve ser um email verificado no AWS SES
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Assunto</Label>
          <Input
            id="subject"
            placeholder="Assunto do email"
            value={emailData.subject}
            onChange={(e) =>
              onChange({ ...emailData, subject: e.target.value })
            }
          />
        </div>

        <div className="space-y-3">
          <Label>Conteudo HTML</Label>

          {/* Upload zone */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group flex w-full cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border/60 bg-secondary/30 px-6 py-8 transition-all duration-200 hover:border-amber/40 hover:bg-amber/5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary transition-colors group-hover:bg-amber/10">
              <Upload className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-amber" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground/80">
                Clique para fazer upload do HTML
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Aceita arquivos .html e .htm
              </p>
            </div>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".html,.htm"
            onChange={handleFileUpload}
            className="hidden"
          />

          {emailData.fileName && (
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-amber" />
              <Badge variant="default">{emailData.fileName}</Badge>
            </div>
          )}
        </div>

        {emailData.htmlBody && (
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Eye className="h-3 w-3" />
              Preview
            </Label>
            <div className="overflow-hidden rounded-lg border border-border/60 bg-white">
              <iframe
                sandbox=""
                srcDoc={emailData.htmlBody}
                className="h-72 w-full"
                title="Preview do email"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
