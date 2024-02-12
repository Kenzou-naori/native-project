import axios, { AxiosError, AxiosResponse } from "axios";
import Toast from "react-native-toast-message";

import storage from "../utils/storage";
import { baseUrl, capitalizeFirstLetter } from "./util";

const showToast = (message: string) => {
	Toast.show({
		type: "error",
		text1: "Warning",
		onShow: () => console.log("toast visible"),
		onHide: () => console.log("toast hide"),
		visibilityTime: 5000,
		text2: message
	});
};

export async function GetUsers(
	page: number = 1
): Promise<AxiosResponse<IAPIResponseGetUsers, any> | AxiosError<IAPIErrorResponse, any>> {
	return axios
		.get(baseUrl + "/v1/admin/users?page=" + page, {
			headers: {
				Authorization: `Bearer ${await storage.load({ key: "token" })}`
			}
		})
		.then(async (response: AxiosResponse<IAPIResponseGetUsers, any>) => {
			await storage.save({
				key: "karyawan",
				data: JSON.stringify(response.data.data.users)
			});
			await storage.save({
				key: "totalKaryawan",
				data: String(response.data.data.total)
			});

			return response;
		})
		.catch((error: AxiosError<IAPIErrorResponse, any>) => {
			const errMessage: IAPIErrorResponse | undefined = error.response?.data;
			let message: string;
			if (errMessage?.message) {
				message = errMessage.message;
				showToast(capitalizeFirstLetter(message.replaceAll(":", ""))); // Call the toast function here
			}
			return error;
		});
}

export async function GetUser(id: string): Promise<AxiosResponse<IAPIResponseGetUser, any> | AxiosError<IAPIErrorResponse, any>> {
	return axios
		.get(baseUrl + `/v1/users/${id}`, {
			headers: {
				Authorization: `Bearer ${await storage.load({ key: "token" })}`
			}
		})
		.then(async (response: AxiosResponse<IAPIResponseGetUser, any>) => {
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

export async function GetAttendances(
	page: number = 1
): Promise<AxiosResponse<IAPIResponseGetAttendancesWithUser, any> | AxiosError<IAPIErrorResponse, any>> {
	return axios
		.get(baseUrl + "/v1/admin/attendances?page=" + page, {
			headers: {
				Authorization: `Bearer ${await storage.load({ key: "token" })}`
			}
		})
		.then(async (response: AxiosResponse<IAPIResponseGetAttendancesWithUser, any>) => {
			await storage.save({
				key: "attendances",
				data: JSON.stringify(response.data.data.attendances)
			});

			await storage.save({
				key: "totalAttendances",
				data: JSON.stringify(response.data.data.totals)
			});

			return response;
		})
		.catch((error: AxiosError<IAPIErrorResponse, any>) => {
			const errMessage: IAPIErrorResponse | undefined = error.response?.data;
			let message: string;
			if (errMessage?.message) {
				message = errMessage.message;
				showToast(capitalizeFirstLetter(message.replaceAll(":", ""))); // Call the toast function here
			}
			return error;
		});
}

export async function CreateUser(
	data: IUserData
): Promise<AxiosResponse<IAPIResponseCreateUser, any> | AxiosError<IAPIErrorResponse, any>> {
	return axios
		.put(baseUrl + "/v1/admin/users", data, {
			headers: {
				Authorization: `Bearer ${await storage.load({ key: "token" })}`
			}
		})
		.then(async (response: AxiosResponse<IAPIResponseCreateUser, any>) => {
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

export async function UpdateUser(
	id: string,
	data: IUserData
): Promise<AxiosResponse<IAPIResponseUpdateUser, any> | AxiosError<IAPIErrorResponse, any>> {
	return axios
		.patch(baseUrl + `/v1/admin/users/${id}`, data, {
			headers: {
				Authorization: `Bearer ${await storage.load({ key: "token" })}`
			}
		})
		.then(async (response: AxiosResponse<IAPIResponseUpdateUser, any>) => {
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

export async function DeleteUser(
	id: string
): Promise<AxiosResponse<IAPIResponseDeleteUser, any> | AxiosError<IAPIErrorResponse, any>> {
	return axios
		.delete(baseUrl + `/v1/admin/users/${id}`, {
			headers: {
				Authorization: `Bearer ${await storage.load({ key: "token" })}`
			}
		})
		.then(async (response: AxiosResponse<IAPIResponseDeleteUser, any>) => {
			await storage.save({
				key: "karyawan",
				data: JSON.stringify(response.data.data.users)
			});

			return response;
		})
		.catch((error: AxiosError<IAPIErrorResponse, any>) => {
			const errMessage: IAPIErrorResponse | undefined = error.response?.data;
			let message: string;
			if (errMessage?.message) {
				message = errMessage.message;
				showToast(capitalizeFirstLetter(message.replaceAll(":", ""))); // Call the toast function here
			}
			return error;
		});
}

export async function GetPaidLeaves(
	page: number = 1
): Promise<AxiosResponse<IAPIResponseGetPaidLeavesWithUser, any> | AxiosError<IAPIErrorResponse, any>> {
	return axios
		.get(baseUrl + "/v1/admin/paidLeaves?page=" + page, {
			headers: {
				Authorization: `Bearer ${await storage.load({ key: "token" })}`
			}
		})
		.then(async (response: AxiosResponse<IAPIResponseGetPaidLeavesWithUser, any>) => {
			await storage.save({
				key: "paidLeaves",
				data: JSON.stringify(response.data.data.paidLeaves)
			});
			await storage.save({
				key: "totalPaidLeaves",
				data: response.data.data.total
			});

			return response;
		})
		.catch((error: AxiosError<IAPIErrorResponse, any>) => {
			const errMessage: IAPIErrorResponse | undefined = error.response?.data;
			let message: string;
			if (errMessage?.message) {
				message = errMessage.message;
				showToast(capitalizeFirstLetter(message.replaceAll(":", ""))); // Call the toast function here
			}
			return error;
		});
}

export async function SetPaidLeaveStatus(
	pdId: string,
	status: string
): Promise<AxiosResponse<IAPIResponseGetPaidLeavesWithUser, any> | AxiosError<IAPIErrorResponse, any>> {
	return axios
		.patch(
			baseUrl + `/v1/admin/paidLeaves/${pdId}`,
			{ status },
			{
				headers: {
					Authorization: `Bearer ${await storage.load({ key: "token" })}`
				}
			}
		)
		.then(async (response: AxiosResponse<IAPIResponseGetPaidLeavesWithUser, any>) => {
			return response;
		})
		.catch((error: AxiosError<IAPIErrorResponse, any>) => {
			const errMessage: IAPIErrorResponse | undefined = error.response?.data;
			let message: string;
			if (errMessage?.message) {
				message = errMessage.message;
				showToast(capitalizeFirstLetter(message.replaceAll(":", ""))); // Call the toast function here
			}
			return error;
		});
}
