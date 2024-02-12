import { GetAttendances, GetPaidLeaves, GetUsers } from "../api/admin";
import { capitalizeFirstLetter, formatDate } from "../api/util";
import storage from "../utils/storage";

import { Text, View, ScrollView, Modal, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { LineChart, PieChart } from "react-native-chart-kit";
import { Calendar } from "react-native-calendars";
import { DataTable } from "react-native-paper";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";

import Spinner from "react-native-loading-spinner-overlay";
import Ionicons from "react-native-vector-icons/Ionicons";

const WebAdmin = () => {
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [showDetail, setShowDetail] = useState(false);
	const [selected, setSelected] = useState("");
	const [state, setState] = useState({
		fromDate: "",
		toDate: "",
		dateError: "hghg"
	});

	const [user, setUser] = useState<IUser>();
	const [attendances, setAttendances] = useState<IAttendanceWithUser[]>([]);
	const [totalAttendances, setTotalAttendances] = useState<number>(0);
	const [totalPresent, setTotalPresent] = useState<number>(0);
	const [totalAbsent, setTotalAbsent] = useState<number>(0);
	const [chart, setChart] = useState<number>(1);
	const [attendance, setAttendance] = useState<IAttendanceWithUser>({
		id: "",
		user: {
			id: "",
			fullName: "",
			email: "",
			phone: "",
			accessLevel: 0,
			created_at: ""
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
	const barData = [{ value: 15 }, { value: 30 }, { value: 26 }, { value: 40 }];
	const [karyawan, setKaryawan] = useState<IUser[]>([]);
	const [totalKaryawan, setTotalKaryawan] = useState<number>(0);
	const [cuti, setCuti] = useState<IPaidLeave[]>([]);
	const [totalCuti, setTotalCuti] = useState<number>(0);

	const [page, setPage] = useState<number>(0);
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
			const totalAttendancesData: TotalDataAttendance = JSON.parse(totalAttendances);

			setTotalAttendances(totalAttendancesData.all);
			setTotalPresent(totalAttendancesData.monthly.present);
			setTotalAbsent(totalAttendancesData.monthly.absent);
			setAttendances(attendancesData);
		}

		function loadUsers() {
			GetUsers().then(async res => {
				if (res instanceof AxiosError) {
					console.log(res);
				} else {
					await storage.save({
						key: "karyawan",
						data: JSON.stringify(res.data.data.users)
					});
					await storage.save({
						key: "totalKaryawan",
						data: String(res.data.data.total)
					});
					setTotalKaryawan(res.data.data.total);
					setKaryawan(res.data.data.users);
				}
			});
		}

		function loadCuti() {
			GetPaidLeaves().then(async res => {
				if (res instanceof AxiosError) {
					console.log(res);
				} else {
					await storage.save({
						key: "cuti",
						data: JSON.stringify(res.data.data.paidLeaves)
					});
					await storage.save({
						key: "totalCuti",
						data: String(res.data.data.total)
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
	const chartConfig = {
		backgroundGradientFrom: "#1E2923",
		backgroundGradientFromOpacity: 0,
		backgroundGradientTo: "#08130D",
		backgroundGradientToOpacity: 0.5,
		color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
		strokeWidth: 2, // optional, default 3
		barPercentage: 0.5,
		useShadowColorFromDataset: false // optional
	};
	const data = [
		{
			name: "Masuk",
			attendance: totalPresent,
			color: "rgb(0, 255, 146)",
			legendFontColor: "#7F7F7F",
			legendFontSize: 15
		},
		{
			name: "Tidak Masuk",
			attendance: totalAbsent,
			color: "rgb(242,69,69)",
			legendFontColor: "#7F7F7F",
			legendFontSize: 15
		}
	];
	return (
		<ScrollView className="w-full bg-[#DEE9FD]">
			<Spinner visible={loading} textContent={"Loading..."} />
			{/* <View className="absolute p-3 my-36 w-48 h-96 bg-white">
            <Text>hllo</Text>
          </View> */}
			<View className="py-6 px-3 lg:px-10 xl:px-24 2xl:px-60">
				<View className="flex-row">
					<View className="flex-row py-4 flex-wrap gap-4 w-[60%]">
						<View className="border rounded-2xl border-gray-400 w-[45%] lg:w-[247px] items-center p-[20] mb-[20] mt-4 flex-row bg-[#f1f6ff]">
							<Ionicons size={32} color="black" name="people-outline" />
							<View className="flex-col ml-4">
								<Text className="text-2xl font-bold text-gray-600">{totalKaryawan}</Text>
								<Text className="text-xl font-semibold text-gray-600">Karyawan</Text>
							</View>
						</View>
						<View className="border rounded-2xl border-gray-400 w-[45%] lg:w-[247px] items-center p-[20] mb-[20] mt-4 flex-row bg-[#f1f6ff]">
							<Ionicons size={32} color="black" name="location-outline" />
							<View className="flex-col ml-4">
								<Text className="text-2xl font-bold text-gray-600">{totalAttendances}</Text>
								<Text className="text-xl font-semibold text-gray-600">Presensi</Text>
							</View>
						</View>
						{/* <View className="border rounded-2xl border-gray-400 w-[45%] lg:w-[247px]  p-[20] mb-[20] mt-4 flex-row bg-[#f1f6ff]">
						<Ionicons size={32} color="black" name="hand-left-outline" />
						<View className="flex-col ml-4">
							<Text className="text-2xl font-bold text-gray-600">0</Text>
							<Text className="text-xl font-semibold text-gray-600">Izin</Text>
						</View>
					</View> */}
						{/* <BarChart data={barData}/> */}

						<View className="border rounded-2xl border-gray-400 w-[45%] lg:w-[247px] items-center p-[20] mb-[20] mt-4 flex-row bg-[#f1f6ff]">
							<Ionicons size={32} color="black" name="walk-outline" />
							<View className="flex-col ml-4">
								<Text className="text-2xl font-bold text-gray-600">{totalCuti}</Text>
								<Text className="text-xl font-semibold text-gray-600">Cuti</Text>
							</View>
						</View>
					</View>
					<View className=" justify-center items-center">
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
								className={"p-2 rounded-md " + (chart === 1 ? "bg-gray-500" : "bg-blue-500")}
								onPress={async () => {
									const totalAttendances = await storage.load({ key: "totalAttendances" });
									const totalAttendancesData: TotalDataAttendance = JSON.parse(totalAttendances);
									setChart(1);
									setTotalPresent(totalAttendancesData.monthly.present);
									setTotalAbsent(totalAttendancesData.monthly.absent);
								}}
								disabled={chart === 1}>
								<Text className=" text-gray-200">Per Bulan</Text>
							</TouchableOpacity>
							<TouchableOpacity
								className={"p-2 rounded-md " + (chart === 0 ? "bg-gray-500" : "bg-blue-500")}
								onPress={async () => {
									const totalAttendances = await storage.load({ key: "totalAttendances" });
									const totalAttendancesData: TotalDataAttendance = JSON.parse(totalAttendances);
									setChart(0);
									setTotalPresent(totalAttendancesData.weekly.present);
									setTotalAbsent(totalAttendancesData.weekly.absent);
								}}
								disabled={chart === 0}>
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
							const attendancesData: IAttendanceWithUser[] = JSON.parse(attendances);
							const totalAttendances = await storage.load({ key: "totalAttendances" });
							const totalAttendancesData: TotalDataAttendance = JSON.parse(totalAttendances);
							const karyawan = await storage.load({ key: "karyawan" });
							const karyawanData: IUser[] = JSON.parse(karyawan);
							const cuti = await storage.load({ key: "cuti" });
							const cutiData: IPaidLeave[] = JSON.parse(cuti);
							setAttendances(attendancesData);
							setTotalAttendances(totalAttendancesData.all)
							if (chart === 0) {
								setTotalPresent(totalAttendancesData.weekly.present)
								setTotalAbsent(totalAttendancesData.weekly.absent)
							} else if (chart === 1) {
								setTotalPresent(totalAttendancesData.monthly.present)
								setTotalAbsent(totalAttendancesData.monthly.absent)
							}
							setKaryawan(karyawanData);
							setCuti(cutiData);
							setLoading(false);
						}}
						className="p-3 my-4 w-32 bg-blue-500 rounded-md">
						<Text className="text-center text-white">
							<Ionicons color="white" name="refresh-circle-outline" size={17} />
							Refresh
						</Text>
					</TouchableOpacity>
					{/* logout */}
				</View>
				<View className="bg-[#f1f6ff] rounded-md shadow-lg">
					<View className="p-8">
						<View className="flex-row justify-between items-center">
							<Text className="font-semibold">Presensi Kehadiran</Text>
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

						{attendances.map(attendance => (
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
							numberOfPages={Math.ceil(totalAttendances / 25)}
							onPageChange={async page => {
								setLoading(true);
								setPage(page);
								await GetAttendances(page + 1);
								const attendances = await storage.load({ key: "attendances" });
								const attendancesData: IAttendanceWithUser[] = JSON.parse(attendances);
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
				<View className="justify-center items-center h-full">
					<View className="bg-[#f0fafd] rounded-2xl w-full lg:w-[40%] p-5">
						<View className="flex-row justify-between">
							<Text className="text-2xl font-bold text-gray-600">Detail Presensi</Text>
							<TouchableOpacity onPress={() => setShowDetail(false)}>
								<FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
							</TouchableOpacity>
						</View>
						{/* <View className="bg-[#f0fafd] rounded-t-[50px] h-full mt-[156] p-5 -mb-56"> */}
						{/* <View className="flex-row justify-between">
						<Text className="text-2xl font-bold text-gray-600">Tambah Tugas</Text>
						<TouchableOpacity onPress={() => setShowModal(false)}>
							<FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
						</TouchableOpacity>
					</View> */}
						<ScrollView showsVerticalScrollIndicator={false}>
							<View className="flex-col justify-center items-center my-5">
								{/* <Text className="text-2xl font-bold">Riwayat Presensi</Text> */}
								<View className="mt-4 w-full">
									<Text className="font-bold text-gray-600 text-md">Nama Lengkap</Text>
									<Text className="py-3 text-lg border-b-2 border-b-gray-500">{attendance.user.fullName}</Text>
								</View>
								<View className="mt-4 w-full">
									<Text className="font-bold text-gray-600 text-md">Email</Text>
									<Text className="py-3 text-lg border-b-2 border-b-gray-500">{attendance.user.email}</Text>
								</View>
								<View className="mt-4 w-full">
									<Text className="font-bold text-gray-600 text-md">No. HP</Text>
									<Text className="py-3 text-lg border-b-2 border-b-gray-500">{attendance.user.phone}</Text>
								</View>
								<View className="mt-4 w-full">
									<Text className="font-bold text-gray-600 text-md">Presensi</Text>
									<Text className="py-3 text-lg border-b-2 border-b-gray-500">
										{formatDate(attendance.date)}
									</Text>
								</View>
								<View className="mt-4 w-full">
									<Text className="font-bold text-gray-600 text-md">Status</Text>
									<Text className="py-3 text-lg border-b-2 border-b-gray-500">
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
				<View className="justify-center items-center h-full">
					<View className="bg-[#f0fafd] rounded-2xl w-full lg:w-[40%] p-5">
						<View className="flex-row justify-between">
							<Text className="text-2xl font-bold text-gray-600">Pilih Tanggal</Text>
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
							<TouchableOpacity className="p-2 w-20 bg-blue-500 rounded-full">
								<Text className="text-center text-white">Submit</Text>
							</TouchableOpacity>
							<TouchableOpacity className="p-2 w-20 bg-gray-500 rounded-full">
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
