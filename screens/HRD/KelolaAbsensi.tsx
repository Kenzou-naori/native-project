import { GetAttendances, GetPaidLeaves, GetUsers } from "../../api/admin";
import { capitalizeFirstLetter, formatDate } from "../../api/util";

import storage from "../../utils/storage";

import { Text, View, ScrollView, Modal, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { Calendar } from "react-native-calendars";
import { PieChart } from "react-native-chart-kit";
import { DataTable } from "react-native-paper";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";

import Spinner from "react-native-loading-spinner-overlay";
import Ionicons from "react-native-vector-icons/Ionicons";

const WebAdmin = () => {
  const [attendances, setAttendances] = useState<IAttendanceWithUser[]>([]);
  const [totalAttendances, setTotalAttendances] = useState<number>(0);
  const [attendance, setAttendance] = useState<IAttendanceWithUser>({
    id: "",
    user: {
      id: "",
      fullName: "",
      email: "",
      phone: "",
      photo: "",
      accessLevel: 0,
      created_at: "",
    },
    date: "01-01-2021",
    userId: "",
    ipAddress: "",
    checkIn: "",
    checkOut: "",
    status: "hadir",
    created_at: "",
    updated_at: "",
  });
  const [totalKaryawan, setTotalKaryawan] = useState<number>(0);
  const [totalPresent, setTotalPresent] = useState<number>(0);
  const [totalAbsent, setTotalAbsent] = useState<number>(0);
  const [karyawan, setKaryawan] = useState<IUser[]>([]);
  const [totalCuti, setTotalCuti] = useState<number>(0);
  const [showDetail, setShowDetail] = useState(false);
  const [cuti, setCuti] = useState<IPaidLeave[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [chart, setChart] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("");
  const [page, setPage] = useState<number>(0);
  const [user, setUser] = useState<IUser>();
  const [state, setState] = useState({
    fromDate: "",
    toDate: "",
    dateError: "hghg",
  });

  const { colorScheme, toggleColorScheme } = useColorScheme();

  const from = page * 25;
  const to = Math.min((page + 1) * 25, totalAttendances);

  useEffect(() => {
    setPage(0);
    setChart(1);

    async function loadAttendances() {
      await GetAttendances();
      const attendances = await storage.load({ key: "attendances" });
      const attendancesData: IAttendanceWithUser[] = JSON.parse(attendances);
      const totalAttendances = await storage.load({ key: "totalAttendances" });
      const totalAttendancesData: TotalDataAttendance =
        JSON.parse(totalAttendances);

      setTotalAttendances(totalAttendancesData.all);
      setTotalPresent(totalAttendancesData.monthly.present);
      setTotalAbsent(totalAttendancesData.monthly.absent);
      setAttendances(attendancesData);
    }

    function loadUsers() {
      GetUsers().then(async (res) => {
        if (res instanceof AxiosError) {
          console.log(res);
        } else {
          await storage.save({
            key: "karyawan",
            data: JSON.stringify(res.data.data.users),
          });
          await storage.save({
            key: "totalKaryawan",
            data: String(res.data.data.total),
          });
          setTotalKaryawan(res.data.data.total);
          setKaryawan(res.data.data.users);
        }
      });
    }

    function loadCuti() {
      GetPaidLeaves().then(async (res) => {
        if (res instanceof AxiosError) {
          console.log(res);
        } else {
          await storage.save({
            key: "cuti",
            data: JSON.stringify(res.data.data.paidLeaves),
          });
          await storage.save({
            key: "totalCuti",
            data: String(res.data.data.total),
          });
          setTotalCuti(res.data.data.total);
          setCuti(res.data.data.paidLeaves);
        }
      });
    }

    async function loadUser() {
      const user = await storage.load({ key: "user" });
      const userData = JSON.parse(user);
      setUser(userData);
    }

    async function loadAll() {
      setLoading(true);
      await Promise.allSettled([
        loadAttendances(),
        loadUsers(),
        loadUser(),
        loadCuti(),
      ]).then(() => {
        setLoading(false);
      });
    }

    loadAll();
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
    <ScrollView className="w-full bg-[#DEE9FD] dark:bg-[#212121]">
      <Spinner visible={loading} textContent={"Loading..."} />
      {/* <View className="absolute p-3 my-36 w-48 h-96 bg-white">
            <Text>hllo</Text>
          </View> */}
      <View className="px-3 py-6 lg:px-10 xl:px-24 2xl:px-60">
        <View className="flex-row">
          <View className="w-[60%] flex-row flex-wrap gap-4 py-4">
            <View className="mb-[20] mt-4 w-[45%] flex-row items-center rounded-2xl border border-gray-400 bg-[#f1f6ff] p-[20] dark:bg-[#3a3a3a] dark:shadow-white lg:w-[247px]">
              <Ionicons
                size={32}
                color={
                  colorScheme === "dark"
                    ? "#DEE9FD"
                    : colorScheme == "light"
                      ? "#212121"
                      : "DEE9FD"
                }
                name="people-outline"
              />
              <View className="ml-4 flex-col">
                <Text className="text-2xl font-bold text-gray-600 dark:text-neutral-300">
                  {totalKaryawan}
                </Text>
                <Text className="text-xl font-semibold text-gray-600 dark:text-neutral-300">
                  Karyawan
                </Text>
              </View>
            </View>
            <View className="mb-[20] mt-4 w-[45%] flex-row items-center rounded-2xl border border-gray-400 bg-[#f1f6ff] p-[20] dark:bg-[#3a3a3a] dark:shadow-white lg:w-[247px]">
              <Ionicons
                size={32}
                color={
                  colorScheme === "dark"
                    ? "#DEE9FD"
                    : colorScheme == "light"
                      ? "#212121"
                      : "DEE9FD"
                }
                name="location-outline"
              />
              <View className="ml-4 flex-col">
                <Text className="text-2xl font-bold text-gray-600 dark:text-neutral-300">
                  {totalAttendances}
                </Text>
                <Text className="text-xl font-semibold text-gray-600 dark:text-neutral-300">
                  Presensi
                </Text>
              </View>
            </View>
            {/* <View className="border rounded-2xl border-gray-400 w-[45%] lg:w-[247px]  p-[20] mb-[20] mt-4 flex-row bg-[#f1f6ff] dark:bg-[#3a3a3a] dark:shadow-white">
						<Ionicons size={32} color="black" name="hand-left-outline" />
						<View className="flex-col ml-4">
							<Text className="text-2xl font-bold text-gray-600 dark:text-neutral-300">0</Text>
							<Text className="text-xl font-semibold text-gray-600 dark:text-neutral-300">Izin</Text>
						</View>
					</View> */}
            {/* <BarChart data={barData}/> */}

            <View className="mb-[20] mt-4 w-[45%] flex-row items-center rounded-2xl border border-gray-400 bg-[#f1f6ff] p-[20] dark:bg-[#3a3a3a] dark:shadow-white lg:w-[247px]">
              <Ionicons
                size={32}
                color={
                  colorScheme === "dark"
                    ? "#DEE9FD"
                    : colorScheme == "light"
                      ? "#212121"
                      : "DEE9FD"
                }
                name="walk-outline"
              />
              <View className="ml-4 flex-col">
                <Text className="text-2xl font-bold text-gray-600 dark:text-neutral-300">
                  {totalCuti}
                </Text>
                <Text className="text-xl font-semibold text-gray-600 dark:text-neutral-300">
                  Cuti
                </Text>
              </View>
            </View>
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
        <View className="flex-row gap-3">
          {/* refresh */}
          <TouchableOpacity
            onPress={async () => {
              setLoading(true);
              await GetAttendances(page + 1);
              await GetUsers();
              await GetPaidLeaves();
              const attendances = await storage.load({ key: "attendances" });
              const attendancesData: IAttendanceWithUser[] =
                JSON.parse(attendances);
              const totalAttendances = await storage.load({
                key: "totalAttendances",
              });
              const totalAttendancesData: TotalDataAttendance =
                JSON.parse(totalAttendances);
              const karyawan = await storage.load({ key: "karyawan" });
              const karyawanData: IUser[] = JSON.parse(karyawan);
              const cuti = await storage.load({ key: "cuti" });
              const cutiData: IPaidLeave[] = JSON.parse(cuti);
              setAttendances(attendancesData);
              setTotalAttendances(totalAttendancesData.all);
              if (chart === 0) {
                setTotalPresent(totalAttendancesData.weekly.present);
                setTotalAbsent(totalAttendancesData.weekly.absent);
              } else if (chart === 1) {
                setTotalPresent(totalAttendancesData.monthly.present);
                setTotalAbsent(totalAttendancesData.monthly.absent);
              }
              setKaryawan(karyawanData);
              setCuti(cutiData);
              setLoading(false);
            }}
            className="my-4 w-32 rounded-md bg-blue-500 p-3"
          >
            <Text className="text-center text-white">
              <Ionicons color="white" name="refresh-circle-outline" size={17} />
              Refresh
            </Text>
          </TouchableOpacity>
          {/* logout */}
        </View>
        <View className="rounded-md bg-[#f1f6ff] shadow-lg dark:bg-[#3a3a3a] dark:shadow-white">
          <View className="p-8">
            <View className="flex-row items-center justify-between">
              <Text className="font-semibold text-gray-600 dark:text-neutral-300">
                Presensi Kehadiran
              </Text>
              {renderCalendar()}
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
                Presensi
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
                Status
              </DataTable.Title>
            </DataTable.Header>

            {attendances.length === 0 && (
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

            {attendances.map((attendance) => (
              <DataTable.Row
                key={attendance.id}
                onPress={() => {
                  setAttendance(attendance);
                  setShowDetail(true);
                }}
              >
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
                  {attendance.user.fullName}
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
                  {attendance.user.email}
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
                  {attendance.user.phone}
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
                  {formatDate(attendance.date)}
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
                  {capitalizeFirstLetter(attendance.status)}
                </DataTable.Cell>
              </DataTable.Row>
            ))}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(totalAttendances / 25)}
              onPageChange={async (page) => {
                setLoading(true);
                setPage(page);
                await GetAttendances(page + 1);
                const attendances = await storage.load({ key: "attendances" });
                const attendancesData: IAttendanceWithUser[] =
                  JSON.parse(attendances);
                setAttendances(attendancesData);
                setLoading(false);
              }}
              label={`${from + 1}-${to} of ${totalAttendances}`}
              showFastPaginationControls
              numberOfItemsPerPage={25}
            />
          </DataTable>
        </View>
      </View>
    </ScrollView>
  );

  function renderCalendar() {
    return (
      <Modal animationType="fade" transparent={true} visible={showModal}>
        <View className="h-full items-center justify-center">
          <View className="w-full rounded-2xl bg-[#f0fafd] p-5 lg:w-[40%]">
            <View className="flex-row justify-between">
              <Text className="text-2xl font-bold text-gray-600 dark:text-neutral-300 ">
                Pilih Tanggal
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
              </TouchableOpacity>
            </View>
            <Calendar
              onSuccess={(start: any, end: any) =>
                setState({
                  ...state,
                  fromDate: start,
                  toDate: end,
                  dateError: "",
                })
              }
              errorMesaage={state?.dateError}
              hideArrows={false}
              style={{
                borderWidth: 1,
                borderColor: "gray",
                marginHorizontal: 50,
                marginVertical: 10,
              }}
              theme={{
                backgroundColor: "#ffffff",
                calendarBackground: "#ffffff",
                textSectionTitleColor: "#b6c1cd",
                selectedDayBackgroundColor: "#00adf5",
                selectedDayTextColor: "black",
                todayTextColor: "#00adf5",
                dayTextColor: "#2d4150",
                textDisabledColor: "#d9e",
              }}
              onDayPress={(day) => {
                setSelected(day.dateString);
                console.log("selected day", day);
              }}
              markingType={"period"}
              markedDates={{
                [selected]: {
                  marked: true,
                  selected: true,
                  disableTouchEvent: true,
                  selectedColor: "blue",
                  selectedTextColor: "white",
                },
              }}
            />
            <View className="flex-row items-end justify-end gap-2">
              <TouchableOpacity className="w-20 rounded-full bg-blue-500 p-2">
                <Text className="text-center text-white">Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity className="w-20 rounded-full bg-gray-500 p-2">
                <Text className="text-center text-white">Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
};

export default WebAdmin;
