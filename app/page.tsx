import { generatePartnerIds } from "@/lib/partners";
import { startOnboarding } from "./actions";

export default function Home() {
  const partnerIds = generatePartnerIds(5);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="w-full max-w-lg px-6 py-16">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          BYON Demo
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Select a partner identity to begin WhatsApp Embedded Signup via
          Pipes.bot.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {partnerIds.map((id) => (
            <form key={id} action={startOnboarding}>
              <input type="hidden" name="partnerId" value={id} />
              <button
                type="submit"
                className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-left font-mono text-sm text-zinc-800 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
              >
                {id}
              </button>
            </form>
          ))}
        </div>
      </main>
    </div>
  );
}
