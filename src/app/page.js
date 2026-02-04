import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary"></div>
              <span className="text-xl font-bold text-card-foreground">
                LLM Guardrail Demo
              </span>
            </div>
            <Link
              href="/chat"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="px-6 py-20 text-center">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <span className="rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">
                Security Demo
              </span>
            </div>
            <h1 className="mb-6 text-5xl font-bold text-foreground">
              Secret Keeper Chatbot
              <span className="block text-primary">with LLM Guardrails</span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore an AI chatbot that protects a hidden secret using state-of-the-art security measures. 
              Test your prompt engineering skills against advanced guardrails designed to prevent unauthorized information extraction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/chat"
                className="rounded-lg bg-primary px-8 py-3 text-lg font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Start Chatting
              </Link>
              <a
                href="https://github.com/Frank2006x/llm_Guardrails"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-input bg-background px-8 py-3 text-lg font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                View Guardrails
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-16 bg-muted">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-3xl font-bold text-center text-foreground">
              What Makes This Demo Special?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="rounded-lg bg-card p-6 shadow-sm border border-border">
                <div className="mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <div className="h-6 w-6 rounded bg-primary/20 border-2 border-primary/40"></div>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                  Secret Protection
                </h3>
                <p className="text-muted-foreground">
                  The chatbot knows a hidden secret. Your challenge is to extract it through conversation 
                  while the AI tries to keep it safe.
                </p>
              </div>

              <div className="rounded-lg bg-card p-6 shadow-sm border border-border">
                <div className="mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-primary/30 border border-primary/50"></div>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                  Advanced Guardrails
                </h3>
                <p className="text-muted-foreground">
                  Powered by llm_guardrail package with multi-model detection for prompt injection, 
                  jailbreaks, and malicious content.
                </p>
              </div>

              <div className="rounded-lg bg-card p-6 shadow-sm border border-border">
                <div className="mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <div className="h-4 w-6 bg-primary/30 rounded-sm border border-primary/50"></div>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                  Your Own API Key
                </h3>
                <p className="text-muted-foreground">
                  Use your own Google Gemini API key for complete privacy and control. 
                  No server-side API keys exposed.
                </p>
              </div>

              <div className="rounded-lg bg-card p-6 shadow-sm border border-border">
                <div className="mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                  Real-time Protection
                </h3>
                <p className="text-muted-foreground">
                  Security checks run in under 10ms with detailed threat analysis and 
                  risk assessment for every message.
                </p>
              </div>

              <div className="rounded-lg bg-card p-6 shadow-sm border border-border">
                <div className="mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <div className="h-3 w-6 bg-primary/30 rounded-full relative"><div className="h-2 w-2 bg-primary rounded-full absolute right-0 top-0.5"></div></div>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                  Toggle Controls
                </h3>
                <p className="text-muted-foreground">
                  Enable or disable guardrails on-demand to see the difference in security 
                  protection and AI behavior.
                </p>
              </div>

              <div className="rounded-lg bg-card p-6 shadow-sm border border-border">
                <div className="mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <div className="h-6 w-6 border-2 border-primary/40 rounded"></div>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                  Modern Interface
                </h3>
                <p className="text-muted-foreground">
                  Beautiful dark mode interface with ElevenLabs conversation components 
                  and responsive design.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-3xl font-bold text-center text-foreground">
              How It Works
            </h2>
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0 h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Enter Your API Key
                  </h3>
                  <p className="text-muted-foreground">
                    Get a free API key from Google AI Studio and enter it securely. 
                    Your key is stored locally and never shared with our servers.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0 h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Try to Extract the Secret
                  </h3>
                  <p className="text-muted-foreground">
                    Chat with the AI and try different approaches to discover the hidden secret. 
                    Use direct questions, clever prompts, or social engineering techniques.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0 h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Watch Guardrails in Action
                  </h3>
                  <p className="text-muted-foreground">
                    Toggle guardrails on/off to see how advanced security measures detect and 
                    block malicious prompts, injections, and jailbreak attempts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-16 bg-primary">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-primary-foreground">
              Test Advanced AI Security Measures
            </h2>
            <p className="mb-8 text-xl text-primary-foreground/90">
              Evaluate the effectiveness of modern LLM security guardrails in a controlled environment 
              while attempting to extract protected information through various conversation techniques.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 text-lg font-medium text-primary hover:bg-gray-100 transition-colors"
            >
              Start the Challenge
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-6 py-8">
        <div className="mx-auto max-w-6xl text-center text-muted-foreground">
          <p>
            Built with{" "}
            <a 
              href="https://nextjs.org" 
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Next.js
            </a>
            {", "}
            <a 
              href="https://www.npmjs.com/package/llm_guardrail" 
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              LLM Guardrails
            </a>
            {", and "}
            <a 
              href="https://ai.google.dev/" 
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Gemini
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
