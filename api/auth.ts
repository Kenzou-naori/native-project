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
    text2: message,
  });
};

export async function SignIn(email: string, password: string, navigation: any) {
  axios
    .post(baseUrl + "/v1/auth/login", {
      email,
      password,
    })
    .then(async (response: AxiosResponse<IAPIResponseLogin, any>) => {
      await storage.save({
        key: "token",
        data: response.data.data.token,
      });
      await storage.save({
        key: "user",
        data: JSON.stringify(response.data.data.user),
      });
      await storage.save({
        key: "isLoggedin",
        data: true,
      });

      if (await storage.load({ key: "isLoggedin" })) {
        const user = await storage.load({ key: "user" });
        if (JSON.parse(user).accessLevel === 1) {
          navigation.navigate("Admin");
        } else if (JSON.parse(user).accessLevel === 2) {
          navigation.navigate("HRD");
        } else {
          navigation.navigate("Home");
        }
      } else {
        navigation.navigate("Login");
      }
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
