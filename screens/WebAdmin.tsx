import {
  Text,
  View,
  ScrollView,
  Button,
  Modal,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Calendar } from "react-native-calendars";
import {
  faCaretRight,
  faPlusSquare,
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { DataTable } from "react-native-paper";
import { createDrawerNavigator } from "@react-navigation/drawer";
import SettingsScreen from "../screens/HistoryScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HistoryScreen from "../screens/HistoryScreen";

const Drawer = createDrawerNavigator();

const WebAdmin = () => {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState("");
  const [state, setState] = useState({
    fromDate: "",
    toDate: "",
    dateError: "hghg",
  });

  const karyawan = [
    {
      key: 1,
      Nama: "John Doe",
      Email: "john@gmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Status: "Hadir",
      Telpon: "+628574395734",
    },
    {
      key: 2,
      Nama: "Jane Smith",
      Email: "jane@yahoo.com",
      Tanggal_Masuk: "12 Februari 2024",
      Status: "Terlambat",
      Telpon: "+628574395735",
    },
    {
      key: 3,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Status: "Hadir",
      Telpon: "+628774893398",
    },
    {
      key: 4,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Status: "Hadir",
      Telpon: "+628774893398",
    },
    {
      key: 5,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Status: "Hadir",
      Telpon: "+628774893398",
    },
    {
      key: 6,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Status: "Hadir",
      Telpon: "+628774893398",
    },
    {
      key: 7,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Status: "Hadir",
      Telpon: "+628774893398",
    },
    {
      key: 8,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Status: "Hadir",
      Telpon: "+628774893398",
    },
    {
      key: 9,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Status: "Hadir",
      Telpon: "+628774893398",
    },
    {
      key: 10,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Status: "Hadir",
      Telpon: "+628774893398",
    },
    {
      key: 11,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Status: "Hadir",
      Telpon: "+628774893398",
    },
    {
      key: 12,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Status: "Hadir",
      Telpon: "+628774893398",
    },
    {
      key: 13,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Status: "Hadir",
      Telpon: "+628774893398",
    },
    {
      key: 14,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Status: "Hadir",
      Telpon: "+628774893398",
    },
    {
      key: 15,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Status: "Hadir",
      Telpon: "+628774893398",
    },
    {
      key: 16,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Status: "Hadir",
      Telpon: "+628774893398",
    },
    {
      key: 17,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Status: "Hadir",
      Telpon: "+628774893398",
    },
    {
      key: 18,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Status: "Hadir",
      Telpon: "+628774893398",
    },
    {
      key: 19,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Status: "Hadir",
      Telpon: "+628774893398",
    },
    {
      key: 20,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Status: "Hadir",
      Telpon: "+628774893398",
    },
    {
      key: 21,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Status: "Hadir",
      Telpon: "+628774893398",
    },
    {
      key: 22,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Status: "Hadir",
      Telpon: "+628774893398",
    },
  ];

  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([10, 20, 30]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, karyawan.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  return (
    <ScrollView className="w-full bg-[#DEE9FD]">
      {/* <View className=" absolute w-48 h-96 bg-white p-3 my-36">
            <Text>hllo</Text>
          </View> */}
      <View className="p-6 lg:px-60  py-6">
        <View>
          <Text className="text-3xl mb-3 font-bold">Halo, Naufal</Text>
        </View>
        <View className="flex-row flex-wrap gap-4 ">
          <View className="border rounded-2xl border-gray-400 w-[45%] lg:w-[247px]  p-[20] mb-[20] mt-4 flex-row bg-[#f1f6ff]">
            <Ionicons size={32} color="black" name="people-outline" />
            <View className="flex-col ml-4">
              <Text className="text-2xl text-gray-600 font-bold">0</Text>
              <Text className="text-xl text-gray-600 font-semibold">
                Karyawan
              </Text>
            </View>
          </View>
          <View className="border rounded-2xl border-gray-400 w-[45%] lg:w-[247px]  p-[20] mb-[20] mt-4 flex-row bg-[#f1f6ff]">
            <Ionicons size={32} color="black" name="location-outline" />
            <View className="flex-col ml-4">
              <Text className="text-2xl text-gray-600 font-bold">0</Text>
              <Text className="text-xl text-gray-600 font-semibold">
                Presensi
              </Text>
            </View>
          </View>
          <View className="border rounded-2xl border-gray-400 w-[45%] lg:w-[247px]  p-[20] mb-[20] mt-4 flex-row bg-[#f1f6ff]">
            <Ionicons size={32} color="black" name="hand-left-outline" />
            <View className="flex-col ml-4">
              <Text className="text-2xl text-gray-600 font-bold">0</Text>
              <Text className="text-xl text-gray-600 font-semibold">Izin</Text>
            </View>
          </View>
          <View className="border rounded-2xl border-gray-400 w-[45%] lg:w-[247px]  p-[20] mb-[20] mt-4 flex-row bg-[#f1f6ff]">
            <Ionicons size={32} color="black" name="walk-outline" />
            <View className="flex-col ml-4">
              <Text className="text-2xl text-gray-600 font-bold">0</Text>
              <Text className="text-xl text-gray-600 font-semibold">Cuti</Text>
            </View>
          </View>
        </View>
        <View className="bg-[#f1f6ff] rounded-md shadow-lg">
          <View className="p-8 ">
            <View className="flex-row items-center justify-between">
              <Text className=" font-semibold">Presensi Kehadiran</Text>
              <TouchableOpacity
                onPress={() => setShowModal(true)}
                className="border border-gray-600 rounded-md p-1"
              >
                <Text className="text-gray-600 font-semibold">
                  Pilih Tanggal
                </Text>
              </TouchableOpacity>
              {renderCalendar()}
            </View>
          </View>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Nama</DataTable.Title>
              <DataTable.Title>Email</DataTable.Title>
              <DataTable.Title>No. HP</DataTable.Title>
              <DataTable.Title>Presensi</DataTable.Title>
              <DataTable.Title>Status</DataTable.Title>
            </DataTable.Header>

            {karyawan.slice(from, to).map((karyawan) => (
              <DataTable.Row key={karyawan.key}>
                <DataTable.Cell>{karyawan.Nama}</DataTable.Cell>
                <DataTable.Cell>{karyawan.Email}</DataTable.Cell>
                <DataTable.Cell>{karyawan.Telpon}</DataTable.Cell>
                <DataTable.Cell>{karyawan.Tanggal_Masuk}</DataTable.Cell>
                <DataTable.Cell>{karyawan.Status}</DataTable.Cell>
              </DataTable.Row>
            ))}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(karyawan.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${karyawan.length}`}
              numberOfItemsPerPageList={numberOfItemsPerPageList}
              numberOfItemsPerPage={itemsPerPage}
              onItemsPerPageChange={onItemsPerPageChange}
              showFastPaginationControls
              selectPageDropdownLabel={"Rows per page"}
            />
          </DataTable>
        </View>
      </View>

      <View></View>
    </ScrollView>
  );
  function renderCalendar() {
    return (
      <Modal animationType="fade" transparent={true} visible={showModal}>
        <View className="items-center h-full justify-center">
          <View className="bg-[#f0fafd] rounded-2xl w-full lg:w-[40%]p-5">
            <View className="flex-row justify-between">
              <Text className="text-gray-600 text-2xl font-bold">
                Pilih Tanggal
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
              </TouchableOpacity>
            </View>
            <Calendar
              onSuccess={(start: any, end: any) =>
                setState({
                  ...state,
                  fromDate: start,
                  toDate: end,
                  dateError: "",
                })
              }
              errorMesaage={state?.dateError}
              hideArrows={false}
              style={{
                borderWidth: 1,
                borderColor: "gray",
                marginHorizontal: 50,
                marginVertical: 10,
              }}
              theme={{
                backgroundColor: "#ffffff",
                calendarBackground: "#ffffff",
                textSectionTitleColor: "#b6c1cd",
                selectedDayBackgroundColor: "#00adf5",
                selectedDayTextColor: "black",
                todayTextColor: "#00adf5",
                dayTextColor: "#2d4150",
                textDisabledColor: "#d9e",
              }}
              onDayPress={(day) => {
                setSelected(day.dateString);
                console.log("selected day", day);
              }}
              markingType={"period"}
              markedDates={{
                [selected]: {
                  marked: true,
                  selected: true,
                  disableTouchEvent: true,
                  selectedColor: "blue",
                  selectedTextColor: "white",
                },
                "2024-02-22": {
                  startingDay: true,
                  color: "blue",
                  textColor: "white",
                },
                "2024-02-23": {
                  selected: true,
                  endingDay: true,
                  color: "blue",
                  textColor: "white",
                },
              }}
            />
            <View className="flex-row gap-2 justify-end items-end">
              <TouchableOpacity className=" bg-blue-500 rounded-full w-20 p-2 ">
                <Text className="text-white text-center">Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity className=" bg-gray-500 rounded-full w-20 p-2 ">
                <Text className="text-white text-center">Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
};

export default WebAdmin;
