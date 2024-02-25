import storage from "../../utils/storage";

import {
  Text,
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useEffect, useState } from "react";
import { FAB } from "react-native-paper";
import { useColorScheme } from "nativewind";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Toast from "react-native-toast-message";

import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { showToast } from "../../api/util";

const ProfileScreen = ({ navigation }: any) => {
  const [fullName, setFullName] = useState("");
  const [email, setEMail] = useState("");
  const [phone, setPhone] = useState("");
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [openFeedback, setOpenFeedback] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const getUserData = async () => {
      const dataString = await storage.load({ key: "user" });
      const data = JSON.parse(dataString);
      setEMail(data.email);
      setFullName(data.fullName);
      setPhone(data.phone);
    };

    getUserData();
  }, []);

  return (
    <View className="mt-6 bg-[#DEE9FD] dark:bg-[#212121] ">
      <View className="mt-6 h-full rounded-t-[50px] bg-[#f0fafd] p-5 dark:bg-[#3a3a3a]">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="my-5 flex-col justify-center">
            <Text className="text-center text-2xl font-bold text-gray-600 dark:text-neutral-300 ">
              Profile
            </Text>
            <View className="mt-4">
              <Text className="text-md text-gray-500 dark:text-neutral-300">
                Nama Lengkap
              </Text>
              <Text className="border-b-2 border-b-gray-500 py-2 text-xl dark:text-neutral-300 ">
                {fullName}
              </Text>
            </View>
            <View className="mt-4">
              <Text className="text-md text-gray-500  dark:text-neutral-300">
                Alamat Email
              </Text>
              <Text className="border-b-2 border-b-gray-500 py-2 text-xl dark:text-neutral-300 ">
                {email}
              </Text>
            </View>
            <View className="mt-4">
              <Text className="text-md text-gray-500  dark:text-neutral-300">
                Nomor Telepon
              </Text>
              <Text className="border-b-2 border-b-gray-500 py-2 text-xl dark:text-neutral-300 ">
                {phone}
              </Text>
            </View>
          </View>
        </ScrollView>
        {feedbackModal()}
      </View>

      <FAB
        icon="bug"
        label="Pengaduan Bug"
        color={
          colorScheme === "dark"
            ? "#DEE9FD"
            : colorScheme == "light"
              ? "#212121"
              : "DEE9FD"
        }
        className={
          colorScheme === "dark"
            ? "absolute bottom-[11%]  right-[5%] rounded-full   bg-[#212121] text-white"
            : colorScheme == "light"
              ? "py absolute  bottom-[11%] right-[5%] rounded-full bg-[#DEE9FD] text-gray-800"
              : "absolute bottom-[11%]  right-[5%] rounded-full   bg-[#212121] text-white"
        }
        onPress={() => setOpenFeedback(true)}
      />
    </View>
  );
  function feedbackModal() { 
    return (
      <Modal visible={openFeedback} animationType="fade" transparent={true}>
        <View className="h-full rounded-[20px] bg-[#f0fafd] p-5 dark:bg-[#3a3a3a]">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => setOpenFeedback(false)}>
              <FontAwesomeIcon
                icon={faCircleChevronLeft}
                size={25}
                color={
                  colorScheme === "dark"
                    ? "#DEE9FD"
                    : colorScheme == "light"
                      ? "#212121"
                      : "DEE9FD"
                }
              />
            </TouchableOpacity>
            <Text className="text-2xl font-bold  text-gray-600 dark:text-neutral-300">
              FeedBack
            </Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="my-5 flex-col items-center justify-center">
              <Text className="text-xl font-semibold text-gray-600 dark:text-neutral-300">
                Pada halaman ini anda bisa melaporkan bug kesalahan fitur yang
                terjadi.
              </Text>
              {/* <Text className="text-2xl font-bold">Riwayat Presensi</Text> */}
              <View className="mt-4 w-full">
                <Text className="text-md font-bold text-gray-600 dark:text-neutral-300">
                  Cantumkan Pengaduan
                </Text>
                <TextInput
                  multiline={true}
                  numberOfLines={4}
                  className="border-2 border-gray-500 px-2 py-3 text-lg text-gray-600 dark:text-neutral-300"
                  keyboardType="default"
                  onChangeText={(text) => setTitle(text)}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={async () => {
                if (title === "") {
                  showToast("Pengaduan tidak boleh kosong");
                  return;
                }

                setOpenFeedback(false);
              }}
            >
              <View className="mt-6 rounded-full bg-[#DEE9FD] dark:bg-[#212121]">
                <Text className="px-3 py-2 text-center text-xl font-semibold  text-gray-600 dark:text-neutral-300">
                  Kirim
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    );
  }
};

export default ProfileScreen;
