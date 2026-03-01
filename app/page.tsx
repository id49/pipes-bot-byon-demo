import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="w-full max-w-lg px-6 py-16">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          BYON Demo
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Bring Your Own Number — connect a WhatsApp number via Pipes.bot or
          manage existing connections.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/connect"
            className="rounded-lg border border-zinc-200 bg-white px-4 py-4 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
          >
            <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Connect a New Number
            </span>
            <span className="mt-1 block text-sm text-zinc-500 dark:text-zinc-400">
              Start WhatsApp Embedded Signup for a partner identity.
            </span>
          </Link>

          <Link
            href="/dashboard"
            className="rounded-lg border border-zinc-200 bg-white px-4 py-4 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
          >
            <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Dashboard
            </span>
            <span className="mt-1 block text-sm text-zinc-500 dark:text-zinc-400">
              Enter a pool number to view details and test APIs.
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}
