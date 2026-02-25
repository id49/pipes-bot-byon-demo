export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type CreateTokenResponse = {
  token: string;
};

export type Template = {
  name: string;
  language: string;
  status: string;
  category: string;
  id: string;
  components?: unknown[];
};

export type GetTemplatesResponse = {
  data: Template[];
};

export type SendMessageResponse = {
  messaging_product: string;
  contacts: { input: string; wa_id: string }[];
  messages: { id: string }[];
};
