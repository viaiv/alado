import { useState } from "react"
import { Key, Mail, Users, Rocket, Check } from "lucide-react"
import { Header } from "@/components/header"
import { AwsConfig } from "@/components/aws-config"
import { EmailConfig, type EmailData } from "@/components/email-config"
import { Recipients } from "@/components/recipients"
import { SendPanel } from "@/components/send-panel"
import type { AwsCredentials } from "@/lib/ses-client"

const STEPS = [
  { id: 0, label: "AWS", icon: Key },
  { id: 1, label: "Email", icon: Mail },
  { id: 2, label: "Destinatarios", icon: Users },
  { id: 3, label: "Enviar", icon: Rocket },
] as const

function App() {
  const [step, setStep] = useState(0)

  const [credentials, setCredentials] = useState<AwsCredentials>({
    accessKeyId: "",
    secretAccessKey: "",
    region: "us-east-1",
  })

  const [emailData, setEmailData] = useState<EmailData>({
    sender: "",
    subject: "",
    htmlBody: "",
    fileName: "",
  })

  const [recipientText, setRecipientText] = useState("")
  const [validEmails, setValidEmails] = useState<string[]>([])
  const [invalidEmails, setInvalidEmails] = useState<string[]>([])

  const handleParsed = (valid: string[], invalid: string[]) => {
    setValidEmails(valid)
    setInvalidEmails(invalid)
  }

  // Step completion checks
  const stepComplete = [
    Boolean(credentials.accessKeyId && credentials.secretAccessKey && credentials.region),
    Boolean(emailData.sender && emailData.subject && emailData.htmlBody),
    validEmails.length > 0,
    false, // send step is never "complete" as a prerequisite
  ]

  return (
    <div className="min-h-screen">
      <Header />

      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Stepper */}
        <nav className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              const isActive = step === s.id
              const isComplete = stepComplete[s.id]

              return (
                <div key={s.id} className="flex flex-1 items-center">
                  <button
                    onClick={() => setStep(s.id)}
                    className="group flex cursor-pointer flex-col items-center gap-2"
                  >
                    {/* Circle */}
                    <div
                      className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        isActive
                          ? "border-amber bg-amber/10 text-amber shadow-lg shadow-amber/20"
                          : isComplete
                            ? "border-amber/50 bg-amber/10 text-amber"
                            : "border-border bg-secondary text-muted-foreground group-hover:border-amber/30 group-hover:text-foreground"
                      }`}
                    >
                      {isComplete && !isActive ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                      {isActive && (
                        <div className="absolute inset-0 rounded-full bg-amber/20 animate-ping" style={{ animationDuration: '2s' }} />
                      )}
                    </div>
                    {/* Label */}
                    <span
                      className={`text-xs font-medium transition-colors ${
                        isActive
                          ? "text-amber"
                          : isComplete
                            ? "text-amber/80"
                            : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>

                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <div className="relative mx-2 mb-6 h-px flex-1">
                      <div className="absolute inset-0 bg-border" />
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber to-amber-dim transition-all duration-500"
                        style={{
                          width: stepComplete[s.id] ? "100%" : "0%",
                        }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </nav>

        {/* Step content */}
        <div key={step} className="animate-fade-in-up">
          {step === 0 && (
            <AwsConfig credentials={credentials} onChange={setCredentials} />
          )}

          {step === 1 && (
            <EmailConfig emailData={emailData} onChange={setEmailData} />
          )}

          {step === 2 && (
            <Recipients
              recipientText={recipientText}
              onTextChange={setRecipientText}
              validEmails={validEmails}
              invalidEmails={invalidEmails}
              onParsed={handleParsed}
            />
          )}

          {step === 3 && (
            <SendPanel
              credentials={credentials}
              sender={emailData.sender}
              subject={emailData.subject}
              htmlBody={emailData.htmlBody}
              recipients={validEmails}
            />
          )}
        </div>

        {/* Step navigation buttons */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-0"
          >
            &larr; Anterior
          </button>
          <div className="font-mono text-xs text-muted-foreground/40">
            {step + 1} / {STEPS.length}
          </div>
          <button
            onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}
            disabled={step === STEPS.length - 1}
            className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-0"
          >
            Proximo &rarr;
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
