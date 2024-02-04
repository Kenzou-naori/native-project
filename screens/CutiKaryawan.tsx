import {
    Text,
    View,
    ScrollView,
    Modal,
    TouchableOpacity,
  } from "react-native";
  
  import React, { useState} from "react";
  import {
    faSquareXmark,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
  import { PaperProvider } from 'react-native-paper';
  
  import { DataTable } from "react-native-paper";
  
  
  const WebAdmin = () => {
    const [showCek, setShowCek] = useState(false);
  
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
      {
       key: 3,
        Nama: "Jane Smith",
        Email: "jane@yahoo.com",
        Tanggal_Masuk: "12 Februari 2024",
        Status: "Disetujui",
        Telpon: "+628574395735",
      },
      {
       key: 4,
        Nama: "Jane Smith",
        Email: "jane@yahoo.com",
        Tanggal_Masuk: "12 Februari 2024",
        Status: "Disetujui",
        Telpon: "+628574395735",
      },
      {
       key: 5,
        Nama: "Jane Smith",
        Email: "jane@yahoo.com",
        Tanggal_Masuk: "12 Februari 2024",
        Status: "Disetujui",
        Telpon: "+628574395735",
      },
      {
       key: 6,
        Nama: "Jane Smith",
        Email: "jane@yahoo.com",
        Tanggal_Masuk: "12 Februari 2024",
        Status: "Disetujui",
        Telpon: "+628574395735",
      },
      {
       key: 7,
        Nama: "Jane Smith",
        Email: "jane@yahoo.com",
        Tanggal_Masuk: "12 Februari 2024",
        Status: "Disetujui",
        Telpon: "+628574395735",
      },
      {
       key: 8,
        Nama: "Jane Smith",
        Email: "jane@yahoo.com",
        Tanggal_Masuk: "12 Februari 2024",
        Status: "Disetujui",
        Telpon: "+628574395735",
      },
      {
       key: 9,
        Nama: "Jane Smith",
        Email: "jane@yahoo.com",
        Tanggal_Masuk: "12 Februari 2024",
        Status: "Disetujui",
        Telpon: "+628574395735",
      },
      {
       key: 10,
        Nama: "Jane Smith",
        Email: "jane@yahoo.com",
        Tanggal_Masuk: "12 Februari 2024",
        Status: "Disetujui",
        Telpon: "+628574395735",
      },
      {
       key: 11,
        Nama: "Jane Smith",
        Email: "jane@yahoo.com",
        Tanggal_Masuk: "12 Februari 2024",
        Status: "Disetujui",
        Telpon: "+628574395735",
      },
      {
       key: 12,
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
    const to = Math.min((page + 1) * itemsPerPage, cuti.length);
  
    React.useEffect(() => {
      setPage(0);
    }, [itemsPerPage]);
  
    return (
      <ScrollView className="w-full bg-[#DEE9FD]">
        <View className="px-3 lg:px-60 py-6">
          <View className="bg-[#f1f6ff] mb-6 rounded-md shadow-lg">
            <View className="p-4">
              <View className="flex-row items-center justify-between">
                <Text className=" font-semibold">Daftar Cuti Karyawan</Text>
              
                {renderCek()}
              </View>
            </View>
            <DataTable>
                {/* <ScrollView horizontal contentContainerStyle={{ flexDirection: 'column' }}> */}
                <DataTable.Pagination
               page={page}
               numberOfPages={Math.ceil(cuti.length / itemsPerPage)}
               onPageChange={(page) => setPage(page)}
               label={`${from + 1}-${to} of ${cuti.length}`}
               numberOfItemsPerPageList={numberOfItemsPerPageList}
               numberOfItemsPerPage={itemsPerPage}
               onItemsPerPageChange={onItemsPerPageChange}
               showFastPaginationControls
               selectPageDropdownLabel={'Rows per page'}
              />
              <DataTable.Header>
                <DataTable.Title>Nama</DataTable.Title>
                <DataTable.Title>Email</DataTable.Title>
                <DataTable.Title>Status</DataTable.Title>
                <DataTable.Title>Aksi</DataTable.Title>
              </DataTable.Header>
  
              {cuti.slice(from, to).map((cuti) => (
                <DataTable.Row key={cuti.key}  className="py-2 lg:py-4">
                  <DataTable.Cell>{cuti.Nama}</DataTable.Cell>
                  <DataTable.Cell>{cuti.Email}</DataTable.Cell>
                  <DataTable.Cell>{cuti.Status}</DataTable.Cell>
                  <DataTable.Cell>
                      <TouchableOpacity
                      onPress={() => setShowCek(true)}
                className=" border border-gray-600 bg-yellow-200 p-3 rounded-md">
                          <Text className="text-gray-600">Cek Perizinan</Text>
                          </TouchableOpacity>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
  
              <DataTable.Pagination
               page={page}
               numberOfPages={Math.ceil(cuti.length / itemsPerPage)}
               onPageChange={(page) => setPage(page)}
               label={`${from + 1}-${to} of ${cuti.length}`}
               numberOfItemsPerPageList={numberOfItemsPerPageList}
               numberOfItemsPerPage={itemsPerPage}
               onItemsPerPageChange={onItemsPerPageChange}
               showFastPaginationControls
               selectPageDropdownLabel={'Rows per page'}
              />
              {/* </ScrollView> */}
            </DataTable>
          </View>
        </View>
  
      </ScrollView>
    );
    function renderCek() {
      return (
        <Modal animationType="fade" transparent={true} visible={showCek}>
          <View className="items-center h-full justify-center">
            <View className="bg-[#f0fafd] rounded-2xl w-full lg:w-[40%] p-5">
              <View className="flex-row justify-between">
                <Text className="text-gray-600 text-2xl font-bold">
                  Tambah Karyawan
                </Text>
                <TouchableOpacity onPress={() => setShowCek(false)}>
                  <FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
                </TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
              <View className="flex-col justify-center my-5">
                          <Text className="text-2xl text-gray-600 text-center font-bold">Profile</Text>
                          <View className="mt-4">
                              <Text className="text-md text-gray-500">Nama Lengkap</Text>
                              <Text className="text-xl border-b-2 border-b-gray-500 py-2">fullName</Text>
                          </View>
                          <View className="mt-4">
                              <Text className="text-md text-gray-500">Alamat Email</Text>
                              <Text className="text-xl border-b-2 border-b-gray-500 py-2">email</Text>
                          </View>
                          <View className="mt-4">
                              <Text className="text-md text-gray-500">Nomor Telepon</Text>
                              <Text className="text-xl border-b-2 border-b-gray-500 py-2">phone</Text>
                          </View>
                          
                      </View>
                      <View className="flex justify-center items-center">
                          <TouchableOpacity
                              onPress={async () => {
                                  setShowCek(false);
                              }}
                              className="bg-[#90ee90] w-full p-3 rounded-2xl mb-3">
                              <Text className="text-xl font-bold text-gray-600 text-center">Setuju</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                              onPress={async () => {
                                  setShowCek(false);
                              }}
                              className="bg-[#DEE9FD] w-full p-3 rounded-2xl mb-3">
                              <Text className="text-xl font-bold text-gray-600 text-center">Tolak</Text>
                          </TouchableOpacity>
                      </View>
              </ScrollView>
            </View>
          </View>
          {/* </View> */}
        </Modal>
      );
    }
  };
  
  export default WebAdmin;
  