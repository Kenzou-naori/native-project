import axios, { AxiosError, AxiosResponse } from "axios";
import storage from "../utils/storage";
import { baseUrl, errorResponse } from "./util";

export async function getAttendances(date: string) {
	const token = await storage.load({ key: "token" });

	axios
		.get(baseUrl + "/v1/users/@me/attendances", {
			headers: {
				"Authorization": `Bearer ${token}`
			},
		})
		.then(async (response: AxiosResponse<IAPIResponseGetAttendances, any>) => {
			const todayData = response.data.data.attendances.filter(attendance => attendance.date === date);

			if (todayData.length > 0) {
				await storage.save({
					key: "attendance",
					data: JSON.stringify(todayData[0]),
				});
			} else {
				await storage.remove({ key: "attendance" });
				await storage.save({
					key: "attendance",
					data: null,
				});
			};

			response.data.data.attendances.sort((a, b) => {
				if (a.date > b.date) {
					return -1;
				} else if (a.date < b.date) {
					return 1;
				} else {
					return 0;
				}
			});

			await storage.save({
				key: "attendances",
				data: JSON.stringify(response.data.data.attendances),
			});

			return response.data.data.attendances;
		})
		.catch(error => {
			return errorResponse(error);
		});
}

export async function postAttendance(status: IAttendanceStatus) {
	const token = await storage.load({ key: "token" });

	const data = axios
		.post(
			baseUrl + "/v1/users/@me/attendances",
			{
				status
			},
			{
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		)
		.then(async (response: AxiosResponse<IAPIResponsePostAttendance, any>) => {
			await storage.save({
				key: "attendance",
				data: JSON.stringify(response.data.data.attendance)
			});

			return response.data.data.attendance;
		})
		.catch((error: AxiosError) => {
			return errorResponse(error);
		});

	return data;
}

export async function updateAttendance(attendanceId: string) {
	const token = await storage.load({ key: "token" });

	const data = axios
		.patch(`${baseUrl}/v1/users/@me/attendances/${attendanceId}`, undefined, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
		.then(async (response: AxiosResponse<IAPIResponsePostAttendance, any>) => {
			await storage.save({
				key: "attendance",
				data: JSON.stringify(response.data.data.attendance)
			});

			return response.data.data.attendance;
		})
		.catch(error => {
			return errorResponse(error);
		});

	return data;
}
