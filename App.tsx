import Auth from "./auth/Auth"
import Toast from 'react-native-toast-message';
import { NativeWindStyleSheet } from "nativewind";


NativeWindStyleSheet.setOutput({
  default: "native",
});


export default function App() { 
  return(
    <Auth />
  )
}