import { GetPaidLeaves } from "../../api/paidLeave";
import { formatISODate } from "../../api/util";
import { getCompany } from "../../api/company";

import storage from "../../utils/storage";

import { useCallback, useEffect, useState } from "react";
import { useColorScheme } from "nativewind";
import { AxiosError } from "axios";
import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

export default function HistoryScreen({ navigation }: any) {
  const [paidLeaves, setPaidLeaves] = useState<IPaidLeave[]>([]);
  const [company, setCompany] = useState<ICompany | null>(null);
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const d = new Date();
    let date = d.getDate().toString(); //Current Date
    let month = d.getMonth().toString(); //Current Month
    let year = d.getFullYear().toString(); //Current Year

    date = date.padStart(2, "0");
    month = month.padStart(2, "0");
    year = year.padStart(2, "0");

    await GetPaidLeaves(0).then((res) => {
      if (res instanceof AxiosError) {
        console.log(res.request);
      } else {
        setPaidLeaves(res.data.data.paidLeaves);
      }
    });
    setRefreshing(false);
  }, []);

  useEffect(() => {
    async function loadDatas() {
      setRefreshing(true);
      await GetPaidLeaves().then((res) => {
        if (res instanceof AxiosError) {
          console.log(res.response?.data.message);
        } else {
          setPaidLeaves(res.data.data.paidLeaves);
        }
      });
      setRefreshing(false);
    }
    loadDatas();
  }, []);

  return (
    <View className="mt-6 bg-[#DEE9FD] dark:bg-[#212121] ">
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
        <View className="my-5 flex-row justify-between">
          <Text className="text-2xl font-bold dark:text-neutral-300 ">
            Riwayat Pengajuan Cuti
          </Text>
        </View>
        <View className="h-screen pb-52">
          <FlatList
            data={paidLeaves}
            renderItem={({ item }) => {
              return (
                <View
                  key={item.id}
                  className=" mb-2 flex flex-row items-center justify-between rounded-xl border  border-[#ccc] bg-[#DEE9FD] p-[20] dark:bg-[#212121]"
                >
                  <View>
                    <Text className="text-2xl font-bold text-gray-600 dark:text-neutral-300 ">
                      {item.status === 0
                        ? "Pending"
                        : item.status === 1
                          ? "Diterima"
                          : "Ditolak"}
                    </Text>
                    <Text
                      style={styles.content}
                      className="dark:text-neutral-300 "
                    >
                      {formatISODate(item.startDate)}
                    </Text>
                  </View>
                  <Text className="text-sm font-semibold dark:text-neutral-300 ">
                    {item.days} Hari
                  </Text>
                </View>
              );
            }}
            ItemSeparatorComponent={() => <View className="h-4" />}
            ListEmptyComponent={
              <Text className="dark:text-neutral-300">
                Kamu belum pernah melakukan pengajuan cuti
              </Text>
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      </View>
    </View>
  );
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
