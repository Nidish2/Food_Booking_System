import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",
  withCredentials: true,
});

export const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Network error. Please check your connection and try again.";
    }
    if (error.response.status === 429) {
      return "Too many requests. Please try again later.";
    }
    if (error.response.status === 500) {
      return "Internal server error. Please try again later.";
    }

    const details = error.response?.data?.details;
    if (details?.fieldErrors) {
      const messages: string[] = [];
      for (const key of Object.keys(details.fieldErrors)) {
        const errors = details.fieldErrors[key];
        if (Array.isArray(errors)) {
          messages.push(...errors);
        }
      }
      if (messages.length > 0) {
        return messages.join(" ");
      }
    }
    return error.response?.data?.message ?? "Request failed.";
  }
  return "Something went wrong.";
};
