import Auth from "./auth/Auth";
import { NativeWindStyleSheet } from "nativewind";

NativeWindStyleSheet.setOutput({
	default: "native"
});

export default function App() {
	return <Auth />;
}
