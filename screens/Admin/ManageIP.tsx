import { UpdateIPAddresses } from "../../api/admin";
import { getCompany } from "../../api/company";

import storage from "../../utils/storage";

import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { DataTable } from "react-native-paper";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";

import Spinner from "react-native-loading-spinner-overlay";
import Ionicons from "react-native-vector-icons/Ionicons";

const ManageIP = () => {
  const [loading, setLoading] = useState(false);
  const [showDeleteConfrim, setShowDeleteConfrim] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [ipAddresses, setIpAddresses] = useState<string[]>([]);
  const [newIpAddress, setNewIpAddress] = useState<string>("");
  const [ipAddress, setIpAddress] = useState<string>("");

  useEffect(() => {
    async function loadIpAddresses() {
      setLoading(true);
      const ipAddresses = await storage.load({ key: "ipAddresses" });
      if (ipAddresses) {
        setIpAddresses(JSON.parse(ipAddresses));
      }
      setLoading(false);
    }
    loadIpAddresses();
  }, []);

  return (
    <ScrollView className="w-full bg-[#DEE9FD]">
      <Spinner visible={loading} textContent={"Loading..."} />
      <View className="px-3 py-6 lg:px-10 xl:px-24 2xl:px-60">
        <View className="flex-row">
          <TouchableOpacity
            onPress={async () => {
              setLoading(true);
              const company = await getCompany();
              if (company instanceof AxiosError) {
                console.log(company);
              } else {
                setIpAddresses(company.data.data.company.ipAddresses);
                await storage.save({
                  key: "ipAddresses",
                  data: JSON.stringify(company.data.data.company.ipAddresses),
                });
              }
              setLoading(false);
            }}
            className="my-4 w-32 rounded-md bg-blue-500 p-3"
          >
            <Text className="text-center text-white">
              <Ionicons color="white" name="refresh-circle-outline" size={17} />
              Refresh
            </Text>
          </TouchableOpacity>
        </View>
        <View className="mb-6 rounded-md bg-[#f1f6ff] shadow-lg">
          <View className="p-4" style={{ elevation: 10, zIndex: 10 }}>
            <View className="flex-row items-center justify-between">
              <Text className="font-semibold">Daftar Alamat IP</Text>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => setShowModal(true)}
                  className="rounded-md border border-gray-600 p-1"
                >
                  <Text className="font-semibold text-gray-600">
                    Tambah Alamat IP
                  </Text>
                </TouchableOpacity>
              </View>
              {renderForm()}
            </View>
          </View>

          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Alamat IP</DataTable.Title>
              <DataTable.Title numeric>Aksi</DataTable.Title>
            </DataTable.Header>

            {ipAddresses.length === 0 && (
              <DataTable.Row>
                <DataTable.Cell>No data</DataTable.Cell>
                <DataTable.Cell>No data</DataTable.Cell>
              </DataTable.Row>
            )}

            {ipAddresses.map((ip) => (
              <DataTable.Row key={ip} className="py-2 lg:py-4">
                <DataTable.Cell>{ip}</DataTable.Cell>
                <DataTable.Cell numeric>
                  <View className="flex-col gap-1 lg:flex-row">
                    <TouchableOpacity
                      onPress={() => {
                        setIpAddress(ip);

                        setShowDeleteConfrim(true);
                      }}
                      className="rounded-md border border-gray-600 bg-red-200 p-3"
                    >
                      <Text className="text-gray-600">Hapus</Text>
                    </TouchableOpacity>
                  </View>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
            {renderDeleteConfrim()}
          </DataTable>
        </View>
        <View className="mb-6 rounded-md bg-[#f1f6ff] shadow-lg">
          <View className="p-4" style={{ elevation: 10, zIndex: 10 }}>
            <View className="flex-row items-center justify-between">
              <Text className="font-semibold">Daftar Kordinat Lokasi</Text>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => setShowModal(true)}
                  className="rounded-md border border-gray-600 p-1"
                >
                  <Text className="font-semibold text-gray-600">
                    Tambah Lokasi
                  </Text>
                </TouchableOpacity>
              </View>
              {renderForm()}
            </View>
          </View>

          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Kordinat Lokasi</DataTable.Title>
              <DataTable.Title numeric>Aksi</DataTable.Title>
            </DataTable.Header>

            {ipAddresses.length === 0 && (
              <DataTable.Row>
                <DataTable.Cell>No data</DataTable.Cell>
                <DataTable.Cell>No data</DataTable.Cell>
              </DataTable.Row>
            )}

            {ipAddresses.map((ip) => (
              <DataTable.Row key={ip} className="py-2 lg:py-4">
                <DataTable.Cell>{ip}</DataTable.Cell>
                <DataTable.Cell numeric>
                  <View className="flex-col gap-1 lg:flex-row">
                    <TouchableOpacity
                      onPress={() => {
                        setIpAddress(ip);

                        setShowDeleteConfrim(true);
                      }}
                      className="rounded-md border border-gray-600 bg-red-200 p-3"
                    >
                      <Text className="text-gray-600">Hapus</Text>
                    </TouchableOpacity>
                  </View>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
            {renderDeleteConfrim()}
          </DataTable>
        </View>
      </View>
    </ScrollView>
  );
  function renderForm() {
    return (
      <Modal animationType="fade" transparent={true} visible={showModal}>
        <View className="h-full items-center justify-center">
          <View className="w-full rounded-2xl bg-[#f0fafd] p-5 lg:w-[40%]">
            <View className="flex-row justify-between">
              <Text className="text-2xl font-bold text-gray-600">
                Tambah Alamat Lokasi
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
              </TouchableOpacity>
            </View>
            {/* <View className="bg-[#f0fafd] rounded-t-[50px] h-full mt-[156] p-5 -mb-56"> */}
            {/* <View className="flex-row justify-between">
						<Text className="text-2xl font-bold text-gray-600">Tambah Tugas</Text>
						<TouchableOpacity onPress={() => setShowModal(false)}>
							<FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
						</TouchableOpacity>
					</View> */}
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="my-5 flex-col items-center justify-center">
                {/* <Text className="text-2xl font-bold">Riwayat Presensi</Text> */}
                <View className="mt-4 w-full">
                  <Text className="text-md font-bold text-gray-600">
                    Alamat IP
                  </Text>
                  <TextInput
                    className="border-b-2 border-b-gray-500 py-3 text-lg"
                    // value={value}
                    // keyboardType="default"
                    onChangeText={(text) => setNewIpAddress(text)}
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={async () => {
                  setShowModal(false);
                  setLoading(true);
                  ipAddresses.push(newIpAddress);
                  setIpAddresses(ipAddresses);
                  await UpdateIPAddresses(ipAddresses);
                  await storage.save({
                    key: "ipAddresses",
                    data: JSON.stringify(ipAddresses),
                  });
                  setLoading(false);
                }}
              >
                <View className="mt-6 rounded-full bg-[#DEE9FD]">
                  <Text className="px-3 py-2 text-center text-xl font-semibold text-gray-600">
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
  function renderDeleteConfrim() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteConfrim}
      >
        <View className="h-full items-center justify-center">
          <View className="w-full rounded-2xl bg-[#f0fafd] p-5 lg:w-[40%]">
            <View className="flex-row justify-between">
              <Text className="text-2xl font-bold text-gray-600">
                Apakah anda yakin?
              </Text>
              <TouchableOpacity onPress={() => setShowDeleteConfrim(false)}>
                <FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={async () => {
                  setShowDeleteConfrim(false);
                  setLoading(true);
                  ipAddresses.splice(ipAddresses.indexOf(ipAddress), 1);
                  setIpAddresses(ipAddresses);
                  await UpdateIPAddresses(ipAddresses);
                  await storage.save({
                    key: "ipAddresses",
                    data: JSON.stringify(ipAddresses),
                  });
                  setLoading(false);
                }}
              >
                <View className="mt-6 rounded-full bg-[#fddede]">
                  <Text className="px-3 py-2 text-center text-xl font-semibold text-gray-600">
                    Yakin
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
};

const styles = StyleSheet.create({
  //
});

export default ManageIP;
