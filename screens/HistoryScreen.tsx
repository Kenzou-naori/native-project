import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  FlatList,
  ActivityIndicator,
  FlatListComponent,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getAttendances } from "../api/attendance";
import storage from "../utils/storage";
import { capitalizeFirstLetter, formatDate } from "../api/util";

export default function HistoryScreen() {
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setIsLoadong] = useState(false);

  

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
      setIsLoadong(false);
    }

    const interval = setInterval(() => {
      loadAttendances();
    }, 1000 * 1);

    return () => clearInterval(interval);
  }, []);
  const handleRefresh = () => {
	setRefreshing(true)
	// loadAttendances();
	setRefreshing(false)
  }

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" color="000ff" />
        <Text>Loading....</Text>
      </View>
    );
  }
  return (
    <View className="mt-6 bg-[#DEE9FD]">
      <View className="bg-[#f0fafd] rounded-t-[50px] h-full mt-6 p-5">
        <View className="flex-row justify-between my-5">
          <Text className="text-2xl font-bold">Riwayat Presensi</Text>
        </View>
        <View
        //   showsVerticalScrollIndicator={false}
		className="h-screen pb-52"
        >
          <FlatList
            data={attendances}
            renderItem={({ item }) => {
              return (
                <View
                  key={item.id}
                  className=" rounded-xl border border-[#ccc] p-[20] mb-2 bg-[#DEE9FD] flex justify-between items-center flex-row"
                >
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
			ItemSeparatorComponent={()=> (
				<View
				className=" h-4"
				/>
			)}
			ListEmptyComponent={<Text>Kamu belum melakukan presensi</Text>}
			refreshing={refreshing}
			onRefresh={handleRefresh}
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
    marginHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
  },
});
