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

export async function GetUsers(): Promise<AxiosResponse<IAPIResponseGetUsers, any> | AxiosError<IAPIErrorResponse, any>> {
	return axios
		.get(baseUrl + "/v1/admin/users", {
			headers: {
				Authorization: `Bearer ${await storage.load({ key: "token" })}`
			}
		})
		.then(async (response: AxiosResponse<IAPIResponseGetUsers, any>) => {			
			await storage.save({
				key: "karyawan",
				data: JSON.stringify(response.data.data.users)
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

export async function GetAttendances(): Promise<
	AxiosResponse<IAPIResponseGetAttendances, any> | AxiosError<IAPIErrorResponse, any>
> {
	return axios
		.get(baseUrl + "/v1/admin/attendances", {
			headers: {
				Authorization: `Bearer ${await storage.load({ key: "token" })}`
			}
		})
		.then(async (response: AxiosResponse<IAPIResponseGetAttendancesWithUser, any>) => {
			response.data.data.attendances.sort((a: IAttendance, b: IAttendance) => {
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
				data: JSON.stringify(response.data.data.attendances)
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

export async function GetPaidLeaves(): Promise<
	AxiosResponse<IAPIResponseGetPaidLeaves, any> | AxiosError<IAPIErrorResponse, any>
> {
	return axios
		.get(baseUrl + "/v1/admin/paidLeaves", {
			headers: {
				Authorization: `Bearer ${await storage.load({ key: "token" })}`
			}
		})
		.then(async (response: AxiosResponse<IAPIResponseGetPaidLeaves, any>) => {
			await storage.save({
				key: "paidLeaves",
				data: JSON.stringify(response.data.data.paidLeaves)
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

export async function SetPaidLeaveStatus(
	pdId: string,
	status: string
): Promise<AxiosResponse<IAPIResponseGetPaidLeaves, any> | AxiosError<IAPIErrorResponse, any>> {
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
		.then(async (response: AxiosResponse<IAPIResponseGetPaidLeaves, any>) => {
			return response;
		})
		.catch((error: AxiosError<IAPIErrorResponse, any>) => {
			console.log(error.response?.data.message);

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
