import { GetPaidLeaves } from "../api/paidLeave";
import { formatISODate } from "../api/util";

import storage from "../utils/storage";

import { StyleSheet, Text, View, RefreshControl, FlatList } from "react-native";
import { useCallback, useEffect, useState } from "react";

export default function HistoryScreen() {
	const [paidLeaves, setPaidLeaves] = useState<IPaidLeave[]>([]);
	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		const d = new Date();
		let date = d.getDate().toString(); //Current Date
		let month = d.getMonth().toString(); //Current Month
		let year = d.getFullYear().toString(); //Current Year

		date = date.padStart(2, "0");
		month = month.padStart(2, "0");
		year = year.padStart(2, "0");

		await GetPaidLeaves();
		await storage.load({ key: "paidLeaves" }).then(res => {
			setPaidLeaves(JSON.parse(res));
			setRefreshing(false);
		});
	}, []);

	useEffect(() => {
		async function loadPaidLeaves() {
			setRefreshing(true);
			await storage.load({ key: "paidLeaves" }).then(res => {
				setPaidLeaves(JSON.parse(res));
				setRefreshing(false);
			});
		}

		loadPaidLeaves();
	}, []);

	return (
		<View className="mt-6 bg-[#DEE9FD]">
			<View className="bg-[#f0fafd] rounded-t-[50px] h-full mt-6 p-5">
				<View className="flex-row justify-between my-5">
					<Text className="text-2xl font-bold">Riwayat Pengajuan Cuti</Text>
				</View>
				<View
					//   showsVerticalScrollIndicator={false}
					className="pb-52 h-screen">
					<FlatList
						data={paidLeaves}
						renderItem={({ item }) => {
							return (
								<View
									key={item.id}
									className=" rounded-xl border border-[#ccc] p-[20] mb-2 bg-[#DEE9FD] flex justify-between items-center flex-row">
									<View>
										<Text className="text-2xl font-bold text-gray-600">
											{item.status === 0 ? "Pending" : item.status === 1 ? "Diterima" : "Ditolak"}
										</Text>
										<Text style={styles.content}>{formatISODate(item.startDate)}</Text>
									</View>
									<Text className="text-sm font-semibold">{item.days} Hari</Text>
								</View>
							);
						}}
						ItemSeparatorComponent={() => <View className="h-4" />}
						ListEmptyComponent={<Text>Kamu belum pernah melakukan pengajuan cuti</Text>}
						refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
					/>
					{/* {attendances.map((item, index) =>
						item.checkOut ? (
							<View
								key={item.id}
								className=" rounded-xl border border-[#ccc] p-[20] mb-[20] bg-[#DEE9FD] flex justify-between items-center flex-row">
								<View>
									<Text className="text-2xl font-bold text-gray-600">{capitalizeFirstLetter(item.status)}</Text>
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
