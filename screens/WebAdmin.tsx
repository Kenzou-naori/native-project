import { Text, View, ScrollView, Modal, TouchableOpacity, SafeAreaView } from "react-native";
import React, { useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Calendar } from "react-native-calendars";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Spinner from "react-native-loading-spinner-overlay";
import { DataTable } from "react-native-paper";
import { createDrawerNavigator } from "@react-navigation/drawer";
import storage from "../utils/storage";
import { GetAttendances, GetPaidLeaves, GetUser, GetUsers } from "../api/admin";
import { AxiosError } from "axios";
import { capitalizeFirstLetter, formatDate } from "../api/util";

const Drawer = createDrawerNavigator();

const WebAdmin = (navigation: any) => {
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [showDetail, setShowDetail] = useState(false);
	const [selected, setSelected] = useState("");
	const [state, setState] = useState({
		fromDate: "",
		toDate: "",
		dateError: "hghg"
	});
  const [user,  setUser] = useState<IUser>()
	const [attendances, setAttendances] = useState<IAttendanceWithUser[]>([]);
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
		updated_at: ""
	});
	const [karyawan, setKaryawan] = useState<IUser[]>([]);
	const [cuti, setCuti] = useState<IPaidLeave[]>([]);

	const [page, setPage] = React.useState<number>(0);
	const [numberOfItemsPerPageList] = React.useState([10, 20, 30]);
	const [itemsPerPage, onItemsPerPageChange] = React.useState(numberOfItemsPerPageList[0]);
	const from = page * itemsPerPage;
	const to = Math.min((page + 1) * itemsPerPage, attendances.length);

	React.useEffect(() => {
		setPage(0);

		async function loadAttendances() {
			setLoading(true);
			await GetAttendances();
			const attendances = await storage.load({ key: "attendances" });
			const attendancesData: IAttendanceWithUser[] = JSON.parse(attendances);

			setAttendances(attendancesData);
			setLoading(false);
		}

		function loadUsers() {
			setLoading(true);
			GetUsers().then(async res => {
				if (res instanceof AxiosError) {
					console.log(res);
				} else {
					await storage.save({
						key: "karyawan",
						data: JSON.stringify(res.data.data.users)
					});
					setKaryawan(res.data.data.users);
				}
				setLoading(false);
			});
		}

		function loadCuti() {
			setLoading(true);
			GetPaidLeaves().then(async res => {
				if (res instanceof AxiosError) {
					console.log(res);
				} else {
					await storage.save({
						key: "cuti",
						data: JSON.stringify(res.data.data.paidLeaves)
					});
					setCuti(res.data.data.paidLeaves);
				}
				setLoading(false);
			});
		}

    async function loadUser() {
      const user = await storage.load({ key: "user" });
      const userData = JSON.parse(user);
      setUser(userData);
    }

		loadAttendances();
		loadUsers();
		loadCuti();
    loadUser();
	}, [itemsPerPage]);

	return (
		<ScrollView className="w-full bg-[#DEE9FD]">
			<Spinner visible={loading} textContent={"Loading..."} />
			{/* <View className=" absolute w-48 h-96 bg-white p-3 my-36">
            <Text>hllo</Text>
          </View> */}
			<View className="p-6 lg:px-60  py-6">
				<View>
					<Text className="text-3xl mb-3 font-bold">Halo, {user?.fullName}</Text>
          
				</View>
				<View className="flex-row flex-wrap gap-4 ">
					<View className="border rounded-2xl border-gray-400 w-[45%] lg:w-[247px]  p-[20] mb-[20] mt-4 flex-row bg-[#f1f6ff]">
						<Ionicons size={32} color="black" name="people-outline" />
						<View className="flex-col ml-4">
							<Text className="text-2xl text-gray-600 font-bold">{karyawan.length}</Text>
							<Text className="text-xl text-gray-600 font-semibold">Karyawan</Text>
						</View>
					</View>
					<View className="border rounded-2xl border-gray-400 w-[45%] lg:w-[247px]  p-[20] mb-[20] mt-4 flex-row bg-[#f1f6ff]">
						<Ionicons size={32} color="black" name="location-outline" />
						<View className="flex-col ml-4">
							<Text className="text-2xl text-gray-600 font-bold">{attendances.length}</Text>
							<Text className="text-xl text-gray-600 font-semibold">Presensi</Text>
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
							<Text className="text-2xl text-gray-600 font-bold">{cuti.length}</Text>
							<Text className="text-xl text-gray-600 font-semibold">Cuti</Text>
						</View>
					</View>
				</View>
        <View className="flex-row gap-3">
				{/* refresh */}
				<TouchableOpacity
					onPress={async () => {
						setLoading(true);
						await GetAttendances();
						await GetUsers();
						await GetPaidLeaves();
						const attendances = await storage.load({ key: "attendances" });
						const attendancesData: IAttendanceWithUser[] = JSON.parse(attendances);
						const karyawan = await storage.load({ key: "karyawan" });
						const karyawanData: IUser[] = JSON.parse(karyawan);
						const cuti = await storage.load({ key: "cuti" });
						const cutiData: IPaidLeave[] = JSON.parse(cuti);
						setAttendances(attendancesData);
						setKaryawan(karyawanData);
						setCuti(cutiData);
						setLoading(false);
					}}
					className="bg-blue-500 p-3 rounded-md w-32 my-4 ">
					<Text className="text-white text-center">Refresh</Text>
				</TouchableOpacity>
				{/* logout */}
				<TouchableOpacity
					onPress={async () => {
						await storage.remove({ key: "user" });
						await storage.remove({ key: "token" });
						await storage.save({ key: "isLoggedin", data: false });

						navigation.navigate("Login");
					}}
					className="bg-red-500 p-3 rounded-md w-32 my-4 ">
					<Text className="text-white text-center">Logout</Text>
				</TouchableOpacity>
			</View>
				<View className="bg-[#f1f6ff] rounded-md shadow-lg">
					<View className="p-8 ">
						<View className="flex-row items-center justify-between">
							<Text className=" font-semibold">Presensi Kehadiran</Text>
							{/* <TouchableOpacity
								onPress={() => setShowModal(true)}
								className="border border-gray-600 rounded-md p-1">
								<Text className="text-gray-600 font-semibold">Pilih Tanggal</Text>
							</TouchableOpacity> */}
							{renderCalendar()}
						</View>
					</View>
					<DataTable>
					<DataTable.Pagination
							page={page}
							numberOfPages={Math.ceil(cuti.length / itemsPerPage)}
							onPageChange={page => setPage(page)}
							label={`${from + 1}-${to} of ${cuti.length}`}
							numberOfItemsPerPageList={numberOfItemsPerPageList}
							numberOfItemsPerPage={itemsPerPage}
							onItemsPerPageChange={onItemsPerPageChange}
							showFastPaginationControls
							selectPageDropdownLabel={"Rows per page"}
						/>
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

						{attendances.slice(from, to).map(attendance => (
							<DataTable.Row
								key={attendance.id}
								onPress={() => {
									setAttendance(attendance);
									setShowDetail(true);
								}}>
								<DataTable.Cell>{attendance.user.fullName}</DataTable.Cell>
								<DataTable.Cell>{attendance.user.email}</DataTable.Cell>
								<DataTable.Cell>{attendance.user.phone}</DataTable.Cell>
								<DataTable.Cell>{formatDate(attendance.date)}</DataTable.Cell>
								<DataTable.Cell>{capitalizeFirstLetter(attendance.status)}</DataTable.Cell>
							</DataTable.Row>
						))}

						<DataTable.Pagination
							page={page}
							numberOfPages={Math.ceil(attendances.length / itemsPerPage)}
							onPageChange={page => setPage(page)}
							label={`${from + 1}-${to} of ${attendances.length}`}
							numberOfItemsPerPageList={numberOfItemsPerPageList}
							numberOfItemsPerPage={itemsPerPage}
							onItemsPerPageChange={onItemsPerPageChange}
							showFastPaginationControls
							selectPageDropdownLabel={"Rows per page"}
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
							<Text className="text-gray-600 text-2xl font-bold">Detail Presensi</Text>
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
									<Text className="text-md text-gray-600 font-bold">Nama Lengkap</Text>
									<Text className="border-b-2 border-b-gray-500 text-lg py-3">{attendance.user.fullName}</Text>
								</View>
								<View className="mt-4 w-full">
									<Text className="text-md text-gray-600 font-bold">Email</Text>
									<Text className="border-b-2 border-b-gray-500 text-lg py-3">{attendance.user.email}</Text>
								</View>
								<View className="mt-4 w-full">
									<Text className="text-md text-gray-600 font-bold">No. HP</Text>
									<Text className="border-b-2 border-b-gray-500 text-lg py-3">{attendance.user.phone}</Text>
								</View>
								<View className="mt-4 w-full">
									<Text className="text-md text-gray-600 font-bold">Presensi</Text>
									<Text className="border-b-2 border-b-gray-500 text-lg py-3">
										{formatDate(attendance.date)}
									</Text>
								</View>
								<View className="mt-4 w-full">
									<Text className="text-md text-gray-600 font-bold">Status</Text>
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
							<Text className="text-gray-600 text-2xl font-bold">Pilih Tanggal</Text>
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
									dateError: ""
								})
							}
							errorMesaage={state?.dateError}
							hideArrows={false}
							style={{
								borderWidth: 1,
								borderColor: "gray",
								marginHorizontal: 50,
								marginVertical: 10
							}}
							theme={{
								backgroundColor: "#ffffff",
								calendarBackground: "#ffffff",
								textSectionTitleColor: "#b6c1cd",
								selectedDayBackgroundColor: "#00adf5",
								selectedDayTextColor: "black",
								todayTextColor: "#00adf5",
								dayTextColor: "#2d4150",
								textDisabledColor: "#d9e"
							}}
							onDayPress={day => {
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
									selectedTextColor: "white"
								}
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
