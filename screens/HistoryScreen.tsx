import { capitalizeFirstLetter, formatDate } from "../api/util";
import { getAttendances } from "../api/attendance";

import { getCompany } from "../api/company";
import storage from "../utils/storage";

import { StyleSheet, Text, View, RefreshControl, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useColorScheme } from "nativewind";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AxiosError } from "axios";

export default function HistoryScreen({ navigation }: any)  {
	const [attendances, setAttendances] = useState<IAttendance[]>([]);
	const [company, setCompany] = useState<ICompany | null>(null);

	const [refreshing, setRefreshing] = useState(false);
	const {colorScheme, toggleColorScheme} = useColorScheme();

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
		await storage.load({ key: "attendances" }).then(attendances => {
			setRefreshing(true);
			const attendancesData = JSON.parse(attendances);
			setAttendances(attendancesData);
			setRefreshing(false);
		});
		
		setRefreshing(false);
	}, []);

	

	useEffect(() => {
		async function loadDatas() {

			setRefreshing(true);
			const attendances = await storage.load({ key: "attendances" });
			const attendancesData = JSON.parse(attendances);

			setAttendances(attendancesData);
			setRefreshing(false);

						await getCompany().then(async res => {
							if (res instanceof AxiosError) {
								console.log(res);
							} else {
								setCompany(res.data.data.company);

							}
						});

				}
				loadDatas();
	}, []);

	return (
		<View className="mt-6 bg-[#DEE9FD] dark:bg-[#212121]">
			<View className="flex-row justify-between px-5">
			<View className="p-2 w-16 mx-auto mt-5 flex flex-row justify-center items-center bg-[#DEE9FD] dark:bg-[#3a3a3a] rounded-full shadow-md shadow-gray-800 dark:shadow-white">
					{/* <Switch value={colorScheme =='dark'} onChange={toggleColorScheme}/> */}
					<TouchableOpacity onPress={toggleColorScheme}>
					<Ionicons size={32} color={colorScheme === "dark" 
				? "#DEE9FD" 
				: colorScheme == "light" 
				? "#212121"
				: "DEE9FD"} name={colorScheme === "light" 
				? "sunny-outline" 
				: colorScheme == "dark" 
				? "moon-outline"
				: "sunny-outline"} />

					</TouchableOpacity>
				</View>
				<View className="p-2 w-48 mx-auto mt-5 flex flex-row justify-center items-center bg-[#cedfff] dark:bg-[#3a3a3a] rounded-full shadow-md shadow-gray-800 dark:shadow-white ">
					<Image source={require("../assets/images/logo.png")} className="w-6 h-8" />
					<Text className="p-2 text-xl font-bold tracking-widest text-center  text-gray-600 dark:text-neutral-300">
						{company?.name ? company.name : ""}
					</Text>
				</View>
				{/* logout */}
				<View className="p-2 w-16 mx-auto mt-5 flex flex-row justify-center items-center bg-[#DEE9FD] dark:bg-[#3a3a3a] rounded-full shadow-md shadow-gray-800 dark:shadow-white ">
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
			<View className="bg-[#f0fafd] dark:bg-[#3a3a3a] rounded-t-[50px] h-full mt-6 p-5">
				<View className="flex-row my-5">
					<Text className="text-2xl dark:text-neutral-300 font-bold">Riwayat Presensi</Text>
				</View>
				<View
					//   showsVerticalScrollIndicator={false}
					className=" pb-72 h-screen">
					<FlatList
						data={attendances}
						renderItem={({ item }) => {
							return (
								<View
									key={item.id}
									className=" rounded-xl border border-[#ccc] p-[20] mb-2 bg-[#DEE9FD] dark:bg-[#212121] flex justify-between items-center flex-row">
									<View>
										<Text className="text-2xl font-bold text-gray-600 dark:text-neutral-300 ">
											{capitalizeFirstLetter(item.status)}
										</Text>
										<Text style={styles.content} className="dark:text-neutral-300 ">{formatDate(item.date)}</Text>
									</View>
									<Text className="text-sm font-semibold dark:text-neutral-300 ">
										{item.checkIn} - {item.checkOut}
									</Text>
								</View>
							);
						}}
						ItemSeparatorComponent={() => <View className="h-4" />}
						ListEmptyComponent={<Text>Kamu belum melakukan presensi</Text>}
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
