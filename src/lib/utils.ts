import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { jwtDecode } from "jwt-decode";
import logger from "@/common/pino";
import { DecodedToken } from "@/types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const addDelay = async (delay: number) => {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((res) => setTimeout(res, delay));
};

export const isTokenValid = (token: string | null): boolean => {
  if (!token) {
    return false;
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds
    return decoded.exp > currentTime;
  } catch (error) {
    logger.error(error);
    return false;
  }
};
