import axios, { AxiosError, AxiosResponse } from "axios";
import { baseUrl, errorResponse } from "./util";
import storage from "../utils/storage";
import Toast from "react-native-toast-message";

const showToast = (message: string) => {
  Toast.show({
    type: "error",
    text1: "Warning",
    onShow: () => console.log("toast visible"),
    onHide: () => console.log("toast hide"),
    visibilityTime: 5000,
    text2: message,
  });
};
export async function getCompany(): Promise<
  | AxiosResponse<IAPIResponseGetCompany, any>
  | AxiosError<IAPIErrorResponse, any>
> {
  const token = await storage.load({ key: "token" });

  return axios
    .get(baseUrl + "/v1/company", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(async (response: AxiosResponse<IAPIResponseGetCompany, any>) => {
      await storage.save({
        key: "ipAddresses",
        data: JSON.stringify(response.data.data.company.ipAddresses),
      });

      return response;
    })
    .catch((error) => {
      errorResponse(error);
      return error;
    });
}
