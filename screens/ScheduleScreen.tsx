import { getSchedule, postSchedule } from "../api/schedule";

import constant from "../constant/date";
import storage from "../utils/storage";

import { StyleSheet, Text, TouchableOpacity, View, Modal, ScrollView, TextInput } from "react-native";
import { faPlusSquare, faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useEffect, useState } from "react";

interface DetailScreenProps {
	navigation: any;
	value: string;
	onChangeText: (text: string) => void;
	autoCapitalize?: "none" | "sentences" | "words" | "characters";
	keyboardType?: "default" | "number-pad" | "decimal-pad" | "numeric" | "email-address" | "phone-pad";
	secureTextEntry?: boolean;
}

const DetailScreen = ({ value }: DetailScreenProps) => {
	const [title, setTitle] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [day, setDay] = useState("");
	const [currentDate, setCurrentDate] = useState("");
	const [openModal, setOpenModal] = useState(false);

	const [data, setData] = useState<ISchedule[]>([]);

	useEffect(() => {
		const d = new Date();
		let date = d.getDate().toString(); //Current Date
		let month = (d.getMonth() + 1).toString(); //Current Month
		let year = d.getFullYear().toString(); //Current Year

		async function loadDate() {
			let day = constant.weekdays[d.getDay()];
			let month = constant.months[d.getMonth()];

			setDay(day);
			setCurrentDate(date + " " + month + " " + year);
		}

		async function loadData() {
			date = date.padStart(2, "0");
			month = month.padStart(2, "0");
			year = year.padStart(2, "0");

			await getSchedule(date + "-" + month + "-" + year);
			const schedule = await storage.load({ key: "schedule" });
			if (schedule === null) return;
			try {
				const scheduleData = JSON.parse(schedule);
				setData(scheduleData);
			} catch (error) {
				console.error("Invalid JSON string:", schedule);
			}
		}

		loadDate();
		loadData();

		const intervalDate = setInterval(() => {
			loadDate();
		}, 1000);
		const intervalData = setInterval(() => {
			loadData();
		}, 1000 * 60);

		return () => {
			clearInterval(intervalDate);
			clearInterval(intervalData);
		};
	}, []);

	return (
		<View className="mt-6 bg-[#DEE9FD]">
			<View className="p-5">
				<View className="p-3 mt-3 flex flex-row items-center justify-center bg-[#DEE9FD] rounded-full shadow-xl shadow-gray-800">
					<Text className="mr-3 text-2xl font-bold text-gray-800">{day}</Text>
					<Text className="text-2xl font-bold text-gray-800">{currentDate}</Text>
				</View>
			</View>
			<View className="bg-[#f0fafd] rounded-t-[50px] h-full mt-6 p-5 -mb-56">
				{renderModal()}
				<View className="flex-row justify-between my-5">
					<Text className="text-2xl font-bold text-gray-700">Tugas hari ini</Text>
					<TouchableOpacity onPress={() => setOpenModal(true)}>
						<FontAwesomeIcon icon={faPlusSquare} size={25} color="#53a0ff" />
					</TouchableOpacity>
				</View>
				<ScrollView showsVerticalScrollIndicator={false}>
					{data.map((item, index) => (
						<View
							className="border rounded-2xl border-gray-400 p-[20] mb-[20] flex flex-col bg-[#DEE9FD]"
							key={item.id}>
							<Text className="text-2xl font-bold text-gray-600">{item.title}</Text>
							<View className="flex-row justify-end items-center mt-5">
								<Text className="text-xl font-semibold text-gray-600">{item.startTime}</Text>
								<Text>—</Text>
								<Text className="text-xl font-semibold text-gray-600">{item.endTime}</Text>
							</View>
						</View>
					))}
				</ScrollView>
			</View>
		</View>
	);

	function renderModal() {
		return (
			<Modal visible={openModal} animationType="fade" transparent={true}>
				<View className="bg-[#f0fafd] rounded-t-[50px] h-full mt-[156] p-5 -mb-56">
					<View className="flex-row justify-between">
						<Text className="text-2xl font-bold text-gray-600">Tambah Tugas</Text>
						<TouchableOpacity onPress={() => setOpenModal(false)}>
							<FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
						</TouchableOpacity>
					</View>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View className="flex-col justify-center items-center my-5">
							{/* <Text className="text-2xl font-bold">Riwayat Presensi</Text> */}
							<View className="mt-4 w-full">
								<Text className="font-bold text-gray-600 text-md">Nama Kegiatan</Text>
								<TextInput
									className="py-3 text-lg border-b-2 border-b-gray-500"
									keyboardType="default"
									onChangeText={text => setTitle(text)}
								/>
							</View>
							<View className="mt-4 w-full">
								<Text className="font-bold text-gray-600 text-md">Mulai</Text>
								<TextInput
									className="py-3 text-lg border-b-2 border-b-gray-500"
									value={value}
									keyboardType="default"
									onChangeText={text => setStartTime(text)}
								/>
							</View>
							<View className="mt-4 w-full">
								<Text className="font-bold text-gray-600 text-md">Selesai</Text>
								<TextInput
									className="py-3 text-lg border-b-2 border-b-gray-500"
									value={value}
									keyboardType="default"
									onChangeText={text => setEndTime(text)}
								/>
							</View>
						</View>
						<TouchableOpacity
							onPress={async () => {
								setOpenModal(false);

								const data: IScheduleData = {
									title: title,
									date: currentDate,
									startTime: startTime,
									endTime: endTime
								};

								await postSchedule(data);

								const schedule = await storage.load({ key: "schedule" });
								const scheduleData = JSON.parse(schedule);

								setData(scheduleData);
							}}>
							<View className="bg-[#DEE9FD] rounded-full mt-6">
								<Text className="py-2 px-3 text-xl font-semibold text-center text-gray-600">Tambah</Text>
							</View>
						</TouchableOpacity>
					</ScrollView>
				</View>
			</Modal>
		);
	}
};

const styles = StyleSheet.create({
	scrollView: {
		marginHorizontal: 20
	},
	// card: {
	// 	borderRadius: 10,
	// 	borderWidth: 1,
	// 	borderColor: "#ccc",
	// 	padding: 20,
	// 	marginBottom: 20,
	// 	backgroundColor: "#fff",
	// 	display: "flex",
	// 	flexDirection: "column"
	// },
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 10
	},
	content: {
		fontSize: 16
	},
	label: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
		marginBottom: 8
	},
	input: {
		fontSize: 18,
		color: "#333",
		borderWidth: 1,
		width: 350,
		borderColor: "#ccc",
		borderRadius: 5,
		paddingHorizontal: 16,
		paddingVertical: 12
	}
});

export default DetailScreen;
