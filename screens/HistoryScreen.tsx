import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { getAttendances } from "../api/attendance";
import storage from "../utils/storage";
import { capitalizeFirstLetter, formatDate } from "../api/util";

export default function HistoryScreen() {
	const [attendances, setAttendances] = useState<IAttendance[]>([]);

	useEffect(() => {
		const d = new Date();
		let date = d.getDate().toString().padStart(2, "0"); //Current Date
		let month = (d.getMonth() + 1).toString().padStart(2, "0"); //Current Month
		let year = d.getFullYear().toString().padStart(2, "0"); //Current Year

		async function loadAttendances() {
			await getAttendances(date + "-" + month + "-" + year);
			const attendances = await storage.load({ key: "attendances" });
			const attendancesData = JSON.parse(attendances);

			setAttendances(attendancesData);
		}

		const interval = setInterval(() => {
			loadAttendances();
		}, 1000 * 30);

		return () => clearInterval(interval);
	}, []);

	return (
		<View className="mt-6 bg-[#5A9CFF]">
			<View className="bg-white rounded-t-3xl h-full mt-6 p-5 -mb-6">
				<View className="flex-row justify-between my-5">
					<Text className="text-2xl font-bold">Riwayat Presensi</Text>
				</View>
				<ScrollView showsVerticalScrollIndicator={false}>
					{attendances.map((item, index) =>
						item.checkOut ? (
							<View
								key={item.id}
								className=" rounded-xl border border-[#ccc] p-[20] mb-[20] bg-white flex justify-between items-center flex-row">
								{/* <FontAwesomeIcon icon={faHome} size={24} style={styles.icon} /> */}
								<View>
									<Text style={styles.title}>{capitalizeFirstLetter(item.status)}</Text>
									<Text style={styles.content}>{formatDate(item.date)}</Text>
								</View>
								<Text className="text-sm font-semibold">
									{item.checkIn} - {item.checkOut}
								</Text>
							</View>
						) : null
					)}
				</ScrollView>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	scrollView: {
		marginHorizontal: 20
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 10
	},
	content: {
		fontSize: 16
	},
	// card: {
	// 	borderRadius: 20,
	// 	padding: 20,
	// 	marginBottom: 20,
	// 	backgroundColor: "white",
	// 	flexDirection: "row",
	// 	justifyContent: "space-between",
	// 	alignItems: "center",
	// 	borderWidth: 1,
	// 	borderColor: "#ccc"
	// }
});
