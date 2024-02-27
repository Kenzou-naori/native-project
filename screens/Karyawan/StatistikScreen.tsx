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

import {
  faChevronRight,
  faCircleChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { showToast } from "../../api/util";

const StatistikScreen= ({ navigation }: any) => {
  const [fullName, setFullName] = useState("");
  const [email, setEMail] = useState("");
  const [phone, setPhone] = useState("");
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [openFeedback, setOpenFeedback] = useState(false);
  const [openStatistik, setOpenStatistik] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
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
            <Text className="text-2xl font-bold text-gray-600 dark:text-neutral-300 ">
              {fullName}
            </Text>
            <Text className="font-semi-bold text-xl text-gray-600 dark:text-neutral-300 ">
              {phone}
            </Text>
            <View className="my-4 flex flex-col rounded-xl border border-[#ccc] bg-[#DEE9FD] p-[20] dark:bg-[#212121]">
              <TouchableOpacity
                onPress={() => setOpenProfile(true)}
                className="my-4"
              >
                <View className="w-full flex-row items-center justify-between border-b border-b-gray-600 py-2 dark:border-b-neutral-300">
                  <Text className="text-xl font-bold text-gray-600 dark:text-neutral-300">
                    Profile
                  </Text>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    size={14}
                    color={
                      colorScheme === "dark"
                        ? "#DEE9FD"
                        : colorScheme == "light"
                          ? "#212121"
                          : "DEE9FD"
                    }
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setOpenStatistik(true)}
                className="my-4"
              >
                <View className="w-full flex-row items-center justify-between border-b border-b-gray-600 py-2 dark:border-b-neutral-300">
                  <Text className="text-xl font-bold text-gray-600 dark:text-neutral-300">
                    Statistik Karyawan
                  </Text>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    size={14}
                    color={
                      colorScheme === "dark"
                        ? "#DEE9FD"
                        : colorScheme == "light"
                          ? "#212121"
                          : "DEE9FD"
                    }
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
}

export default StatistikScreen;