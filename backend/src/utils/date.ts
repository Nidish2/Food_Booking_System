import { ApiError } from "./ApiError.js";
import { httpStatus } from "../constants/httpStatus.js";

export const toDateOnly = (value: string) => {
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid date format.");
  }
  return date;
};

export const getTodayUtc = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};

export const calculateNights = (checkInDate: Date, checkOutDate: Date) => {
  const diff = checkOutDate.getTime() - checkInDate.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
