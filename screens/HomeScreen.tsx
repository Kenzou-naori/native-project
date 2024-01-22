import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import constant from "../constant/date";
import { getCompany } from "../api/company";
import storage from "../utils/storage";
import { getAttendances, postAttendance, updateAttendance } from "../api/attendance";

export default function HomeScreen() {
	const [day, setDay] = useState("");
	const [currentDate, setCurrentDate] = useState("");
	const [currentTime, setCurrentTime] = useState("");

	const [company, setCompany] = useState<ICompany | null>(null);
	const [attendance, setAttendance] = useState<IAttendance | null>(null);

	useEffect(() => {
		const d = new Date();
		let date = d.getDate().toString(); //Current Date
		let month = d.getMonth().toString(); //Current Month
		let year = d.getFullYear().toString(); //Current Year

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
			month = month.padStart(2, "0");
			year = year.padStart(2, "0");

			await getAttendances(date + "-" + month + "-" + year);
			const attendance = await storage.load({ key: "attendance" });
			const attendanceData = JSON.parse(attendance);

			setAttendance(attendanceData);
		}

		const intervalTD = setInterval(() => {
			loadTime();
			loadDate();
		}, 1000);

		const intervalAC = setInterval(() => {
			loadAttendance();
			loadCompany();
		}, 1000 * 60);

		loadDate();
		loadTime();
		loadCompany();
		loadAttendance();

		return () => {
			clearInterval(intervalTD);
			clearInterval(intervalAC);
		};
	}, []);

	return (
		<View className="mt-6">
			<StatusBar backgroundColor="#5A9CFF" style="light" />
			<View className="flex-row justify-between items-center bg-[#5A9CFF] p-5">
				<Text className="text-white text-xl font-bold">{company?.name ? company.name : ""}</Text>
			</View>

			<View className="flex flex-col gap-4 mt-6 p-5">
				<View className="bg-white rounded-lg shadow-lg shadow-blue-200 p-4">
					<View className=" items-center mb-4">
						<Text className="text-3xl font-bold">{day},</Text>
						<Text className="text-2xl font-bold">{currentDate}</Text>
					</View>
					<Separator />
					<View className="flex-row justify-center gap-32">
						<View className="flex-row gap-2 mt-3">
							<View>
								<Text className="text-lg text-black font-bold">Masuk</Text>
								<Text
									className={
										day === "Sabtu" || day === "Minggu"
											? "text-2xl text-gray-600 font-medium"
											: currentTime >= company?.checkInTime!
											? "text-red-500 text-2xl font-medium"
											: "text-2xl text-gray-600 font-medium"
									}>
									{day === "Sabtu" || day === "Minggu"
										? "-"
										: attendance?.checkIn
										? attendance.checkIn
										: currentTime}
								</Text>
							</View>
						</View>
						<View className="flex-row gap-2 mt-3">
							<View>
								<Text className="text-lg text-black font-bold">Keluar</Text>
								<Text className="text-2xl text-gray-600 font-medium">
									{day === "Sabtu" || day === "Minggu"
										? "-"
										: attendance?.checkIn && !attendance?.checkOut
										? currentTime
										: attendance?.checkOut
										? attendance.checkOut
										: "-"}
								</Text>
							</View>
						</View>
					</View>
				</View>

				<View className="bg-white rounded-lg shadow-lg shadow-blue-200 p-4">
					<View>
						<Text className="text-md font-normal tracking-wide">Presensi Masuk/Keluar</Text>
					</View>
					<Separator />
					<View className="flex-row pt-4 justify-between">
						<Pressable
							className={
								day === "Sabtu" || day === "Minggu"
									? "bg-[#e3e3e3] p-2 rounded-lg"
									: attendance?.checkIn
									? "bg-[#e3e3e3] p-2 rounded-lg"
									: "bg-[#00A12D] p-2 rounded-lg"
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
							<Text className="text-white text-lg ">Presensi Masuk</Text>
						</Pressable>
						<Pressable
							className={
								day === "Sabtu" || day === "Minggu"
									? "bg-[#e3e3e3] p-2 rounded-lg"
									: attendance?.checkIn && attendance?.checkOut
									? "bg-[#e3e3e3] p-2 rounded-lg"
									: attendance?.checkIn
									? "bg-[#00A12D] p-2 rounded-lg"
									: "bg-[#e3e3e3] p-2 rounded-lg"
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
							<Text className="text-white text-lg">Presensi Keluar</Text>
						</Pressable>
					</View>
				</View>
				<View className="bg-white rounded-lg shadow-lg shadow-blue-200 p-4">
					<View>
						<Text className="text-md font-normal tracking-wide">Pengajuan Izin Sakit/Cuti</Text>
					</View>
					<Separator />
					<View className="flex-row pt-4 justify-between">
						<Pressable
							className={
								day === "Sabtu" || day === "Minggu"
									? "bg-[#e3e3e3] px-8 py-2 rounded-lg"
									: attendance?.checkIn
									? "bg-[#e3e3e3] px-8 py-2 rounded-lg"
									: "bg-[#3170E8] px-8 py-2 rounded-lg"
							}>
							<Text className="text-white text-lg ">Izin Sakit</Text>
						</Pressable>
						<Pressable
							className={
								day === "Sabtu" || day === "Minggu"
									? "bg-[#e3e3e3] px-8 py-2 rounded-lg"
									: attendance?.checkIn
									? "bg-[#e3e3e3] px-8 py-2 rounded-lg"
									: "bg-[#3170E8] px-8 py-2 rounded-lg"
							}>
							<Text className="text-white text-lg">Izin Cuti</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</View>
	);
}

const Separator = () => <View className="h-[1px] w-full bg-black"></View>;
