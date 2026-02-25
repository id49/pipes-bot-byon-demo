"use server";

import { pipesApiFetch } from "@/lib/pipes-api";
import type {
  ActionResult,
  GetTemplatesResponse,
  SendMessageResponse,
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
  languageCode: string
): Promise<ActionResult<SendMessageResponse>> {
  try {
    const data = await pipesApiFetch<SendMessageResponse>({
      path: "/v1/messages/passthrough",
      method: "POST",
      body: {
        poolNumberId,
        message: {
          messaging_product: "whatsapp",
          to,
          type: "template",
          template: {
            name: templateName,
            language: {
              code: languageCode,
            },
          },
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
