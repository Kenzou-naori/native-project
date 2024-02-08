import {
  Text,
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Calendar } from "react-native-calendars";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Spinner from "react-native-loading-spinner-overlay";
import { DataTable } from "react-native-paper";
import storage from "../utils/storage";
import { GetAttendances, GetPaidLeaves, GetUsers } from "../api/admin";
import { AxiosError } from "axios";
import { capitalizeFirstLetter, formatDate } from "../api/util";
import { getAttendances } from "../api/attendance";

const WebAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selected, setSelected] = useState("");
  const [state, setState] = useState({
    fromDate: "",
    toDate: "",
    dateError: "hghg",
  });
  const [user, setUser] = useState<IUser>();
  const [attendances, setAttendances] = useState<IAttendanceWithUser[]>([]);
  const [totalAttendances, setTotalAttendances] = useState<number>(0);
  const [attendance, setAttendance] = useState<IAttendanceWithUser>({
    id: "",
    user: {
      id: "",
      fullName: "",
      email: "",
      phone: "",
      accessLevel: 0,
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
  const [karyawan, setKaryawan] = useState<IUser[]>([]);
  const [totalKaryawan, setTotalKaryawan] = useState<number>(0);
  const [cuti, setCuti] = useState<IPaidLeave[]>([]);
  const [totalCuti, setTotalCuti] = useState<number>(0);

  const [page, setPage] = React.useState<number>(0);
  const from = page * 25;
  const to = Math.min((page + 1) * 25, totalAttendances);

  React.useEffect(() => {
    setPage(0);
    
    async function loadAttendances() {
      await GetAttendances();
      const attendances = await storage.load({ key: "attendances" });
      const attendancesData: IAttendanceWithUser[] = JSON.parse(attendances);
      const totalAttendances = await storage.load({ key: "totalAttendances" });
      
      setTotalAttendances(parseInt(totalAttendances));
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
      await loadAttendances();
      await loadUsers();
      await loadCuti();
      await loadUser();
      setLoading(false);
    }
    
    loadAll();
  }, []);

  return (
    <ScrollView className="w-full bg-[#DEE9FD]">
      <Spinner visible={loading} textContent={"Loading..."} />
      {/* <View className=" absolute w-48 h-96 bg-white p-3 my-36">
            <Text>hllo</Text>
          </View> */}
      <View className="p-6 lg:px-60  py-6">
        <View className="flex-row flex-wrap gap-4 ">
          <View className="border rounded-2xl border-gray-400 w-[45%] lg:w-[247px]  p-[20] mb-[20] mt-4 flex-row bg-[#f1f6ff]">
            <Ionicons size={32} color="black" name="people-outline" />
            <View className="flex-col ml-4">
              <Text className="text-2xl text-gray-600 font-bold">
                {totalKaryawan}
              </Text>
              <Text className="text-xl text-gray-600 font-semibold">
                Karyawan
              </Text>
            </View>
          </View>
          <View className="border rounded-2xl border-gray-400 w-[45%] lg:w-[247px]  p-[20] mb-[20] mt-4 flex-row bg-[#f1f6ff]">
            <Ionicons size={32} color="black" name="location-outline" />
            <View className="flex-col ml-4">
              <Text className="text-2xl text-gray-600 font-bold">
                {totalAttendances}
              </Text>
              <Text className="text-xl text-gray-600 font-semibold">
                Presensi
              </Text>
            </View>
          </View>
          {/* <View className="border rounded-2xl border-gray-400 w-[45%] lg:w-[247px]  p-[20] mb-[20] mt-4 flex-row bg-[#f1f6ff]">
						<Ionicons size={32} color="black" name="hand-left-outline" />
						<View className="flex-col ml-4">
							<Text className="text-2xl text-gray-600 font-bold">0</Text>
							<Text className="text-xl text-gray-600 font-semibold">Izin</Text>
						</View>
					</View> */}
          <View className="border rounded-2xl border-gray-400 w-[45%] lg:w-[247px]  p-[20] mb-[20] mt-4 flex-row bg-[#f1f6ff]">
            <Ionicons size={32} color="black" name="walk-outline" />
            <View className="flex-col ml-4">
              <Text className="text-2xl text-gray-600 font-bold">
                {totalCuti}
              </Text>
              <Text className="text-xl text-gray-600 font-semibold">Cuti</Text>
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
              const karyawan = await storage.load({ key: "karyawan" });
              const karyawanData: IUser[] = JSON.parse(karyawan);
              const cuti = await storage.load({ key: "cuti" });
              const cutiData: IPaidLeave[] = JSON.parse(cuti);
              setAttendances(attendancesData);
              setKaryawan(karyawanData);
              setCuti(cutiData);
              setLoading(false);
            }}
            className="bg-blue-500 p-3 rounded-md w-32 my-4 "
          >
            <Text className="text-white text-center">
			<Ionicons color="white" name="refresh-circle-outline" size={17}/>
				Refresh</Text>
          </TouchableOpacity>
          {/* logout */}
        </View>
        <View className="bg-[#f1f6ff] rounded-md shadow-lg">
          <View className="p-8 ">
            <View className="flex-row items-center justify-between">
              <Text className=" font-semibold">Presensi Kehadiran</Text>
              {renderCalendar()}
            </View>
          </View>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Nama</DataTable.Title>
              <DataTable.Title>Email</DataTable.Title>
              <DataTable.Title>No. HP</DataTable.Title>
              <DataTable.Title>Presensi</DataTable.Title>
              <DataTable.Title>Status</DataTable.Title>
            </DataTable.Header>

            {attendances.length === 0 && (
              <DataTable.Row>
                <DataTable.Cell>No data</DataTable.Cell>
                <DataTable.Cell>No data</DataTable.Cell>
                <DataTable.Cell>No data</DataTable.Cell>
                <DataTable.Cell>No data</DataTable.Cell>
                <DataTable.Cell>No data</DataTable.Cell>
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
                <DataTable.Cell>{attendance.user.fullName}</DataTable.Cell>
                <DataTable.Cell>{attendance.user.email}</DataTable.Cell>
                <DataTable.Cell>{attendance.user.phone}</DataTable.Cell>
                <DataTable.Cell>{formatDate(attendance.date)}</DataTable.Cell>
                <DataTable.Cell>
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

      {renderDetail()}
    </ScrollView>
  );

  function renderDetail() {
    return (
      <Modal animationType="fade" transparent={true} visible={showDetail}>
        <View className="items-center h-full justify-center">
          <View className="bg-[#f0fafd] rounded-2xl w-full lg:w-[40%] p-5">
            <View className="flex-row justify-between">
              <Text className="text-gray-600 text-2xl font-bold">
                Detail Presensi
              </Text>
              <TouchableOpacity onPress={() => setShowDetail(false)}>
                <FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
              </TouchableOpacity>
            </View>
            {/* <View className="bg-[#f0fafd] rounded-t-[50px] h-full mt-[156] p-5 -mb-56"> */}
            {/* <View className="flex-row justify-between ">
						<Text className="text-gray-600 text-2xl font-bold">Tambah Tugas</Text>
						<TouchableOpacity onPress={() => setShowModal(false)}>
							<FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
						</TouchableOpacity>
					</View> */}
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="flex-col justify-center items-center my-5">
                {/* <Text className="text-2xl font-bold">Riwayat Presensi</Text> */}
                <View className="mt-4 w-full">
                  <Text className="text-md text-gray-600 font-bold">
                    Nama Lengkap
                  </Text>
                  <Text className="border-b-2 border-b-gray-500 text-lg py-3">
                    {attendance.user.fullName}
                  </Text>
                </View>
                <View className="mt-4 w-full">
                  <Text className="text-md text-gray-600 font-bold">Email</Text>
                  <Text className="border-b-2 border-b-gray-500 text-lg py-3">
                    {attendance.user.email}
                  </Text>
                </View>
                <View className="mt-4 w-full">
                  <Text className="text-md text-gray-600 font-bold">
                    No. HP
                  </Text>
                  <Text className="border-b-2 border-b-gray-500 text-lg py-3">
                    {attendance.user.phone}
                  </Text>
                </View>
                <View className="mt-4 w-full">
                  <Text className="text-md text-gray-600 font-bold">
                    Presensi
                  </Text>
                  <Text className="border-b-2 border-b-gray-500 text-lg py-3">
                    {formatDate(attendance.date)}
                  </Text>
                </View>
                <View className="mt-4 w-full">
                  <Text className="text-md text-gray-600 font-bold">
                    Status
                  </Text>
                  <Text className="border-b-2 border-b-gray-500 text-lg py-3">
                    {capitalizeFirstLetter(attendance.status)}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }

  function renderCalendar() {
    return (
      <Modal animationType="fade" transparent={true} visible={showModal}>
        <View className="items-center h-full justify-center">
          <View className="bg-[#f0fafd] rounded-2xl w-full lg:w-[40%] p-5">
            <View className="flex-row justify-between">
              <Text className="text-gray-600 text-2xl font-bold">
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
            <View className="flex-row gap-2 justify-end items-end">
              <TouchableOpacity className=" bg-blue-500 rounded-full w-20 p-2 ">
                <Text className="text-white text-center">Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity className=" bg-gray-500 rounded-full w-20 p-2 ">
                <Text className="text-white text-center">Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
};

export default WebAdmin;
