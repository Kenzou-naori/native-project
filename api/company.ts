import axios, { AxiosError, AxiosResponse } from "axios";
import { baseUrl, errorResponse } from "./util";
import storage from "../utils/storage";

export async function getCompany(): Promise<AxiosResponse<IAPIResponseGetCompany, any> | AxiosError<IAPIErrorResponse, any>>{
	const token = await storage.load({ key: "token" });

	return axios.get(baseUrl + "/v1/company", {
		headers: {
			Authorization: `Bearer ${token}`

		}
	})
		.then(async (response: AxiosResponse<IAPIResponseGetCompany, any>) => {
			await storage.save({
				key: "company",
				data: JSON.stringify(response.data.data.company)
			});

			return response;
		})
		.catch(error => {
			errorResponse(error);
			return error;
		});
};
