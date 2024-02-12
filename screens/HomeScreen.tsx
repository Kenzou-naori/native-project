import { getAttendances, postAttendance, updateAttendance } from "../api/attendance";
import { GetPaidLeave, GetPaidLeaves, SendPaidLeave } from "../api/paidLeave";
import { getCompany } from "../api/company";
import { showToast } from "../api/util";

import constant from "../constant/date";
import storage from "../utils/storage";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { AxiosError } from "axios";
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
	const [_, setPaidLeaves] = useState<IPaidLeave[]>([]);

	const onRefresh = useCallback(async () => {
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

							await GetPaidLeave().then(async res => {
								if (res instanceof AxiosError) {
									console.log(res.response?.data.message);
								} else {
									setActivePaidLeave(res.data.data.paidLeave);

									await GetPaidLeaves().then(res => {
										if (res instanceof AxiosError) {
											console.log(res.response?.data.message);
										} else {
											setPaidLeaves(res.data.data.paidLeaves);
											setRefreshing(false);
										}
									});
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

		async function loadDatas() {
			date = date.padStart(2, "0");
			month = (parseInt(month) + 1).toString().padStart(2, "0");
			year = year.padStart(2, "0");

			setRefreshing(true);
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

								await GetPaidLeave().then(async res => {
									if (res instanceof AxiosError) {
										console.log(res.response?.data.message);
									} else {
										setActivePaidLeave(res.data.data.paidLeave);

										await GetPaidLeaves().then(res => {
											if (res instanceof AxiosError) {
												console.log(res.response?.data.message);
											} else {
												setPaidLeaves(res.data.data.paidLeaves);
												setRefreshing(false);
											}
										});
									}
								});
							}
						});
					});
				}
			});
		}

		const intervalTD = setInterval(() => {
			loadTime();
			loadDate();
		}, 1000);

		loadDate();
		loadTime();
		loadDatas();

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
					<Image source={require("../assets/images/logo.png")} className="w-6 h-8" />
					<Text className="p-2 text-xl font-bold tracking-widest text-center text-gray-600">
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
			<View className="px-10 mt-6 mb-2">
				<View className="rounded-full bg-[#cedfff] shadow shadow-gray-800 p-4">
					<Text className="text-lg font-semibold text-gray-600">Halo,</Text>
					<Text className="text-xl font-bold text-gray-600">{fullName}</Text>
				</View>
			</View>
			<View className="p-5">
				<View className="px-5 rounded-[60px]">
					<View className="flex flex-col gap-8 justify-center">
						<View className="bg-[#cedfff] rounded-[60px] shadow shadow-gray-800 p-4">
							<View className="items-center mb-4">
								<Text className="text-3xl font-bold text-gray-600">{day},</Text>
								<Text className="text-2xl font-bold text-gray-600">{currentDate}</Text>
							</View>
							<Separator />
							<View className="flex-row justify-around">
								<View className="items-center mt-3">
									<Text className="text-lg font-bold text-gray-600">Masuk</Text>
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
								<View className="items-center mt-3">
									<Text className="text-lg font-bold text-gray-600">Keluar</Text>
									<Text className="text-2xl font-medium text-gray-600">
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
								<Text className="font-semibold tracking-wide text-gray-600 text-md">Presensi Masuk/Keluar</Text>
							</View>
							<Separator />
							<View className="flex-row justify-around pt-4">
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
									<Text className="px-9 text-lg font-semibold text-gray-600">Masuk</Text>
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
									<Text className="px-9 text-lg font-semibold text-black">Keluar</Text>
								</TouchableOpacity>
							</View>
						</View>
						<View className="bg-[#cedfff] rounded-[50px] shadow shadow-gray-800 px-4 py-6 mb-20">
							{renderModal()}
							<View>
								<Text className="font-semibold tracking-wide text-gray-600 text-md">Pengajuan Izin Cuti</Text>
							</View>
							<Separator />
							<View className="flex-row justify-around pt-4">
								<Pressable
									className={
										day === "Sabtu" || day === "Minggu"
											? "bg-[#e3e3e3] px-8 py-2 rounded-[30px]"
											: activePaidLeave
											? "bg-[#e3e3e3] px-8 py-2 rounded-[30px]"
											: "bg-[#90ee90] px-8 py-2 rounded-[30px]"
									}
									onPress={() => setOpenModal(true)}>
									<Text className="px-5 text-lg font-semibold text-gray-600">Cuti</Text>
								</Pressable>
							</View>
							<View className="flex-row justify-around pt-4">
								<View className="flex-col">
									<Text className="font-bold text-gray-600 text-md">Alasan</Text>
									<Text className="font-semibold text-gray-600 text-md">
										{activePaidLeave?.reason ? activePaidLeave.reason : "—"}
									</Text>
								</View>
								<View className="flex-col">
									<Text className="font-bold text-gray-600 text-md">Mulai</Text>
									<Text className="font-semibold text-gray-600 text-md">
										{activePaidLeave?.startDate ? activePaidLeave.startDate : "—"}
									</Text>
								</View>
								<View className="flex-col">
									<Text className="font-bold text-gray-600 text-md">Selama</Text>
									<Text className="font-semibold text-gray-600 text-md">
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
					<View className="flex-row justify-between">
						<Text className="text-2xl font-bold text-gray-600">Pengajuan Cuti</Text>
						<TouchableOpacity onPress={() => setOpenModal(false)}>
							<FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
						</TouchableOpacity>
					</View>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View className="flex-col justify-center items-center my-5">
							{/* <Text className="text-2xl font-bold">Riwayat Presensi</Text> */}
							<View className="mt-4 w-full">
								<Text className="font-bold text-gray-600 text-md">Alasan</Text>
								<TextInput
									className="py-3 text-lg border-b-2 border-b-gray-500"
									keyboardType="default"
									onChangeText={text => setTitle(text)}
								/>
							</View>
							<View className="mt-4 w-full">
								{/* <Text className="font-bold text-gray-600 text-md">Mulai</Text>
								<TextInput
									className="py-3 text-lg border-b-2 border-b-gray-500"
									// value={value}
									keyboardType="default"
									onChangeText={text => setStartTime(text)}
								/> */}
								<Text className="font-bold text-gray-600 text-md">Mulai Pada</Text>
								{/* day/month/year section */}
								<View className="flex-row justify-between">
									<View className="flex-col">
										<Text className="font-bold text-gray-600 text-md">Tanggal</Text>
										<TextInput
											className="p-3 text-lg border-b-2 border-b-gray-500"
											// value={dayDate.toString()}
											keyboardType="number-pad"
											onChangeText={text => setDayDate(parseInt(text))}
										/>
									</View>
									<View className="flex-col">
										<Text className="font-bold text-gray-600 text-md">Bulan</Text>
										<TextInput
											className="p-3 text-lg border-b-2 border-b-gray-500"
											// value={value}
											keyboardType="number-pad"
											onChangeText={text => setMonthDate(parseInt(text))}
										/>
									</View>
									<View className="flex-col">
										<Text className="font-bold text-gray-600 text-md">Tahun</Text>
										<TextInput
											className="p-3 text-lg border-b-2 border-b-gray-500"
											// value={value}
											keyboardType="number-pad"
											onChangeText={text => setYearDate(parseInt(text))}
										/>
									</View>
								</View>
							</View>
							<View className="mt-4 w-full">
								<Text className="font-bold text-gray-600 text-md">Selama</Text>
								<View className="flex-row">
									<TextInput
										className="p-3 text-lg border-b-2 border-b-gray-500"
										// value={value}
										keyboardType="number-pad"
										onChangeText={text => setEndTime(parseInt(text))}
									/>
									<Text className="mt-7 font-bold text-gray-600 text-md">Hari</Text>
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

								if (title === "") {
									showToast("Alasan tidak boleh kosong");
									return;
								} else if (date === "--") {
									showToast("Tanggal tidak boleh kosong");
									return;
								} else if (endTime === 0) {
									showToast("Lama cuti tidak boleh kosong");
									return;
								} else if (currentDate > date) {
									showToast("Tanggal tidak boleh kurang dari hari ini");
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
								<Text className="py-2 px-3 text-xl font-semibold text-center text-gray-600">Kirim</Text>
							</View>
						</TouchableOpacity>
					</ScrollView>
				</View>
			</Modal>
		);
	}
}

const Separator = () => <View className="w-full bg-black h-[1px]"></View>;

const styles = StyleSheet.create({
	shadow: {
		shadowColor: "black",
		shadowOpacity: 1,
		elevation: 15
	}
});
