import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  TextInput
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StatusBar } from "expo-status-bar";
import { faCaretRight, faPlusSquare, faSquareXmark } from "@fortawesome/free-solid-svg-icons";

const transparent = 'rgba(0,0,0,0.5)';



const DetailScreen = ({
  value,
  onChangeText,
  autoCapitalize = "none",
  keyboardType = "default",
  secureTextEntry = false,
}) => {
  const [openModal, setOpenModal] = React.useState(false);
 
  const [data, setData] = useState([
    {
      id: 1,
      time: "12:00",
      name: "Card Title",
      content: "Card Content",
    },
    {
      id: 2,
      time: "12:00",
      name: "Card Title",
      content: "Card Content",
    },
    {
      id: 3,
      time: "12:00",
      name: "Card Title",
      content: "Card Content",
    },
    {
      id: 4,
      time: "12:00",
      name: "Card Title",
      content: "Card Content",
    },
    {
      id: 5,
      time: "12:00",
      name: "Card Title",
      content: "Card Content",
    },
    {
      id: 6,
      time: "12:00",
      name: "Card Title",
      content: "Card Content",
    },
    {
      id: 7,
      time: "12:00",
      name: "Card Title",
      content: "Card Content",
    },
    {
      id: 8,
      time: "12:00",
      name: "Card Title",
      content: "Card Content",
    },
  ]);

  const [currentDate, setCurrentDate] = useState("");
  const weekday = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  const moon = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const d = new Date();
  let day = weekday[d.getDay()];
  // Get current date and time
  useEffect(() => {
    var date = new Date().getDate(); //Current Date
    const d = new Date();
    let month = moon[d.getMonth()];
    var year = new Date().getFullYear(); //Current Year
    setCurrentDate(date + " " + month + " " + year);
  }, []);

  return (
    <View className="mt-6 bg-[#5A9CFF]">
      <View className="p-5">
        <TouchableOpacity className="flex-row items-center">
          <View className="flex-col mr-2">
            <Text className="text-white font-bold text-2xl">{day}</Text>
            <Text className="text-white font-bold text-2xl">
             {currentDate}
            </Text>
          </View>
          <FontAwesomeIcon icon={faCaretRight} color="white" size={24} />
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
            <View style={styles.card} key={item.id}>
              <Text className="text-sm font-semibold">{item.time}</Text>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.content}>{item.content}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  function renderModal(){
    return(

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
              />
            </View>
            <View className="mt-4">
              <Text style={styles.label}>Mulai</Text>
              <TextInput
                style={styles.input}
                value={value}
                placeholder={"mulai dari kapan"}
                keyboardType="default"
              />
            </View>
            <View className="mt-4">
              <Text style={styles.label}>Selesai</Text>
              <TextInput
                style={styles.input}
                value={value}
                placeholder={"Selesai kapan"}
                keyboardType="default"
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  )
  }
}

const styles = StyleSheet.create({
  scrollView: {
    marginHorizontal: 20,
  },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 20,
    marginBottom: 20,
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "col",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    fontSize: 18,
    color: "#333",
    borderWidth: 1,
    width: 350,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});


export default DetailScreen;