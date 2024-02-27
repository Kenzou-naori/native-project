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
import { LineChart, PieChart } from "react-native-chart-kit";

import { FAB } from "react-native-paper";
import { useColorScheme } from "nativewind";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import {
  faChevronRight,
  faCircleChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { showToast } from "../../api/util";

const UserScreen = ({ navigation }: any) => {
  const [fullName, setFullName] = useState("");
  const [email, setEMail] = useState("");
  const [phone, setPhone] = useState("");
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [openFeedback, setOpenFeedback] = useState(false);
  const [openStatistik, setOpenStatistik] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [title, setTitle] = useState("");
  const [totalPresent, setTotalPresent] = useState<number>(0);
  const [totalAbsent, setTotalAbsent] = useState<number>(0);
  const [chart, setChart] = useState<number>(1);

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

  
  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };
  const data = [
    {
      name: "Masuk",
      attendance: totalPresent,
      color: "rgb(0, 255, 146)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Tidak Masuk",
      attendance: totalAbsent,
      color: "rgb(242,69,69)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];


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
        {feedbackModal()}
        {profileModal()}
        {statistikModal()}
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
  function profileModal() {
    return (
      <Modal visible={openProfile} animationType="fade" transparent={true}>
        <View className=" bg-[#DEE9FD] dark:bg-[#212121] ">
          <View className="mt-6 h-full rounded-t-[50px] bg-[#f0fafd] p-5 dark:bg-[#3a3a3a]">
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="my-5 flex-col justify-center">
                <View className="flex-row items-center gap-3">
                  <TouchableOpacity onPress={() => setOpenProfile(false)}>
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
                  <Text className="text-center text-2xl font-bold text-gray-600 dark:text-neutral-300 ">
                    Profile
                  </Text>
                </View>
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
          </View>
        </View>
      </Modal>
    );
  }
  function statistikModal() {
    return (
      <Modal visible={openStatistik} animationType="fade" transparent={true}>
        <View className=" bg-[#DEE9FD] dark:bg-[#212121] ">
          <View className="mt-6 h-full rounded-t-[50px] bg-[#f0fafd] p-5 dark:bg-[#3a3a3a]">
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="my-5 flex-col justify-center">
                <View className="flex-row items-center gap-3">
                  <TouchableOpacity onPress={() => setOpenStatistik(false)}>
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
                  <Text className="text-center text-2xl font-bold text-gray-600 dark:text-neutral-300 ">
                    Profile
                  </Text>
                </View>
                <View className=" items-center justify-center">
            <PieChart
              data={data}
              width={420}
              height={220}
              chartConfig={chartConfig}
              accessor={"attendance"}
              backgroundColor={"transparent"}
              paddingLeft={"0"}
              absolute
              avoidFalseZero
            />
            <View className="flex-row flex-wrap gap-4">
              <TouchableOpacity
                className={
                  "rounded-md p-2 " +
                  (chart === 1 ? "bg-gray-500" : "bg-blue-500")
                }
                onPress={async () => {
                  const totalAttendances = await storage.load({
                    key: "totalAttendances",
                  });
                  const totalAttendancesData: TotalDataAttendance =
                    JSON.parse(totalAttendances);
                  setChart(1);
                  setTotalPresent(totalAttendancesData.monthly.present);
                  setTotalAbsent(totalAttendancesData.monthly.absent);
                }}
                disabled={chart === 1}
              >
                <Text className=" text-gray-200">Per Bulan</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={
                  "rounded-md p-2 " +
                  (chart === 0 ? "bg-gray-500" : "bg-blue-500")
                }
                onPress={async () => {
                  const totalAttendances = await storage.load({
                    key: "totalAttendances",
                  });
                  const totalAttendancesData: TotalDataAttendance =
                    JSON.parse(totalAttendances);
                  setChart(0);
                  setTotalPresent(totalAttendancesData.weekly.present);
                  setTotalAbsent(totalAttendancesData.weekly.absent);
                }}
                disabled={chart === 0}
              >
                <Text className=" text-gray-200">Per Minggu</Text>
              </TouchableOpacity>
            </View>
          </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }
};

export default UserScreen;
