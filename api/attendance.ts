import axios, { AxiosError, AxiosResponse } from "axios";
import storage from "../utils/storage";
import {
  baseUrl,
  capitalizeFirstLetter,
  errorResponse,
  showToast,
} from "./util";

export async function getAttendances(
  date: string,
): Promise<
  | AxiosResponse<IAPIResponseGetAttendances, any>
  | AxiosError<IAPIErrorResponse, any>
> {
  const token = await storage.load({ key: "token" });

  return axios
    .get(baseUrl + "/v1/users/@me/attendances", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(async (response: AxiosResponse<IAPIResponseGetAttendances, any>) => {
      const todayData = response.data.data.attendances.filter(
        (attendance) => attendance.date === date,
      );

      if (todayData.length > 0) {
        await storage.save({
          key: "attendance",
          data: JSON.stringify(todayData[0]),
        });
      } else {
        await storage.save({
          key: "attendance",
          data: null,
        });
      }

      response.data.data.attendances.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1;
        } else if (a.created_at < b.created_at) {
          return 1;
        } else {
          return 0;
        }
      });

      await storage.save({
        key: "attendances",
        data: JSON.stringify(response.data.data.attendances),
      });

      return response;
    })
    .catch((error) => {
      const errMessage: IAPIErrorResponse | undefined = error.response?.data;
      let message: string;
      if (errMessage?.message) {
        message = errMessage.message;
        showToast(capitalizeFirstLetter(message.replaceAll(":", ""))); // Call the toast function here
      }
      return error;
    });
}

export async function postAttendance(status: IAttendanceStatus) {
  const token = await storage.load({ key: "token" });

  const data = axios
    .post(
      baseUrl + "/v1/users/@me/attendances",
      {
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then(async (response: AxiosResponse<IAPIResponsePostAttendance, any>) => {
      await storage.save({
        key: "attendance",
        data: JSON.stringify(response.data.data.attendance),
      });

      return response.data.data.attendance;
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

      return showToast(capitalizeFirstLetter(message.replaceAll(":", "")));
    });

  return data;
}

export async function updateAttendance(attendanceId: string) {
  const token = await storage.load({ key: "token" });

  const data = axios
    .patch(`${baseUrl}/v1/users/@me/attendances/${attendanceId}`, undefined, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(async (response: AxiosResponse<IAPIResponsePostAttendance, any>) => {
      await storage.save({
        key: "attendance",
        data: JSON.stringify(response.data.data.attendance),
      });

      return response.data.data.attendance;
    })
    .catch((error) => {
      return errorResponse(error);
    });

  return data;
}
