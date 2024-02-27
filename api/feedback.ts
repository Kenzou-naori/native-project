import { baseUrl } from "./util";

import storage from "../utils/storage";

import axios, { AxiosError, AxiosResponse } from "axios";

export async function postFeedback(content: string) {
  const token = await storage.load({ key: "token" });

  const data = axios
    .post(
      baseUrl + "/v1/users/@me/feedback",
      {
        content,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then(async (response: AxiosResponse<IAPIResponsePostFeedback, any>) => {
      return response;
    })
    .catch((error: AxiosError<IAPIErrorResponse, any>) => {
      const errMessage: string[] = error.response?.data.message!.split(";")!;
      let message: string = "";
      if (errMessage.length > 1) {
        for (let i = 0; i < errMessage.length; i++) {
          if (i === 0) {
            message += errMessage[i].replace("tidak boleh kosong", "");
          } else {
            message += "dan" + errMessage[i];
          }
        }
      } else {
        message = error.response?.data.message!.replace(":", "")!;
      }

      return error;
    });

  return data;
}
