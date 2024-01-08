import axios, { AxiosError, AxiosResponse } from "axios";
import storage from "../utils/storage";

export async function SignUp(email: string, password: string, fullName: string, phone: string, navigation: any) {
    axios.put("http://10.0.2.2:8080/v1/auth/register", {
        email,
        password,
        fullName,
        phone
    }).then((_: AxiosResponse<IAPIResponseRegister, any>) => {
        navigation.navigate("Login");
    }).catch((error: AxiosError) => {
        return errorResponse(error);
    });
}

export async function SignIn(email: string, password: string, navigation: any) {
    axios.post("http://10.0.2.2:8080/v1/auth/login", {
        email,
        password
    }).then(async (response: AxiosResponse<IAPIResponseLogin, any>) => {
        await storage.save({
            key: "token",
            data: response.data.data.token
        });
        await storage.save({
            key: "user",
            data: JSON.stringify(response.data.data.user)
        });
        await storage.save({
            key: "isLoggedin",
            data: true
        });

        if (await storage.load({ key: "isLoggedin" })) {
            navigation.navigate("Home");
        } else {
            navigation.navigate("Login");
        }
    }).catch((error: AxiosError) => {
        return errorResponse(error);
    });

    return new Error("Error");
}

function capitalizeFirstLetter(string: String) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function errorResponse(error: AxiosError) {
    console.log(error.response?.status.toString());
    let errorResp = (error.response?.data as { message?: string })["message"]?.split(";")[0].replaceAll(":", "");
    if (!errorResp) return new Error("Error");
    errorResp = capitalizeFirstLetter(errorResp);
    console.log(errorResp);
    return new Error(error.response?.status.toString());
}
