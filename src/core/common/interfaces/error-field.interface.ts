export interface ErrorField {
  field: string;
  error: string;
}

export type ErrorFields = ErrorField[];

export type ErrorFieldsMap = Record<string, ErrorFields>;
