// lib/utils/formatArray.ts
export const formatArrayCell = (data: string[] | string) => {
     const array = Array.isArray(data) ? data : String(data).split(",");
     return array.join(", ");
};