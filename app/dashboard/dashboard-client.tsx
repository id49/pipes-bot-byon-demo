"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { getTemplates, sendTemplate, sendMessage } from "./actions";

type Tab = "templates" | "sendTemplate" | "sendMessage";

export default function DashboardClient() {
  const searchParams = useSearchParams();
  const [poolNumberId, setPoolNumberId] = useState(
    searchParams.get("poolNumberId") ?? ""
  );
  const [activeTab, setActiveTab] = useState<Tab>("templates");
  const [result, setResult] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Send Template fields
  const [toNumber, setToNumber] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [languageCode, setLanguageCode] = useState("en_US");

  // Send Message fields
  const [msgTo, setMsgTo] = useState("");
  const [msgText, setMsgText] = useState("");

  function handleSubmit() {
    if (!poolNumberId.trim()) return;

    startTransition(async () => {
      let res;
      switch (activeTab) {
        case "templates":
          res = await getTemplates(poolNumberId);
          break;
        case "sendTemplate":
          res = await sendTemplate(
            poolNumberId,
            toNumber,
            templateName,
            languageCode
          );
          break;
        case "sendMessage":
          res = await sendMessage(poolNumberId, msgTo, msgText);
          break;
      }

      if (res.success) {
        setResult(JSON.stringify(res.data, null, 2));
        setIsError(false);
      } else {
        setResult(res.error);
        setIsError(true);
      }
    });
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "templates", label: "Get Templates" },
    { key: "sendTemplate", label: "Send Template" },
    { key: "sendMessage", label: "Send Message" },
  ];

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <div className="w-full max-w-2xl px-6 py-16">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          BYON Dashboard
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Test BYON API endpoints against your pool number.
        </p>

        {/* Pool Number ID */}
        <div className="mt-8">
          <label
            htmlFor="poolNumberId"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Pool Number ID
          </label>
          <input
            id="poolNumberId"
            type="text"
            value={poolNumberId}
            onChange={(e) => setPoolNumberId(e.target.value)}
            placeholder="pn_..."
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-500"
          />
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab-specific fields */}
        <div className="mt-4 flex flex-col gap-3">
          {activeTab === "sendTemplate" && (
            <>
              <input
                type="text"
                value={toNumber}
                onChange={(e) => setToNumber(e.target.value)}
                placeholder="To number (e.g. 15551234567)"
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-500"
              />
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Template name (e.g. hello_world)"
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-500"
              />
              <input
                type="text"
                value={languageCode}
                onChange={(e) => setLanguageCode(e.target.value)}
                placeholder="Language code (default: en_US)"
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-500"
              />
            </>
          )}
          {activeTab === "sendMessage" && (
            <>
              <input
                type="text"
                value={msgTo}
                onChange={(e) => setMsgTo(e.target.value)}
                placeholder="To number (e.g. 15551234567)"
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-500"
              />
              <textarea
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                placeholder="Message text"
                rows={3}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-500"
              />
            </>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isPending || !poolNumberId.trim()}
          className="mt-4 w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {isPending ? "Loading..." : "Submit"}
        </button>

        {/* Result */}
        {result !== null && (
          <div className="mt-6">
            <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Result
            </h2>
            <pre
              className={`mt-2 max-h-96 overflow-auto rounded-lg border p-4 font-mono text-xs ${
                isError
                  ? "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
                  : "border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              }`}
            >
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
