"use server";

import { redirect } from "next/navigation";
import { getEnv } from "@/lib/env";
import { pipesApiFetch } from "@/lib/pipes-api";
import type { CreateTokenResponse } from "@/lib/types";

export async function startOnboarding(formData: FormData) {
  const partnerId = formData.get("partnerId") as string;
  if (!partnerId) {
    throw new Error("partnerId is required");
  }

  const { PIPES_APP_SLUG, PARTNER_REDIRECT_URL } = getEnv();

  const { token } = await pipesApiFetch<CreateTokenResponse>({
    path: "/v1/apps/token",
    method: "POST",
    body: {
      metadata: { partnerId },
      redirectUrl: PARTNER_REDIRECT_URL,
    },
  });

  redirect(
    `https://app.pipes.bot/apps/${PIPES_APP_SLUG}?token=${encodeURIComponent(token)}`
  );
}
