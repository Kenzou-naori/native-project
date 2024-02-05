import {
	StyleSheet,
	Text,
	View,
	Pressable,
	ScrollView,
	Image,
	TouchableOpacity,
	TextInput,
	Modal,
	RefreshControl
} from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";

// import for api
import constant from "../constant/date";
import { getCompany } from "../api/company";
import storage from "../utils/storage";
import { getAttendances, postAttendance, updateAttendance } from "../api/attendance";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { AxiosError } from "axios";
import { GetPaidLeave, SendPaidLeave } from "../api/paidLeave";
import { showToast } from "../api/util";
import Toast from "react-native-toast-message";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function HomeScreen({ navigation }: any) {
	const [day, setDay] = useState("");
	const [title, setTitle] = useState("");
	const [dayDate, setDayDate] = useState(0);
	const [monthDate, setMonthDate] = useState(0);
	const [yearDate, setYearDate] = useState(0);
	const [endTime, setEndTime] = useState(1);
	const [currentDate, setCurrentDate] = useState("");
	const [currentTime, setCurrentTime] = useState("");
	const [openModal, setOpenModal] = useState(false);
	const [company, setCompany] = useState<ICompany | null>(null);
	const [attendance, setAttendance] = useState<IAttendance | null>(null);
	const [refreshing, setRefreshing] = useState(false);
	const [activePaidLeave, setActivePaidLeave] = useState<IPaidLeave | null>(null);

	const onRefresh = React.useCallback(async () => {
		setRefreshing(true);
		const d = new Date();

		setDayDate(d.getDate());
		setMonthDate(d.getMonth() + 1);
		setYearDate(d.getFullYear());

		let date = d.getDate().toString(); //Current Date
		let month = (d.getMonth() + 1).toString(); //Current Month
		let year = d.getFullYear().toString(); //Current Year

		date = date.padStart(2, "0");
		month = month.padStart(2, "0");
		year = year.padStart(2, "0");

		await getAttendances(date + "-" + month + "-" + year).then(async res => {
			if (res instanceof AxiosError) {
				console.log(res.response);
			} else {
				await storage.load({ key: "attendance" }).then(async res => {
					const attendancesData = JSON.parse(res);
					setAttendance(attendancesData);
					
					await getCompany().then(async res => {
						if (res instanceof AxiosError) {
							console.log(res);
						} else {
							setCompany(res.data.data.company);
							
							await GetPaidLeave().then(res => {
								if (res instanceof AxiosError) {
									console.log(res.response?.data.message)
								} else {
									setActivePaidLeave(res.data.data.paidLeave);
									setRefreshing(false);
								}
							});
						}
					});
				});
			}
		});
	}, []);

	useEffect(() => {
		const d = new Date();
		let date = d.getDate().toString(); //Current Date
		let month = d.getMonth().toString(); //Current Month
		let year = d.getFullYear().toString(); //Current Year

		setDayDate(d.getDate());
		setMonthDate(d.getMonth() + 1);
		setYearDate(d.getFullYear());

		async function loadDate() {
			let day = constant.weekdays[d.getDay()];
			let month = constant.months[d.getMonth()];

			setDay(day);
			setCurrentDate(date + " " + month + " " + year);
		}

		async function loadTime() {
			const d = new Date();
			let hours = d.getHours().toString().padStart(2, "0");
			let minutes = d.getMinutes().toString().padStart(2, "0");
			let seconds = d.getSeconds().toString().padStart(2, "0");

			setCurrentTime(hours + ":" + minutes + ":" + seconds);
		}

		async function loadCompany() {
			await getCompany();
			const company = await storage.load({ key: "company" });
			const companyData = JSON.parse(company);

			setCompany(companyData);
		}

		async function loadAttendance() {
			date = date.padStart(2, "0");
			month = (d.getMonth() + 1).toString().padStart(2, "0");
			year = year.padStart(2, "0");

			await getAttendances(date + "-" + month + "-" + year);
			const attendance = await storage.load({ key: "attendance" });
			const attendanceData = JSON.parse(attendance);

			setAttendance(attendanceData);
		}

		async function loadPaidLeave() {
			await GetPaidLeave().then(res => {
				if (res instanceof AxiosError) {
					console.log(res);
				} else {
					setActivePaidLeave(res.data.data.paidLeave);
				}
			});
		}

		const intervalTD = setInterval(() => {
			loadTime();
			loadDate();
		}, 1000);

		loadDate();
		loadTime();
		loadCompany();
		loadAttendance();
		loadPaidLeave();

		return () => {
			clearInterval(intervalTD);
		};
	}, []);

	const [fullName, setFullName] = useState("");
	useEffect(() => {
		const getUserData = async () => {
			const dataString = await storage.load({ key: "user" });
			const data = JSON.parse(dataString);
			setFullName(data.fullName);
		};

		getUserData();
	}, []);

	return (
		<ScrollView
			className="mt-6 bg-[#DEE9FD] h-full"
			refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
			<StatusBar backgroundColor="#DEE9FD" style="dark" />
			<View className="flex-row justify-between px-5">
				<View className="p-2 w-60 mx-auto mt-5 flex flex-row justify-center items-center bg-[#DEE9FD] rounded-full shadow-xl shadow-gray-800">
					<Image source={require("../assets/images/logo.png")} className=" w-6 h-8" />
					<Text className=" text-gray-600 text-center  p-2 text-xl font-bold tracking-widest	">
						{company?.name ? company.name : ""}
					</Text>
				</View>
				{/* logout */}
				<View className="p-2 w-16 mx-auto mt-5 flex flex-row justify-center items-center bg-[#DEE9FD] rounded-full shadow-xl shadow-gray-800">
					<TouchableOpacity
          
						onPress={async () => {
							await storage.remove({ key: "user" });
							await storage.remove({ key: "token" });
							await storage.remove({ key: "attendance" });
							await storage.remove({ key: "attendances" });
							await storage.remove({ key: "paidLeaves" });
							await storage.save({ key: "isLoggedin", data: false });

							navigation.navigate("Login");
						}}>
            <Ionicons size={32} color="red" name="log-out-outline" />
					</TouchableOpacity>
				</View>
			</View>
			<View className=" px-10 mt-6 mb-2">
				<View className="rounded-full bg-[#cedfff] shadow shadow-gray-800 p-4">
					<Text className="text-lg text-gray-600 font-semibold">Halo,</Text>
					<Text className="text-xl text-gray-600 font-bold">{fullName}</Text>
				</View>
			</View>
			<View className="p-5">
				<View className=" rounded-[60px] px-5 ">
					<View className="flex flex-col gap-8 justify-center">
						<View className="bg-[#cedfff] rounded-[60px] shadow shadow-gray-800 p-4">
							<View className=" items-center mb-4">
								<Text className="text-3xl text-gray-600 font-bold">{day},</Text>
								<Text className="text-2xl text-gray-600 font-bold">{currentDate}</Text>
							</View>
							<Separator />
							<View className="flex-row justify-around">
								<View className="mt-3 items-center">
									<Text className="text-lg text-gray-600 font-bold">Masuk</Text>
									<Text
										className={
											day === "Sabtu" || day === "Minggu"
												? "text-2xl text-gray-600 font-medium"
												: currentTime >= company?.checkInTime!
												? "text-red-500 text-2xl font-medium"
												: "text-2xl text-gray-600 font-medium"
										}>
										{day === "Sabtu" || day === "Minggu"
											? "—"
											: attendance?.checkIn
											? attendance.checkIn
											: currentTime}
									</Text>
								</View>
								<View className="mt-3 items-center">
									<Text className="text-lg text-gray-600 font-bold">Keluar</Text>
									<Text className="text-2xl text-gray-600 font-medium">
										{day === "Sabtu" || day === "Minggu"
											? "—"
											: attendance?.checkIn && !attendance?.checkOut
											? currentTime
											: attendance?.checkOut
											? attendance.checkOut
											: "—"}
									</Text>
								</View>
							</View>
						</View>

						<View className="bg-[#cedfff] rounded-[50px] shadow shadow-gray-800 px-4 py-6">
							<View>
								<Text className="text-md text-gray-600 font-semibold tracking-wide">Presensi Masuk/Keluar</Text>
							</View>
							<Separator />
							<View className="flex-row pt-4 justify-around">
								<TouchableOpacity
									className={
										day === "Sabtu" || day === "Minggu"
											? "bg-[#e3e3e3] p-2 rounded-[30px]"
											: attendance?.checkIn
											? "bg-[#e3e3e3] p-2 rounded-[30px]"
											: "bg-[#90ee90] p-2 rounded-[30px]"
									}
									disabled={day === "Sabtu" || day === "Minggu" ? true : attendance?.checkIn ? true : false}
									onPress={async () => {
										let status: IAttendanceStatus = "hadir";
										currentTime >= company?.checkInTime! ? (status = "terlambat") : (status = "hadir");

										await postAttendance(status);

										const att = await storage.load({ key: "attendance" });
										const attData = JSON.parse(att);
										setAttendance(attData);
									}}>
									<Text className="text-gray-600 text-lg font-semibold px-9">Masuk</Text>
								</TouchableOpacity>
								<TouchableOpacity
									className={
										day === "Sabtu" || day === "Minggu"
											? "bg-[#e3e3e3] p-2 rounded-[30px]"
											: attendance?.checkIn && attendance?.checkOut
											? "bg-[#e3e3e3] p-2 rounded-[30px] invisible"
											: attendance?.checkIn
											? "bg-[#00A12D] p-2 rounded-[30px] visible"
											: "bg-[#e3e3e3] p-2 rounded-[30px]"
									}
									disabled={
										day === "Sabtu" || day === "Minggu"
											? true
											: attendance?.checkIn && attendance?.checkOut
											? true
											: attendance?.checkIn
											? false
											: true
									}
									onPress={async () => {
										await updateAttendance(attendance?.id!);

										const att = await storage.load({ key: "attendance" });
										const attData = JSON.parse(att);
										setAttendance(attData);
									}}>
									<Text className="text-black text-lg font-semibold px-9">Keluar</Text>
								</TouchableOpacity>
							</View>
						</View>
						<View className="bg-[#cedfff] rounded-[50px] shadow shadow-gray-800 px-4 py-6">
							{renderModal()}
							<View>
								<Text className="text-md text-gray-600 font-semibold tracking-wide">Pengajuan Izin Cuti</Text>
							</View>
							<Separator />
							<View className="flex-row pt-4 justify-around">
								{/* <Pressable
                  className={
                    day === "Sabtu" || day === "Minggu"
                      ? "bg-[#e3e3e3] px-8 py-2 rounded-[30px]"
                      : attendance?.checkIn
                      ? "bg-[#e3e3e3] px-8 py-2 rounded-[30px]"
                      : "bg-[#53a0ff] px-8 py-2 rounded-[30px]"
                  }
                >
                  <Text className="text-gray-600 text-lg font-semibold px-5">Sakit</Text>
                </Pressable> */}
								<Pressable
									className={
										day === "Sabtu" || day === "Minggu"
											? "bg-[#e3e3e3] px-8 py-2 rounded-[30px]"
											: activePaidLeave
											? "bg-[#e3e3e3] px-8 py-2 rounded-[30px]"
											: "bg-[#90ee90] px-8 py-2 rounded-[30px]"
									}
									onPress={() => setOpenModal(true)}>
									<Text className="text-gray-600 text-lg font-semibold px-5">Cuti</Text>
								</Pressable>
							</View>
							<View className="flex-row pt-4 justify-around">
								<View className="flex-col">
									<Text className="text-md text-gray-600 font-bold">Alasan</Text>
									<Text className="text-md text-gray-600 font-semibold">
										{activePaidLeave?.reason ? activePaidLeave.reason : "—"}
									</Text>
								</View>
								<View className="flex-col">
									<Text className="text-md text-gray-600 font-bold">Mulai</Text>
									<Text className="text-md text-gray-600 font-semibold">
										{activePaidLeave?.startDate ? activePaidLeave.startDate : "—"}
									</Text>
								</View>
								<View className="flex-col">
									<Text className="text-md text-gray-600 font-bold">Selama</Text>
									<Text className="text-md text-gray-600 font-semibold">
										{activePaidLeave?.days ? activePaidLeave.days : "—"} Hari
									</Text>
								</View>
							</View>
						</View>
					</View>
				</View>
			</View>
			<Toast />
		</ScrollView>
	);
	function renderModal() {
		return (
			<Modal visible={openModal} animationType="slide" transparent={true}>
				<View className="bg-[#f0fafd] rounded-t-[50px] h-full mt-[156] p-5 -mb-56">
					<View className="flex-row justify-between ">
						<Text className="text-gray-600 text-2xl font-bold">Pengajuan Cuti</Text>
						<TouchableOpacity onPress={() => setOpenModal(false)}>
							<FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
						</TouchableOpacity>
					</View>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View className="flex-col justify-center items-center my-5">
							{/* <Text className="text-2xl font-bold">Riwayat Presensi</Text> */}
							<View className="mt-4 w-full">
								<Text className="text-md text-gray-600 font-bold">Alasan</Text>
								<TextInput
									className="border-b-2 border-b-gray-500 text-lg py-3 "
									keyboardType="default"
									onChangeText={text => setTitle(text)}
								/>
							</View>
							<View className="mt-4 w-full">
								{/* <Text className="text-md text-gray-600 font-bold">Mulai</Text>
								<TextInput
									className="border-b-2 border-b-gray-500 text-lg py-3"
									// value={value}
									keyboardType="default"
									onChangeText={text => setStartTime(text)}
								/> */}
								<Text className="text-md text-gray-600 font-bold">Mulai Pada</Text>
								{/* day/month/year section */}
								<View className="flex-row justify-between">
									<View className="flex-col">
										<Text className="text-md text-gray-600 font-bold">Tanggal</Text>
										<TextInput
											className="border-b-2 border-b-gray-500 text-lg p-3"
											// value={dayDate.toString()}
											keyboardType="number-pad"
											onChangeText={text => setDayDate(parseInt(text))}
										/>
									</View>
									<View className="flex-col">
										<Text className="text-md text-gray-600 font-bold">Bulan</Text>
										<TextInput
											className="border-b-2 border-b-gray-500 text-lg p-3"
											// value={value}
											keyboardType="number-pad"
											onChangeText={text => setMonthDate(parseInt(text))}
										/>
									</View>
									<View className="flex-col">
										<Text className="text-md text-gray-600 font-bold">Tahun</Text>
										<TextInput
											className="border-b-2 border-b-gray-500 text-lg p-3"
											// value={value}
											keyboardType="number-pad"
											onChangeText={text => setYearDate(parseInt(text))}
										/>
									</View>
								</View>
							</View>
							<View className="mt-4 w-full">
								<Text className="text-md text-gray-600 font-bold">Selama</Text>
								<View className="flex-row">
									<TextInput
										className="border-b-2 border-b-gray-500 text-lg p-3"
										// value={value}
										keyboardType="number-pad"
										onChangeText={text => setEndTime(parseInt(text))}
									/>
									<Text className="text-md text-gray-600 font-bold mt-7">Hari</Text>
								</View>
							</View>
						</View>
						<TouchableOpacity
							onPress={async () => {
								const date =
									dayDate.toString().padStart(2, "0") +
									"-" +
									monthDate.toString().padStart(2, "0") +
									"-" +
									yearDate.toString().padStart(2, "0");

								if (date < currentDate) {
									showToast("Tanggal tidak valid");
									return;
								}

								const data: IAPIPaidLeaveData = {
									reason: title,
									startDate: date,
									days: endTime
								};
								await SendPaidLeave(data).then(res => {
									if (res instanceof AxiosError) {
										console.log(res);
									} else {
										setOpenModal(false);
									}
								});
							}}>
							<View className="bg-[#DEE9FD] rounded-full mt-6">
								<Text className="text-gray-600 px-3 py-2 font-semibold text-center text-xl">Kirim</Text>
							</View>
						</TouchableOpacity>
					</ScrollView>
				</View>
			</Modal>
		);
	}
}

const Separator = () => <View className="h-[1px] w-full bg-black"></View>;

const styles = StyleSheet.create({
	shadow: {
		shadowColor: "black",
		shadowOpacity: 1,
		elevation: 15
	}
});
