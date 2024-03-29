import { AxiosError } from "axios";

import Toast from "react-native-toast-message";

export const baseUrl = "https://api.tira.my.id";

export function errorResponse(error: AxiosError) {
  if (error.response) {
    return error.response.data;
  } else if (error.request) {
    return error.request;
  } else {
    return error.message;
  }
}

export function capitalizeFirstLetter(string: String) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatDate(date: string): string {
  const parts = date.split("-");
  const formattedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);

  let options: Intl.DateTimeFormatOptions = {
    weekday: "long", // or 'short', 'narrow'
    year: "numeric",
    month: "short", // or 'short', 'narrow', '2-digit', 'numeric'
    day: "numeric", // or '2-digit'
  };

  const formatter = new Intl.DateTimeFormat("id-ID", options);

  return formatter.format(formattedDate);
}

export function formatISODate(timestamp: string) {
  const date: Date = new Date(timestamp);

  let options: Intl.DateTimeFormatOptions = {
    weekday: "long", // or 'short', 'narrow'
    year: "numeric",
    month: "short", // or 'short', 'narrow', '2-digit', 'numeric'
    day: "numeric", // or '2-digit'
  };

  const formatter = new Intl.DateTimeFormat("id-ID", options);

  return formatter.format(date);
}

export function showToast(message: string) {
  Toast.show({
    type: "error",
    text1: "Warning",
    onShow: () => console.log("toast visible"),
    onHide: () => console.log("toast hide"),
    visibilityTime: 5000,
    text2: message,
  });
}
