import { randomBytes } from "crypto";

export function generatePartnerIds(count: number): string[] {
  return Array.from({ length: count }, () => {
    const hex = randomBytes(4).toString("hex");
    return `partner_id_${hex}`;
  });
}
