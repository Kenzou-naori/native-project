import { baseUrl, capitalizeFirstLetter, showToast } from "./util";

import storage from "../utils/storage";

import axios, { AxiosError, AxiosResponse } from "axios";

export async function GetPaidLeave(): Promise<
  | AxiosResponse<IAPIResponseGetPaidLeave, any>
  | AxiosError<IAPIErrorResponse, any>
> {
  return axios
    .get(baseUrl + "/v1/users/@me/paidLeave", {
      headers: {
        Authorization: `Bearer ${await storage.load({ key: "token" })}`,
      },
    })
    .then(async (response: AxiosResponse<IAPIResponseGetPaidLeave, any>) => {
      await storage.save({
        key: "paidLeave",
        data: response.data.data.paidLeave,
      });

      return response;
    })
    .catch(async (error: AxiosError<IAPIErrorResponse, any>) => {
      const errMessage: IAPIErrorResponse | undefined = error.response?.data;
      let message: string;
      if (errMessage?.message) {
        message = errMessage.message;
        showToast(capitalizeFirstLetter(message.replaceAll(":", ""))); // Call the toast function here
      }
      return error;
    });
}

export async function GetPaidLeaves(status: number | null = null): Promise<
  | AxiosResponse<IAPIResponseGetPaidLeaves, any>
  | AxiosError<IAPIErrorResponse, any>
> {
  return axios
    .get(`${baseUrl}/v1/users/@me/paidLeaves${status ? `?status=${status}` : "" }` , {
      headers: {
        Authorization: `Bearer ${await storage.load({ key: "token" })}`,
      },
    })
    .then(async (response: AxiosResponse<IAPIResponseGetPaidLeaves, any>) => {
      console.log(response.data.data);

      await storage.save({
        key: "paidLeaves",
        data: response.data.data.paidLeaves,
      });

      return response;
    })
    .catch(async (error: AxiosError<IAPIErrorResponse, any>) => {
      const errMessage: IAPIErrorResponse | undefined = error.response?.data;
      let message: string;
      if (errMessage?.message) {
        message = errMessage.message;
        showToast(capitalizeFirstLetter(message.replaceAll(":", ""))); // Call the toast function here
      }
      return error;
    });
}

export async function SendPaidLeave(
  data: IAPIPaidLeaveData,
): Promise<
  | AxiosResponse<IAPIResponsePostPaidLeave, any>
  | AxiosError<IAPIErrorResponse, any>
> {
  return axios
    .post(baseUrl + "/v1/users/@me/paidLeave", data, {
      headers: {
        Authorization: `Bearer ${await storage.load({ key: "token" })}`,
      },
    })
    .then(async (response: AxiosResponse<IAPIResponsePostPaidLeave, any>) => {
      await storage.save({
        key: "paidLeaves",
        data: JSON.stringify(response.data.data.paidLeave),
      });

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

      showToast(capitalizeFirstLetter(message.replaceAll(":", ""))); // Call the toast function here
      return error;
    });
}
