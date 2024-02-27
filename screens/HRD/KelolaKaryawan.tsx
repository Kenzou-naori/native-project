import storage from "../../utils/storage";
import {
  GetUserAttendances,
  GetUsers,
} from "../../api/admin";

import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { PieChart } from "react-native-chart-kit";
import { DataTable } from "react-native-paper";
import { useEffect, useState } from "react";
import { useColorScheme } from "nativewind";
import { AxiosError } from "axios";
import {
  Text,
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
  Pressable,
} from "react-native";

import Spinner from "react-native-loading-spinner-overlay";
import Ionicons from "react-native-vector-icons/Ionicons";

const KelolaAbsensiKaryawan = () => {
  const [selKaryawan, setSelKaryawan] = useState<IUser>();
  const [karyawan, setKaryawan] = useState<IUser[]>([]);
  const [totalKaryawan, setTotalKaryawan] = useState(0);
  const [showDetail, setShowDetail] = useState(false);
  const [totalPresent, setTotalPresent] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [chart, setChart] = useState(1);
  const [page, setPage] = useState(0);

  const { colorScheme, toggleColorScheme } = useColorScheme();

  const to = Math.min((page + 1) * 25, totalKaryawan);
  const from = page * 25;

  const toggleDropdown = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    setPage(0);
    setLoading(true);

    async function loadKaryawan() {
      const karyawan = await GetUsers(page + 1);
      if (karyawan instanceof AxiosError) {
        console.log(karyawan);
      } else {
        setKaryawan(karyawan.data.data.users);
        setTotalKaryawan(karyawan.data.data.total);
        await storage.save({
          key: "karyawan",
          data: karyawan.data.data.users,
        });
      }
    }

    Promise.allSettled([loadKaryawan()]).then(() => {
      setLoading(false);
    });
  }, []);

  function sortAscending() {
    let temp = [...karyawan];

    temp.sort((a: IUser, b: IUser) => {
      if (a.created_at < b.created_at) {
        return 1;
      } else if (a.created_at > b.created_at) {
        return -1;
      }
      return 0;
    });
    setKaryawan(temp);
    console.log(temp);
  }
  function sortDescending() {
    let temp = [...karyawan];

    temp.sort((a: IUser, b: IUser) => {
      if (a.created_at < b.created_at) {
        return -1;
      } else if (a.created_at > b.created_at) {
        return 1;
      }
      return 0;
    });
    setKaryawan(temp);
    console.log(temp);
  }
  function sortAZ() {
    let temp = [...karyawan];

    temp.sort((a: IUser, b: IUser) => {
      if (a.fullName < b.fullName) {
        return -1;
      } else if (a.fullName > b.fullName) {
        return 1;
      }
      return 0;
    });
    setKaryawan(temp);
    console.log(temp);
  }
  function sortZA() {
    let temp = [...karyawan];

    temp.sort((a: IUser, b: IUser) => {
      if (a.fullName < b.fullName) {
        return 1;
      } else if (a.fullName > b.fullName) {
        return -1;
      }
      return 0;
    });
    setKaryawan(temp);
    console.log(temp);
  }
  function renderDropdown() {
    if (visible) {
      return (
        <View
          className="absolute top-10 float-right w-48 flex-col rounded-lg bg-white shadow-lg"
          style={{ elevation: 999, zIndex: 999 }}
        >
          <TouchableOpacity
            onPress={() => {
              toggleDropdown();
              sortAZ();
            }}
            className="border-b-gray-3 v00 border-b py-4"
          >
            <Text className="px-2">A-Z</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              toggleDropdown();
              sortZA();
            }}
            className="border-b-gray-3 v00 border-b py-4"
          >
            <Text className="px-2">Z-A</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              toggleDropdown();
              sortAscending();
            }}
            className="border-b-gray-3 v00 border-b py-4"
          >
            <Text className="px-2">Terbaru</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              toggleDropdown();
              sortDescending();
            }}
            className="border-b-gray-3 v00 border-b py-4"
          >
            <Text className="px-2">Terlama</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

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
    <ScrollView className="w-full bg-[#DEE9FD] dark:bg-[#212121]">
      <Spinner visible={loading} textContent={"Loading..."} />
      <View className="px-3 py-6 lg:px-10 xl:px-24 2xl:px-60">
        <View className="flex-row">
          <TouchableOpacity
            onPress={async () => {
              setLoading(true);
              const karyawan = await GetUsers(page + 1);
              if (karyawan instanceof AxiosError) {
                console.log(karyawan);
              } else {
                setKaryawan(karyawan.data.data.users);
                setTotalKaryawan(karyawan.data.data.total);
                await storage.save({
                  key: "karyawan",
                  data: karyawan.data.data.users,
                });
              }
              setLoading(false);
            }}
            className="my-4 w-32 rounded-md bg-blue-500 p-3"
          >
            <Text className="text-center text-white">
              <Ionicons color="white" name="refresh-circle-outline" size={17} />
              Refresh
            </Text>
          </TouchableOpacity>
        </View>
        <View className="mb-6 rounded-md bg-[#f1f6ff] shadow-lg dark:bg-[#3a3a3a] dark:shadow-white">
          <View className="p-4" style={{ elevation: 10, zIndex: 10 }}>
            <View className="flex-row items-center justify-between">
              <Text className="font-semibold text-gray-600 dark:text-neutral-300">
                Daftar Karyawan
              </Text>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={toggleDropdown}
                  className=" rounded-md border border-gray-600 p-1"
                >
                  {renderDropdown()}
                  <View className="flex-row items-center justify-end">
                    <Text className="font-semibold text-gray-600 dark:text-neutral-300">
                      Sort By
                    </Text>
                    <Ionicons
                      name="chevron-down-outline"
                      size={18}
                      color="gray"
                    />
                  </View>
                </Pressable>
              </View>
            </View>
          </View>

          <DataTable>
            <DataTable.Header>
              <DataTable.Title
                textStyle={{
                  color:
                    colorScheme === "dark"
                      ? "#DEE9FD"
                      : colorScheme == "light"
                        ? "#212121"
                        : "DEE9FD",
                }}
              >
                Nama
              </DataTable.Title>
              <DataTable.Title
                textStyle={{
                  color:
                    colorScheme === "dark"
                      ? "#DEE9FD"
                      : colorScheme == "light"
                        ? "#212121"
                        : "DEE9FD",
                }}
              >
                Email
              </DataTable.Title>
              <DataTable.Title
                textStyle={{
                  color:
                    colorScheme === "dark"
                      ? "#DEE9FD"
                      : colorScheme == "light"
                        ? "#212121"
                        : "DEE9FD",
                }}
              >
                No. HP
              </DataTable.Title>
              <DataTable.Title
                textStyle={{
                  color:
                    colorScheme === "dark"
                      ? "#DEE9FD"
                      : colorScheme == "light"
                        ? "#212121"
                        : "DEE9FD",
                }}
              >
                Tipe
              </DataTable.Title>
              <DataTable.Title
                textStyle={{
                  color:
                    colorScheme === "dark"
                      ? "#DEE9FD"
                      : colorScheme == "light"
                        ? "#212121"
                        : "DEE9FD",
                }}
              >
                Aksi
              </DataTable.Title>
            </DataTable.Header>

            {karyawan.length === 0 && (
              <DataTable.Row>
                <DataTable.Cell
                  textStyle={{
                    color:
                      colorScheme === "dark"
                        ? "#DEE9FD"
                        : colorScheme == "light"
                          ? "#212121"
                          : "DEE9FD",
                  }}
                >
                  No data
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={{
                    color:
                      colorScheme === "dark"
                        ? "#DEE9FD"
                        : colorScheme == "light"
                          ? "#212121"
                          : "DEE9FD",
                  }}
                >
                  No data
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={{
                    color:
                      colorScheme === "dark"
                        ? "#DEE9FD"
                        : colorScheme == "light"
                          ? "#212121"
                          : "DEE9FD",
                  }}
                >
                  No data
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={{
                    color:
                      colorScheme === "dark"
                        ? "#DEE9FD"
                        : colorScheme == "light"
                          ? "#212121"
                          : "DEE9FD",
                  }}
                >
                  No data
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={{
                    color:
                      colorScheme === "dark"
                        ? "#DEE9FD"
                        : colorScheme == "light"
                          ? "#212121"
                          : "DEE9FD",
                  }}
                >
                  No data
                </DataTable.Cell>
              </DataTable.Row>
            )}

            {karyawan.map((karyawan) => (
              <DataTable.Row key={karyawan.id} className="py-2 lg:py-4">
                <DataTable.Cell
                  textStyle={{
                    color:
                      colorScheme === "dark"
                        ? "#DEE9FD"
                        : colorScheme == "light"
                          ? "#212121"
                          : "DEE9FD",
                  }}
                >
                  {karyawan.fullName}
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={{
                    color:
                      colorScheme === "dark"
                        ? "#DEE9FD"
                        : colorScheme == "light"
                          ? "#212121"
                          : "DEE9FD",
                  }}
                >
                  {karyawan.email}
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={{
                    color:
                      colorScheme === "dark"
                        ? "#DEE9FD"
                        : colorScheme == "light"
                          ? "#212121"
                          : "DEE9FD",
                  }}
                >
                  {karyawan.phone}
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={{
                    color:
                      colorScheme === "dark"
                        ? "#DEE9FD"
                        : colorScheme == "light"
                          ? "#212121"
                          : "DEE9FD",
                  }}
                >
                  {karyawan.accessLevel === 1
                    ? "Admin"
                    : karyawan.accessLevel === 2
                      ? "HRD"
                      : "Karyawan"}
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={{
                    color:
                      colorScheme === "dark"
                        ? "#DEE9FD"
                        : colorScheme == "light"
                          ? "#212121"
                          : "DEE9FD",
                  }}
                >
                  {karyawan.accessLevel < 1 ? (
                    <View className="flex-col gap-1 lg:flex-row">
                      <TouchableOpacity
                        className="rounded-md border border-gray-600 bg-red-200 p-3"
                        onPress={async () => {
                          setLoading(true);
                          setSelKaryawan(karyawan);

                          await GetUserAttendances(karyawan.id);
                          const totalAttendances = await storage.load({
                            key: "totalAttendances",
                          });
                          const totalAttendancesData: TotalDataAttendance =
                            JSON.parse(totalAttendances);
                          setTotalPresent(totalAttendancesData.monthly.present);
                          setTotalAbsent(totalAttendancesData.monthly.absent);

                          setLoading(false);
                          setShowDetail(true);
                        }}
                      >
                        <Text className="text-gray-600">Detail</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <></>
                  )}
                </DataTable.Cell>
              </DataTable.Row>
            ))}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(totalKaryawan / 25)}
              onPageChange={async (page) => {
                setLoading(true);
                setPage(page);
                await GetUsers(page + 1);
                const karyawan = await storage.load({ key: "karyawan" });
                const karyawanData: IUser[] = JSON.parse(karyawan);
                const totalKaryawan = await storage.load({
                  key: "totalKaryawan",
                });
                setTotalKaryawan(parseInt(totalKaryawan));
                setKaryawan(karyawanData);
                setLoading(false);
              }}
              label={`${from + 1}-${to} of ${totalKaryawan}`}
              showFastPaginationControls
              numberOfItemsPerPage={25}
              selectPageDropdownRippleColor={"white"}
              dropdownItemRippleColor={"white"}
              paginationControlRippleColor={"white"}
            />
          </DataTable>
        </View>
      </View>

      {renderDetail()}
    </ScrollView>
  );

  function renderDetail() {
    return (
      <Modal animationType="fade" transparent={true} visible={showDetail}>
        <View className="h-full items-center justify-center">
          <View className="w-full rounded-2xl bg-[#f0fafd] p-5 dark:bg-[#3a3a3a] lg:w-[80%]">
            <View className="flex-row justify-between">
              <Text className="text-2xl font-bold text-gray-600 dark:text-neutral-300 ">
                Detail Presensi
              </Text>
              <TouchableOpacity onPress={() => setShowDetail(false)}>
                <FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
              </TouchableOpacity>
            </View>
            <View className="flex-row">
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
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="my-5 flex-col items-center justify-center">
                  {/* <Text className="text-2xl font-bold">Riwayat Presensi</Text> */}
                  <View className="mt-4 w-full">
                    <Text className="text-md font-bold text-gray-600 dark:text-neutral-300 ">
                      Nama Lengkap
                    </Text>
                    <Text className="border-b-2 border-b-gray-500 py-3 text-lg text-gray-600 dark:text-neutral-300 ">
                      {selKaryawan?.fullName}
                    </Text>
                  </View>
                  <View className="mt-4 w-full">
                    <Text className="text-md font-bold text-gray-600 dark:text-neutral-300 ">
                      Email
                    </Text>
                    <Text className="border-b-2 border-b-gray-500 py-3 text-lg text-gray-600 dark:text-neutral-300 ">
                      {selKaryawan?.email}
                    </Text>
                  </View>
                  <View className="mt-4 w-full">
                    <Text className="text-md font-bold text-gray-600 dark:text-neutral-300 ">
                      No. HP
                    </Text>
                    <Text className="border-b-2 border-b-gray-500 py-3 text-lg text-gray-600 dark:text-neutral-300 ">
                      {selKaryawan?.phone}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
};

export default KelolaAbsensiKaryawan;
