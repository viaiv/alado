import { useState } from "react"
import { Eye, EyeOff, Shield, Key, Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { AwsCredentials } from "@/lib/ses-client"
import { SES_REGIONS } from "@/lib/ses-client"

interface AwsConfigProps {
  credentials: AwsCredentials
  onChange: (credentials: AwsCredentials) => void
}

export function AwsConfig({ credentials, onChange }: AwsConfigProps) {
  const [showSecret, setShowSecret] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-4 w-4 text-amber" />
          Credenciais AWS
        </CardTitle>
        <CardDescription>
          Informe suas credenciais de acesso ao AWS SES
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Suas credenciais ficam apenas na memoria do navegador e nao sao
            armazenadas em nenhum lugar. Ao fechar o app, tudo e apagado.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="access-key">Access Key ID</Label>
          <Input
            id="access-key"
            placeholder="AKIAIOSFODNN7EXAMPLE"
            value={credentials.accessKeyId}
            onChange={(e) =>
              onChange({ ...credentials, accessKeyId: e.target.value })
            }
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="secret-key">Secret Access Key</Label>
          <div className="relative">
            <Input
              id="secret-key"
              type={showSecret ? "text" : "password"}
              placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
              value={credentials.secretAccessKey}
              onChange={(e) =>
                onChange({ ...credentials, secretAccessKey: e.target.value })
              }
              className="pr-10 font-mono text-sm"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-foreground"
              onClick={() => setShowSecret(!showSecret)}
            >
              {showSecret ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="region" className="flex items-center gap-1.5">
            <Globe className="h-3 w-3" />
            Regiao
          </Label>
          <select
            id="region"
            value={credentials.region}
            onChange={(e) =>
              onChange({ ...credentials, region: e.target.value })
            }
            className="flex h-10 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm text-foreground font-mono transition-colors duration-200 focus-visible:outline-none focus-visible:border-amber/50 focus-visible:ring-2 focus-visible:ring-amber/20"
          >
            {SES_REGIONS.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
      </CardContent>
    </Card>
  )
}
