import { errorResponse } from "./util";

import storage from "../utils/storage";

import axios, { AxiosResponse } from "axios";

export async function getSchedule(date: string) {
  const token = await storage.load({ key: "token" });

  axios
    .get(`https://api.tira.my.id/v1/users/@me/schedules`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(async (res: AxiosResponse<IAPIResponseGetSchedule, any>) => {
      const data = res.data.data.schedules;
      let result = data.filter((schedule: ISchedule) => {
        return schedule.date === date;
      });

      if (result.length === 0) {
        result = [];
      }

      await storage.save({
        key: "schedule",
        data: JSON.stringify(result),
      });
    })
    .catch((err) => {
      errorResponse(err);
    });
}

export async function postSchedule(data: IScheduleData) {
  const token = await storage.load({ key: "token" });

  axios
    .post("https://api.tira.my.id/v1/users/@me/schedules", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(async () => {
      await getSchedule(data.date);
    })
    .catch((err) => {
      errorResponse(err);
    });
}
