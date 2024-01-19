import axios, { AxiosResponse } from "axios";
import { baseUrl, errorResponse } from "./util";
import storage from "../utils/storage";

export async function getCompany() {
	const token = await storage.load({ key: "token" });

	axios.get(baseUrl + "/v1/company", {
		headers: {
			Authorization: `Bearer ${token}`

		}
	})
		.then(async (response: AxiosResponse<IAPIResponseGetCompany, any>) => {
			await storage.save({
				key: "company",
				data: JSON.stringify(response.data.data.company)
			});

			return response.data.data.company;
		})
		.catch(error => {
			return errorResponse(error);
		});
};
