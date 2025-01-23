import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type PartiallyRequired<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};
