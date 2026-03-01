"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { getTemplates, sendTemplate, sendMessage } from "./actions";
import type { Template, SendTemplateComponent } from "@/lib/types";

type Tab = "templates" | "sendTemplate" | "sendMessage";

const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-500";

function getVariableCount(text: string | undefined): number {
  if (!text) return 0;
  const matches = text.match(/\{\{\d+\}\}/g);
  return matches ? matches.length : 0;
}

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
  const [languageCode, setLanguageCode] = useState("en_US");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [templateVars, setTemplateVars] = useState<
    Record<string, string[]>
  >({});
  const [templatesFetched, setTemplatesFetched] = useState(false);

  // Send Message fields
  const [msgTo, setMsgTo] = useState("");
  const [msgText, setMsgText] = useState("");

  function resetTemplateState() {
    setTemplates([]);
    setSelectedTemplate(null);
    setTemplateVars({});
    setTemplatesFetched(false);
  }

  function handleSelectTemplate(idx: number) {
    const tmpl = templates[idx];
    if (!tmpl) {
      setSelectedTemplate(null);
      setTemplateVars({});
      return;
    }
    setSelectedTemplate(tmpl);
    setLanguageCode(tmpl.language);

    const vars: Record<string, string[]> = {};
    for (const comp of tmpl.components ?? []) {
      if (comp.type === "HEADER" || comp.type === "BODY") {
        const count = getVariableCount(comp.text);
        if (count > 0) {
          vars[comp.type] = Array(count).fill("");
        }
      }
    }
    setTemplateVars(vars);
  }

  function handleFetchTemplates() {
    if (!poolNumberId.trim()) return;
    startTransition(async () => {
      const res = await getTemplates(poolNumberId);
      if (res.success) {
        setTemplates(res.data.data);
        setTemplatesFetched(true);
        setSelectedTemplate(null);
        setTemplateVars({});
        setResult(null);
      } else {
        setResult(res.error);
        setIsError(true);
      }
    });
  }

  function buildCurlExample(): string {
    if (!selectedTemplate) return "";
    const components = buildComponents();
    const body = {
      poolNumberId: poolNumberId || "<POOL_NUMBER_ID>",
      to: toNumber || "<TO_NUMBER>",
      type: "template",
      messaging_product: "whatsapp",
      template: {
        name: selectedTemplate.name,
        language: { code: languageCode },
        ...(components.length ? { components } : {}),
      },
    };
    const json = JSON.stringify(body, null, 2);
    return `curl -X POST https://api.pipes.bot/v1/messages/passthrough \\
  -H "Authorization: Bearer <YOUR_API_KEY>" \\
  -H "Content-Type: application/json" \\
  -d '${json}'`;
  }

  function buildComponents(): SendTemplateComponent[] {
    const components: SendTemplateComponent[] = [];
    for (const [compType, values] of Object.entries(templateVars)) {
      if (values.some((v) => v.length > 0)) {
        components.push({
          type: compType.toLowerCase() as "header" | "body",
          parameters: values.map((text) => ({ type: "text" as const, text })),
        });
      }
    }
    return components;
  }

  function handleSubmit() {
    if (!poolNumberId.trim()) return;

    startTransition(async () => {
      let res;
      switch (activeTab) {
        case "templates":
          res = await getTemplates(poolNumberId);
          break;
        case "sendTemplate": {
          if (!selectedTemplate) return;
          const components = buildComponents();
          res = await sendTemplate(
            poolNumberId,
            toNumber,
            selectedTemplate.name,
            languageCode,
            components.length ? components : undefined
          );
          break;
        }
        case "sendMessage":
          res = await sendMessage(poolNumberId, msgTo, msgText);
          break;
      }

      if (res) {
        if (res.success) {
          setResult(JSON.stringify(res.data, null, 2));
          setIsError(false);
        } else {
          setResult(res.error);
          setIsError(true);
        }
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
            onChange={(e) => {
              setPoolNumberId(e.target.value);
              resetTemplateState();
            }}
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
                className={inputClass}
              />

              {!templatesFetched ? (
                <button
                  onClick={handleFetchTemplates}
                  disabled={isPending || !poolNumberId.trim()}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                >
                  {isPending ? "Fetching..." : "Fetch Templates"}
                </button>
              ) : (
                <>
                  <select
                    value={
                      selectedTemplate
                        ? templates.indexOf(selectedTemplate).toString()
                        : ""
                    }
                    onChange={(e) => {
                      const idx = parseInt(e.target.value, 10);
                      handleSelectTemplate(idx);
                    }}
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select a template...
                    </option>
                    {templates.map((t, i) => (
                      <option key={t.id} value={i.toString()}>
                        {t.name} ({t.language}) — {t.status}
                      </option>
                    ))}
                  </select>

                  {selectedTemplate && (
                    <>
                      {/* Component preview */}
                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-900">
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          Template Preview
                        </p>
                        {(selectedTemplate.components ?? []).map((comp, i) => (
                          <div key={i} className="mt-1">
                            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                              {comp.type}
                              {comp.format ? ` (${comp.format})` : ""}:
                            </span>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">
                              {comp.text ?? "—"}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Variable inputs */}
                      {Object.entries(templateVars).map(
                        ([compType, values]) => (
                          <div key={compType} className="flex flex-col gap-2">
                            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                              {compType} Variables
                            </p>
                            {values.map((val, vi) => (
                              <input
                                key={vi}
                                type="text"
                                value={val}
                                onChange={(e) => {
                                  setTemplateVars((prev) => {
                                    const updated = { ...prev };
                                    updated[compType] = [...prev[compType]];
                                    updated[compType][vi] = e.target.value;
                                    return updated;
                                  });
                                }}
                                placeholder={`{{${vi + 1}}}`}
                                className={inputClass}
                              />
                            ))}
                          </div>
                        )
                      )}

                      <input
                        type="text"
                        value={languageCode}
                        onChange={(e) => setLanguageCode(e.target.value)}
                        placeholder="Language code (default: en_US)"
                        className={inputClass}
                      />

                      {/* Curl example */}
                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-900">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                            cURL Example
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              navigator.clipboard.writeText(buildCurlExample())
                            }
                            className="rounded px-2 py-0.5 text-xs text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                          >
                            Copy
                          </button>
                        </div>
                        <pre className="overflow-x-auto whitespace-pre-wrap break-all font-mono text-xs text-zinc-700 dark:text-zinc-300">
                          {buildCurlExample()}
                        </pre>
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}
          {activeTab === "sendMessage" && (
            <>
              <input
                type="text"
                value={msgTo}
                onChange={(e) => setMsgTo(e.target.value)}
                placeholder="To number (e.g. 15551234567)"
                className={inputClass}
              />
              <textarea
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                placeholder="Message text"
                rows={3}
                className={inputClass}
              />
            </>
          )}
        </div>

        {/* Submit */}
        {activeTab !== "sendTemplate" && (
          <button
            onClick={handleSubmit}
            disabled={isPending || !poolNumberId.trim()}
            className="mt-4 w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {isPending ? "Loading..." : "Submit"}
          </button>
        )}
        {activeTab === "sendTemplate" && templatesFetched && selectedTemplate && (
          <button
            onClick={handleSubmit}
            disabled={isPending || !poolNumberId.trim() || !toNumber.trim()}
            className="mt-4 w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {isPending ? "Sending..." : "Send Template"}
          </button>
        )}

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
