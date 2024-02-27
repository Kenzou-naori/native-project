import { capitalizeFirstLetter, formatDate } from "../../api/util";
import { getAttendances } from "../../api/attendance";
import { getCompany } from "../../api/company";
import storage from "../../utils/storage";

import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useColorScheme } from "nativewind";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AxiosError } from "axios";
import { FAB } from "react-native-paper";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons";

export default function HistoryScreen({ navigation }: any) {
  const [attendances, setAttendances] = useState<IAttendance[]>([]);
  const [company, setCompany] = useState<ICompany | null>(null);
  const [title, setTitle] = useState("");
  const [dayDate, setDayDate] = useState(0);
  const [openFeedback, setOpenFeedback] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    const d = new Date();
    let date = d.getDate().toString(); //Current Date
    let month = d.getMonth().toString(); //Current Month
    let year = d.getFullYear().toString(); //Current Year

    date = date.padStart(2, "0");
    month = month.padStart(2, "0");
    year = year.padStart(2, "0");

    await getAttendances(date + "-" + month + "-" + year);
    await storage.load({ key: "attendances" }).then((attendances) => {
      setRefreshing(true);
      const attendancesData = JSON.parse(attendances);
      setAttendances(attendancesData);
      setRefreshing(false);
    });

    setRefreshing(false);
  }, []);

  useEffect(() => {
    async function loadDatas() {
      setRefreshing(true);
      const attendances = await storage.load({ key: "attendances" });
      const attendancesData = JSON.parse(attendances);

      setAttendances(attendancesData);
      setRefreshing(false);

      await getCompany().then(async (res) => {
        if (res instanceof AxiosError) {
          console.log(res);
        } else {
          setCompany(res.data.data.company);
        }
      });
    }
    loadDatas();
  }, []);

  return (
    <View className="mt-6 bg-[#DEE9FD] dark:bg-[#212121]">
      <View className="flex-row justify-between px-5">
        <View className="mx-auto mt-5 flex w-16 flex-row items-center justify-center rounded-full bg-[#DEE9FD] p-2 shadow-md shadow-gray-800 dark:bg-[#3a3a3a] dark:shadow-white">
          <TouchableOpacity onPress={toggleColorScheme}>
            <Ionicons
              size={32}
              color={
                colorScheme === "dark"
                  ? "#DEE9FD"
                  : colorScheme == "light"
                    ? "#212121"
                    : "DEE9FD"
              }
              name={
                colorScheme === "light"
                  ? "sunny-outline"
                  : colorScheme == "dark"
                    ? "moon-outline"
                    : "sunny-outline"
              }
            />
          </TouchableOpacity>
        </View>
        <View className="mx-auto mt-5 flex w-48 flex-row items-center justify-center rounded-full bg-[#cedfff] p-2 shadow-md shadow-gray-800 dark:bg-[#3a3a3a] dark:shadow-white ">
          <Image
            source={require("../../assets/images/logo.png")}
            className="h-8 w-6"
          />
          <Text className="p-2 text-center text-xl font-bold tracking-widest  text-gray-600 dark:text-neutral-300">
            {company?.name ? company.name : ""}
          </Text>
        </View>
        {/* logout */}
        <View className="mx-auto mt-5 flex w-16 flex-row items-center justify-center rounded-full bg-[#DEE9FD] p-2 shadow-md shadow-gray-800 dark:bg-[#3a3a3a] dark:shadow-white ">
          <TouchableOpacity
            onPress={async () => {
              await storage.remove({ key: "user" });
              await storage.remove({ key: "token" });
              await storage.remove({ key: "attendance" });
              await storage.remove({ key: "attendances" });
              await storage.remove({ key: "paidLeaves" });
              await storage.save({ key: "isLoggedin", data: false });

              navigation.navigate("Login");
            }}
          >
            <Ionicons size={32} color="red" name="log-out-outline" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="mt-6 h-full rounded-t-[50px] bg-[#f0fafd] p-5 dark:bg-[#3a3a3a]">
        <View className="my-5 flex-row">
          <Text className="text-2xl font-bold dark:text-neutral-300">
            Riwayat Presensi
          </Text>
        </View>
        <View className=" h-screen pb-72">
          <FlatList
            data={attendances}
            renderItem={({ item }) => {
              return (
                <View
                  key={item.id}
                  className=" mb-2 flex flex-row items-center justify-between rounded-xl border border-[#ccc] bg-[#DEE9FD] p-[20] dark:bg-[#212121]"
                >
                  <View>
                    <Text className="text-2xl font-bold text-gray-600 dark:text-neutral-300 ">
                      {capitalizeFirstLetter(item.status)}
                    </Text>
                    <Text
                      style={styles.content}
                      className="dark:text-neutral-300 "
                    >
                      {formatDate(item.date)}
                    </Text>
                  </View>
                  <Text className="text-sm font-semibold dark:text-neutral-300 ">
                    {item.checkIn} - {item.checkOut}
                  </Text>
                </View>
              );
            }}
            ItemSeparatorComponent={() => <View className="h-4" />}
            ListEmptyComponent={<Text>Kamu belum melakukan presensi</Text>}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      </View>
    </View>
  );
  function feedbackModal() {
    function showToast(arg0: string) {
      throw new Error("Function not implemented.");
    }

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
              {/* <Text className="text-2xl font-bold">Riwayat Presensi</Text> */}
              <View className="mt-4 w-full">
                <Text className="text-md  font-bold text-gray-600 dark:text-neutral-300">
                  Alasan
                </Text>
                <TextInput
                  className="border-b-2 border-b-gray-500 py-3 text-lg"
                  keyboardType="default"
                  onChangeText={(text) => setTitle(text)}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={async () => {
                if (title === "") {
                  showToast("Alasan tidak boleh kosong");
                  return;
                }

                // const data: IAPIPaidLeaveData = {
                //   reason: title,
                //   startDate: date,
                //   days: endTime,
                // };
                // await SendPaidLeave(data).then((res) => {
                //   if (res instanceof AxiosError) {
                //     console.log(res);
                //   } else {
                setOpenFeedback(false);
                // }
                // });
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
}

const styles = StyleSheet.create({
  scrollView: {
    marginHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
  },
});
