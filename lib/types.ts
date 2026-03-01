export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type CreateTokenResponse = {
  token: string;
};

export type TemplateComponent = {
  type: "HEADER" | "BODY" | "FOOTER" | "BUTTONS";
  format?: string;
  text?: string;
};

export type TemplateParameter = {
  type: "text";
  text: string;
};

export type SendTemplateComponent = {
  type: "header" | "body";
  parameters: TemplateParameter[];
};

export type Template = {
  name: string;
  language: string;
  status: string;
  category: string;
  id: string;
  components?: TemplateComponent[];
};

export type GetTemplatesResponse = {
  data: Template[];
};

export type SendMessageResponse = {
  messaging_product: string;
  contacts: { input: string; wa_id: string }[];
  messages: { id: string }[];
};
