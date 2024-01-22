import { StyleSheet, Text, TouchableOpacity, View, Modal, ScrollView, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StatusBar } from "expo-status-bar";
import { faCaretRight, faPlusSquare, faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import constant from "../constant/date";
import storage from "../utils/storage";
import { getSchedule, postSchedule } from "../api/schedule";

const transparent = "rgba(0,0,0,0.5)";

interface DetailScreenProps {
	navigation: any;
	value: string;
	onChangeText: (text: string) => void;
	autoCapitalize?: "none" | "sentences" | "words" | "characters";
	keyboardType?: "default" | "number-pad" | "decimal-pad" | "numeric" | "email-address" | "phone-pad";
	secureTextEntry?: boolean;
}

const DetailScreen = ({
	value,
	onChangeText,
	autoCapitalize = "none",
	keyboardType = "default",
	secureTextEntry = false
}: DetailScreenProps) => {
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

		setInterval(() => {
			loadDate();
		}, 1000);
		setInterval(() => {
			loadData();
		}, 1000 * 60);
	}, []);

	return (
		<View className="mt-6 bg-[#5A9CFF]">
			<View className="p-5">
				<TouchableOpacity className="flex-row items-center">
					<View className="flex-col mr-2">
						<Text className="text-white font-bold text-2xl">{day}</Text>
						<Text className="text-white font-bold text-2xl">{currentDate}</Text>
					</View>
				</TouchableOpacity>
			</View>
			<View className="bg-white rounded-t-3xl h-full mt-6 p-5 -mb-56">
				{renderModal()}
				<View className="flex-row justify-between my-5">
					<Text className="text-2xl font-bold">Tugas hari ini</Text>
					<TouchableOpacity onPress={() => setOpenModal(true)}>
						<FontAwesomeIcon icon={faPlusSquare} size={25} color="#5A9CFF" />
					</TouchableOpacity>
				</View>
				<ScrollView showsVerticalScrollIndicator={false}>
					{data.map((item, index) => (
						<View className="border rounded-2xl border-gray-400 p-[20] mb-[20] flex flex-col" key={item.id}>
							<Text style={styles.title}>{item.title}</Text>
						</View>
					))}
				</ScrollView>
			</View>
		</View>
	);

	function renderModal() {
		return (
			<Modal visible={openModal} animationType="fade" transparent={true}>
				<View className="bg-white rounded-t-3xl mt-[125] h-screen p-5 -mb-56">
					<View className="flex-row justify-between my-5">
						<Text className="text-2xl font-bold">Tambah Tugas</Text>
						<TouchableOpacity onPress={() => setOpenModal(false)}>
							<FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
						</TouchableOpacity>
					</View>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View className="flex-col justify-center items-center my-5">
							{/* <Text className="text-2xl font-bold">Riwayat Presensi</Text> */}
							<View className="mt-4">
								<Text style={styles.label}>Nama Kegiatan</Text>
								<TextInput
									style={styles.input}
									placeholder={"Membuat tampilan login"}
									keyboardType="default"
									onChangeText={text => setTitle(text)}
								/>
							</View>
							<View className="mt-4">
								<Text style={styles.label}>Mulai</Text>
								<TextInput
									style={styles.input}
									value={value}
									placeholder={"mulai dari kapan"}
									keyboardType="default"
									onChangeText={text => setStartTime(text)}
								/>
							</View>
							<View className="mt-4">
								<Text style={styles.label}>Selesai</Text>
								<TextInput
									style={styles.input}
									value={value}
									placeholder={"Selesai kapan"}
									keyboardType="default"
									onChangeText={text => setEndTime(text)}
								/>
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
								<View className="bg-[#5A9CFF] rounded-lg mt-6 p-2">
									<Text className="text-white text-center font-semibold text-lg">Tambah</Text>
								</View>
							</TouchableOpacity>
						</View>
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
