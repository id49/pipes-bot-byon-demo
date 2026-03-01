"use server";

import { pipesApiFetch } from "@/lib/pipes-api";
import type {
  ActionResult,
  GetTemplatesResponse,
  SendMessageResponse,
  SendTemplateComponent,
} from "@/lib/types";

export async function getTemplates(
  poolNumberId: string
): Promise<ActionResult<GetTemplatesResponse>> {
  try {
    const data = await pipesApiFetch<GetTemplatesResponse>({
      path: `/v1/pool-numbers/${encodeURIComponent(poolNumberId)}/templates`,
    });
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function sendTemplate(
  poolNumberId: string,
  to: string,
  templateName: string,
  languageCode: string,
  components?: SendTemplateComponent[]
): Promise<ActionResult<SendMessageResponse>> {
  try {
    const data = await pipesApiFetch<SendMessageResponse>({
      path: "/v1/messages/passthrough",
      method: "POST",
      body: {
        poolNumberId,
        to,
        type: "template",
        messaging_product: "whatsapp",
        template: {
          name: templateName,
          language: {
            code: languageCode,
          },
          ...(components?.length ? { components } : {}),
        },
      },
    });
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function sendPassthrough(
  body: Record<string, unknown>
): Promise<ActionResult<SendMessageResponse>> {
  try {
    const data = await pipesApiFetch<SendMessageResponse>({
      path: "/v1/messages/passthrough",
      method: "POST",
      body,
    });
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function sendMessage(
  poolNumberId: string,
  toNumber: string,
  text: string
): Promise<ActionResult<SendMessageResponse>> {
  try {
    const data = await pipesApiFetch<SendMessageResponse>({
      path: "/v1/messages/app/send",
      method: "POST",
      body: {
        poolNumberId,
        toNumber,
        text,
      },
    });
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
