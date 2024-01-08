import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import React, { useState } from "react";

export default function HistoryScreen() {
  const [data, setData] = useState([
    {
      id: 1,
      date: "Rabu, 29 Nov 2023",
      name: "Card Title",
      content: "Card Content",
    },
    {
      id: 2,
      date: "Rabu, 29 Nov 2023",
      name: "Card Title",
      content: "Card Content",
    },
    {
      id: 3,
      date: "Rabu, 29 Nov 2023",
      name: "Card Title",
      content: "Card Content",
    },
    {
      id: 4,
      date: "Rabu, 29 Nov 2023",
      name: "Card Title",
      content: "Card Content",
    },
    {
      id: 5,
      date: "Rabu, 29 Nov 2023",
      name: "Card Title",
      content: "Card Content",
    },
    {
      id: 6,
      date: "Rabu, 29 Nov 2023",
      name: "Card Title",
      content: "Card Content",
    },
    {
      id: 7,
      date: "Rabu, 29 Nov 2023",
      name: "Card Title",
      content: "Card Content",
    },
    {
      id: 8,
      date: "Rabu, 29 Nov 2023",
      name: "Card Title",
      content: "Card Content",
    },
  ]);

  
  return (
    <View className="mt-6 bg-[#5A9CFF]">
      <View className="bg-white rounded-t-3xl h-full mt-6 p-5 -mb-6">
        <View className="flex-row justify-between my-5">
          <Text className="text-2xl font-bold">Riwayat Presensi</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {data.map((item, index) => (
            <View
              style={styles.card}
              key={item.id}
              className=" rounded-xl border border-[#ccc] p-[20] mb-[20] bg-white flex justify-between items-center flex-row"
            >
              {/* <FontAwesomeIcon icon={faHome} size={24} style={styles.icon} /> */}
              <View>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.content}>{item.content}</Text>
              </View>
              <Text className="text-sm font-semibold">{item.date}</Text>
            </View>
          ))}
        </ScrollView>
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
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
