import { BadRequestError } from "../responses/customApiError";

export const parseString = (param: any, fieldName: string): string => {
    if (!isString(param)) {
      throw new BadRequestError(`Invalid or missing ${fieldName}.`);
    }
  
    return param;
  };


export const isString = (string: string): boolean => {
    return typeof string === "string" && string.length >= 1;
  };

export const normalizeString = (field:string):string=>{
  return field.toLowerCase()
}