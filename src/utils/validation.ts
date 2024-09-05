import { BadRequestError } from "../responses/customApiError";

export const parseString = (param: any, fieldName: string): string => {
  if (!isString(param)) {
    throw new BadRequestError(`Invalid or missing ${fieldName}.`);
  }

  return param;
};

export const parseInteger = (param: string, fieldName: string): number => {
  const id = parseInt(param);
  if (!isInteger(id) || param.length <= 0) {
    throw new BadRequestError(`Invalid or missing ${fieldName}`);
  }
  return id;
};

export const isString = (string: string): boolean => {
  return typeof string === "string" && string.length >= 1;
};

export const isInteger = (num: number): boolean => {
  return typeof num === "number" && Number.isInteger(num);
};

export const normalizeString = (field: string): string => {
  return field.toLowerCase();
};
