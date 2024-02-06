import { StyleSheet, Text, View, ScrollView, RefreshControl, FlatList, ActivityIndicator, FlatListComponent } from "react-native";
import React, { useEffect, useState } from "react";
import { getAttendances } from "../api/attendance";
import storage from "../utils/storage";
import { capitalizeFirstLetter, formatDate } from "../api/util";

export default function HistoryScreen() {
	const [attendances, setAttendances] = useState<IAttendance[]>([]);
	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = React.useCallback(async () => {
		setRefreshing(true);
		const d = new Date();
		let date = d.getDate().toString(); //Current Date
		let month = d.getMonth().toString(); //Current Month
		let year = d.getFullYear().toString(); //Current Year

		date = date.padStart(2, "0");
		month = month.padStart(2, "0");
		year = year.padStart(2, "0");

		await getAttendances(date + "-" + month + "-" + year);
		await storage.load({ key: "attendances" }).then((attendances) => {
			setRefreshing(true);
			const attendancesData = JSON.parse(attendances);
			setAttendances(attendancesData);
			setRefreshing(false);
		});
		setRefreshing(false);
	}, []);

	useEffect(() => {
		async function loadAttendances() {
			setRefreshing(true);
			const attendances = await storage.load({ key: "attendances" });
			const attendancesData = JSON.parse(attendances);

			setAttendances(attendancesData);
			setRefreshing(false);
		}

		loadAttendances();
	}, []);

	return (
		<View className="mt-6 bg-[#DEE9FD]">
			<View className="bg-[#f0fafd] rounded-t-[50px] h-full mt-6 p-5">
				<View className="flex-row justify-between my-5">
					<Text className="text-2xl font-bold">Riwayat Presensi</Text>
				</View>
				<View
					//   showsVerticalScrollIndicator={false}
					className="h-screen pb-52">
					<FlatList
						data={attendances}
						renderItem={({ item }) => {
							return (
								<View
									key={item.id}
									className=" rounded-xl border border-[#ccc] p-[20] mb-2 bg-[#DEE9FD] flex justify-between items-center flex-row">
									<View>
										<Text className="text-2xl text-gray-600 font-bold">
											{capitalizeFirstLetter(item.status)}
										</Text>
										<Text style={styles.content}>{formatDate(item.date)}</Text>
									</View>
									<Text className="text-sm font-semibold">
										{item.checkIn} - {item.checkOut}
									</Text>
								</View>
							);
						}}
						ItemSeparatorComponent={() => <View className=" h-4" />}
						ListEmptyComponent={<Text>Kamu belum melakukan presensi</Text>}
						refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
					/>
					{/* {attendances.map((item, index) =>
						item.checkOut ? (
							<View
								key={item.id}
								className=" rounded-xl border border-[#ccc] p-[20] mb-[20] bg-[#DEE9FD] flex justify-between items-center flex-row">
								<View>
									<Text className="text-2xl text-gray-600 font-bold">{capitalizeFirstLetter(item.status)}</Text>
									<Text style={styles.content}>{formatDate(item.date)}</Text>
								</View>
								<Text className="text-sm font-semibold">
									{item.checkIn} - {item.checkOut}
								</Text>
							</View>
						) : null
						)} */}
				</View>
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
	}
});
