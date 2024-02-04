import {
  Text,
  View,
  ScrollView,
  Button,
  Modal,
  TouchableOpacity,
  TextInput,
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





const WebAdmin = () => {
  const [showModal, setShowModal] = useState(false);
  const [showCek, setShowCek] = useState(false);

  const karyawan = [
    {
      key: 1,
      Nama: "John Doe",
      Email: "john@gmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Telpon: "+628574395734",
    },
    {
      key: 2,
      Nama: "Jane Smith",
      Email: "jane@yahoo.com",
      Tanggal_Masuk: "12 Februari 2024",
      Telpon: "+628574395735",
    },
    {
      key: 3,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Telpon: "+628774893398",
    },
    {
      key: 4,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Telpon: "+628774893398",
    },
    {
      key: 5,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Telpon: "+628774893398",
    },
    {
      key: 6,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Telpon: "+628774893398",
    },
    {
      key: 7,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Telpon: "+628774893398",
    },
    {
      key: 8,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Telpon: "+628774893398",
    },
    {
      key: 9,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Telpon: "+628774893398",
    },
    {
      key: 10,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Telpon: "+628774893398",
    },
    {
      key: 11,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Telpon: "+628774893398",
    },
    {
      key: 12,
      Nama: "Jony Killa",
      Email: "jonykilla@hotmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Telpon: "+628774893398",
    },
  ];
  const cuti = [
    {
      key: 1,
      Nama: "John Doe",
      Email: "john@gmail.com",
      Tanggal_Masuk: "12 Februari 2024",
      Status: "Belum disetujui",
      Telpon: "+628574395734",
    },
    {
      key: 2,
      Nama: "Jane Smith",
      Email: "jane@yahoo.com",
      Tanggal_Masuk: "12 Februari 2024",
      Status: "Disetujui",
      Telpon: "+628574395735",
    },
  ];
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([10, 20, 30]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, karyawan.length);
  const toi = Math.min((page + 1) * itemsPerPage, cuti.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);
  

  return (
    <ScrollView className="w-full bg-[#DEE9FD]">
      <View className="px-3 lg:px-60 py-6">
        <View className="bg-[#f1f6ff] mb-6 rounded-md shadow-lg">
          <View className="p-4">
            <View className="flex-row items-center justify-between">
              <Text className=" font-semibold">Daftar Karyawan</Text>
              <TouchableOpacity
                onPress={() => setShowModal(true)}
                className="border border-gray-600 rounded-md p-1"
              >
                <Text className="text-gray-600 font-semibold">
                  Tambah Karyawan
                </Text>
              </TouchableOpacity>
              {renderForm()}
            </View>
          </View>
            <DataTable>
                {/* <ScrollView horizontal contentContainerStyle={{ flexDirection: 'column' }}> */}

              <DataTable.Pagination
                page={page}
                numberOfPages={Math.ceil(karyawan.length / itemsPerPage)}
                onPageChange={(page) => setPage(page)}
                label={`${from + 1}-${to} of ${karyawan.length}`}
                showFastPaginationControls
                numberOfItemsPerPageList={numberOfItemsPerPageList}
                numberOfItemsPerPage={itemsPerPage}
                onItemsPerPageChange={onItemsPerPageChange}
                selectPageDropdownLabel={"Rows per page"}
                />
              <DataTable.Header>
                
                <DataTable.Title>Nama</DataTable.Title>
                <DataTable.Title>Email</DataTable.Title>
                <DataTable.Title>No. HP</DataTable.Title>
                <DataTable.Title>Aksi</DataTable.Title>
              </DataTable.Header>


              {karyawan.slice(from, to).map((karyawan) => (
                  <DataTable.Row key={karyawan.key} className="py-2 lg:py-4">
                  <DataTable.Cell>{karyawan.Nama}</DataTable.Cell>
                  <DataTable.Cell>{karyawan.Email}</DataTable.Cell>
                  <DataTable.Cell>{karyawan.Telpon}</DataTable.Cell>
                  <DataTable.Cell>
                    <View className="flex-col gap-1 lg:flex-row ">

                      <TouchableOpacity
                    //   onPress={() => setShowCek(true)}
                    className=" border border-gray-600 bg-red-200 p-3 rounded-md ">
                          <Text className="text-gray-600">Hapus</Text>
                          </TouchableOpacity>
                      <TouchableOpacity
                    //   onPress={() => setShowCek(true)}
                    className=" border border-gray-600 bg-blue-200 p-3 rounded-md">
                          <Text className="text-gray-600">Edit</Text>
                          </TouchableOpacity>
                    </View>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}

              <DataTable.Pagination
                page={page}
                numberOfPages={Math.ceil(karyawan.length / itemsPerPage)}
                onPageChange={(page) => setPage(page)}
                label={`${from + 1}-${to} of ${karyawan.length}`}
                showFastPaginationControls
                numberOfItemsPerPageList={numberOfItemsPerPageList}
                numberOfItemsPerPage={itemsPerPage}
                onItemsPerPageChange={onItemsPerPageChange}
                selectPageDropdownLabel={"Rows per page"}
                />
                {/* </ScrollView> */}
            </DataTable>
        </View>
      </View>
    </ScrollView>
  );
  function renderForm() {
      return (
      <Modal animationType="fade" transparent={true} visible={showModal}>
        <View className="items-center h-full justify-center">
          <View className="bg-[#f0fafd] rounded-2xl w-full lg:w-[40%] p-5">
            <View className="flex-row justify-between">
              <Text className="text-gray-600 text-2xl font-bold">
                Tambah Karyawan
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
              </TouchableOpacity>
            </View>
            {/* <View className="bg-[#f0fafd] rounded-t-[50px] h-full mt-[156] p-5 -mb-56"> */}
            {/* <View className="flex-row justify-between ">
						<Text className="text-gray-600 text-2xl font-bold">Tambah Tugas</Text>
						<TouchableOpacity onPress={() => setShowModal(false)}>
							<FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
						</TouchableOpacity>
					</View> */}
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="flex-col justify-center items-center my-5">
                {/* <Text className="text-2xl font-bold">Riwayat Presensi</Text> */}
                <View className="mt-4 w-full">
                  <Text className="text-md text-gray-600 font-bold">
                    Nama Lengkap
                  </Text>
                  <TextInput
                    className="border-b-2 border-b-gray-500 text-lg py-3"
                    keyboardType="default"
                    // onChangeText={text => setTitle(text)}
                  />
                </View>
                <View className="mt-4 w-full">
                  <Text className="text-md text-gray-600 font-bold">
                    Password
                  </Text>
                  <TextInput
                    className="border-b-2 border-b-gray-500 text-lg py-3"
                    // value={value}
                    // keyboardType="default"
                    // onChangeText={text => setStartTime(text)}
                  />
                </View>
                <View className="mt-4 w-full">
                  <Text className="text-md text-gray-600 font-bold">Email</Text>
                  <TextInput
                    className="border-b-2 border-b-gray-500 text-lg py-3"
                    // value={value}
                    // keyboardType="default"
                    // onChangeText={text => setEndTime(text)}
                  />
                </View>
                <View className="mt-4 w-full">
                  <Text className="text-md text-gray-600 font-bold">
                    No. HP
                  </Text>
                  <TextInput
                    className="border-b-2 border-b-gray-500 text-lg py-3"
                    // value={value}
                    // keyboardType="default"
                    // onChangeText={text => setEndTime(text)}
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={async () => {
                  setShowModal(false);

                  // const data: IScheduleData = {
                  // 	title: title,
                  // 	date: currentDate,
                  // 	startTime: startTime,
                  // 	endTime: endTime
                  // };

                  // await postSchedule(data);

                  // const schedule = await storage.load({ key: "schedule" });
                  // const scheduleData = JSON.parse(schedule);

                  // setData(scheduleData);
                }}
              >
                <View className="bg-[#DEE9FD] rounded-full mt-6">
                  <Text className="text-gray-600 px-3 py-2 font-semibold text-center text-xl">
                    Tambah
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
        {/* </View> */}
      </Modal>
    );
  }
};

export default WebAdmin;