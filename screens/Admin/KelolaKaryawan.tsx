import { CreateUser, DeleteUser, GetUsers, UpdateUser } from "../../api/admin";
import { getCompany } from "../../api/company";

import storage from "../../utils/storage";

import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { DataTable } from "react-native-paper";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Pressable,
} from "react-native";

import Spinner from "react-native-loading-spinner-overlay";
import Ionicons from "react-native-vector-icons/Ionicons";

const KelolaKaryawan = () => {
  const [showDeleteConfrim, setShowDeleteConfrim] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [karyawan, setKaryawan] = useState<IUser[]>([]);
  const [totalKaryawan, setTotalKaryawan] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [karyawanId, setKaryawanId] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [page, setPage] = useState(0);
  
  const { colorScheme, toggleColorScheme } = useColorScheme();
  
  const from = page * 25;
  const to = Math.min((page + 1) * 25, totalKaryawan);

  const toggleDropdown = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    setPage(0);

    async function loadKaryawan() {
      setLoading(true);
      const karyawan = await GetUsers(page + 1);
      if (karyawan instanceof AxiosError) {
        console.log(karyawan);
      } else {
        setKaryawan(karyawan.data.data.users);
        setTotalKaryawan(karyawan.data.data.total);
        await storage.save({
          key: "karyawan",
          data: karyawan.data.data.users,
        });
      }
      setLoading(false);
    }

    async function loadIpAddresses() {
      setLoading(true);
      const company = await getCompany();
      if (company instanceof AxiosError) {
        console.log(company);
      } else {
        await storage.save({
          key: "ipAddresses",
          data: JSON.stringify(company.data.data.company.ipAddresses),
        });
      }
      setLoading(false);
    }

    loadIpAddresses();
    loadKaryawan();
  }, []);

  function sortAscending() {
    let temp = [...karyawan];

    temp.sort((a: IUser, b: IUser) => {
      if (a.created_at < b.created_at) {
        return 1;
      } else if (a.created_at > b.created_at) {
        return -1;
      }
      return 0;
    });
    setKaryawan(temp);
    console.log(temp);
  }
  function sortDescending() {
    let temp = [...karyawan];

    temp.sort((a: IUser, b: IUser) => {
      if (a.created_at < b.created_at) {
        return -1;
      } else if (a.created_at > b.created_at) {
        return 1;
      }
      return 0;
    });
    setKaryawan(temp);
    console.log(temp);
  }
  function sortAZ() {
    let temp = [...karyawan];

    temp.sort((a: IUser, b: IUser) => {
      if (a.fullName < b.fullName) {
        return -1;
      } else if (a.fullName > b.fullName) {
        return 1;
      }
      return 0;
    });
    setKaryawan(temp);
    console.log(temp);
  }
  function sortZA() {
    let temp = [...karyawan];

    temp.sort((a: IUser, b: IUser) => {
      if (a.fullName < b.fullName) {
        return 1;
      } else if (a.fullName > b.fullName) {
        return -1;
      }
      return 0;
    });
    setKaryawan(temp);
    console.log(temp);
  }
  function renderDropdown() {
    if (visible) {
      return (
        <View
          className="absolute top-10 float-right w-48 flex-col rounded-lg bg-white shadow-lg"
          style={{ elevation: 999, zIndex: 999 }}
        >
          <TouchableOpacity
            onPress={() => {
              toggleDropdown();
              sortAZ();
            }}
            className="border-b-gray-3 v00 border-b py-4"
          >
            <Text className="px-2">A-Z</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              toggleDropdown();
              sortZA();
            }}
            className="border-b-gray-3 v00 border-b py-4"
          >
            <Text className="px-2">Z-A</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              toggleDropdown();
              sortAscending();
            }}
            className="border-b-gray-3 v00 border-b py-4"
          >
            <Text className="px-2">Terbaru</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              toggleDropdown();
              sortDescending();
            }}
            className="border-b-gray-3 v00 border-b py-4"
          >
            <Text className="px-2">Terlama</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
  return (
    <ScrollView className="w-full bg-[#DEE9FD] dark:bg-[#212121]">
      <Spinner visible={loading} textContent={"Loading..."} />
      <View className="px-3 py-6 lg:px-10 xl:px-24 2xl:px-60">
        <View className="flex-row">
          <View className="w-[60%] flex-row flex-wrap gap-4 py-4">
            <View className="mb-[20] mt-4 w-[45%] flex-row items-center rounded-2xl border border-gray-400 bg-[#f1f6ff] p-[20] dark:bg-[#3a3a3a] dark:shadow-white lg:w-[247px]">
              <Ionicons size={32} color= 
              {colorScheme === "dark"
                      ? "#DEE9FD"
                      : colorScheme == "light"
                        ? "#212121"
                        : "DEE9FD"}  name="people-outline" />
              <View className="ml-4 flex-col">
                <Text className="text-2xl font-bold text-gray-600 dark:text-neutral-300">
                  {totalKaryawan}
                </Text>
                <Text className="text-xl font-semibold text-gray-600 dark:text-neutral-300">
                  Karyawan
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="flex-row">
          <TouchableOpacity
            onPress={async () => {
              setLoading(true);
              const karyawan = await GetUsers(page + 1);
              if (karyawan instanceof AxiosError) {
                console.log(karyawan);
              } else {
                setKaryawan(karyawan.data.data.users);
                setTotalKaryawan(karyawan.data.data.total);
                await storage.save({
                  key: "karyawan",
                  data: karyawan.data.data.users,
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
        <View className="mb-6 rounded-md bg-[#f1f6ff] shadow-lg dark:bg-[#3a3a3a] dark:shadow-white">
          <View className="p-4" style={{ elevation: 10, zIndex: 10 }}>
            <View className="flex-row items-center justify-between">
              <Text className="font-semibold text-gray-600 dark:text-neutral-300">
                Daftar Karyawan
              </Text>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={toggleDropdown}
                  className=" rounded-md border border-gray-600 p-1"
                >
                  {renderDropdown()}
                  <View className="flex-row items-center justify-end">
                    <Text className="font-semibold text-gray-600 dark:text-neutral-300">
                      Sort By
                    </Text>
                    <Ionicons
                      name="chevron-down-outline"
                      size={18}
                      color="gray"
                    />
                  </View>
                </Pressable>
                <TouchableOpacity
                  onPress={() => setShowModal(true)}
                  className="rounded-md border border-gray-600 p-1"
                >
                  <Text className="font-semibold text-gray-600 dark:text-neutral-300">
                    Tambah Karyawan
                  </Text>
                </TouchableOpacity>
              </View>
              {renderForm()}
            </View>
          </View>

          <DataTable>
            <DataTable.Header>
              <DataTable.Title
                textStyle={{
                  color:
                    colorScheme === "dark"
                      ? "#DEE9FD"
                      : colorScheme == "light"
                        ? "#212121"
                        : "DEE9FD",
                }}
              >
                Nama
              </DataTable.Title>
              <DataTable.Title
                textStyle={{
                  color:
                    colorScheme === "dark"
                      ? "#DEE9FD"
                      : colorScheme == "light"
                        ? "#212121"
                        : "DEE9FD",
                }}
              >
                Email
              </DataTable.Title>
              <DataTable.Title
                textStyle={{
                  color:
                    colorScheme === "dark"
                      ? "#DEE9FD"
                      : colorScheme == "light"
                        ? "#212121"
                        : "DEE9FD",
                }}
              >
                No. HP
              </DataTable.Title>
              <DataTable.Title
                textStyle={{
                  color:
                    colorScheme === "dark"
                      ? "#DEE9FD"
                      : colorScheme == "light"
                        ? "#212121"
                        : "DEE9FD",
                }}
              >
                Tipe
              </DataTable.Title>
              <DataTable.Title
                textStyle={{
                  color:
                    colorScheme === "dark"
                      ? "#DEE9FD"
                      : colorScheme == "light"
                        ? "#212121"
                        : "DEE9FD",
                }}
              >
                Aksi
              </DataTable.Title>
            </DataTable.Header>

            {karyawan.length === 0 && (
              <DataTable.Row>
                <DataTable.Cell
                  textStyle={{
                    color:
                      colorScheme === "dark"
                        ? "#DEE9FD"
                        : colorScheme == "light"
                          ? "#212121"
                          : "DEE9FD",
                  }}
                >
                  No data
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={{
                    color:
                      colorScheme === "dark"
                        ? "#DEE9FD"
                        : colorScheme == "light"
                          ? "#212121"
                          : "DEE9FD",
                  }}
                >
                  No data
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={{
                    color:
                      colorScheme === "dark"
                        ? "#DEE9FD"
                        : colorScheme == "light"
                          ? "#212121"
                          : "DEE9FD",
                  }}
                >
                  No data
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={{
                    color:
                      colorScheme === "dark"
                        ? "#DEE9FD"
                        : colorScheme == "light"
                          ? "#212121"
                          : "DEE9FD",
                  }}
                >
                  No data
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={{
                    color:
                      colorScheme === "dark"
                        ? "#DEE9FD"
                        : colorScheme == "light"
                          ? "#212121"
                          : "DEE9FD",
                  }}
                >
                  No data
                </DataTable.Cell>
              </DataTable.Row>
            )}

            {karyawan.map((karyawan) => (
              <DataTable.Row key={karyawan.id} className="py-2 lg:py-4">
                <DataTable.Cell
                  textStyle={{
                    color:
                      colorScheme === "dark"
                        ? "#DEE9FD"
                        : colorScheme == "light"
                          ? "#212121"
                          : "DEE9FD",
                  }}
                >
                  {karyawan.fullName}
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={{
                    color:
                      colorScheme === "dark"
                        ? "#DEE9FD"
                        : colorScheme == "light"
                          ? "#212121"
                          : "DEE9FD",
                  }}
                >
                  {karyawan.email}
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={{
                    color:
                      colorScheme === "dark"
                        ? "#DEE9FD"
                        : colorScheme == "light"
                          ? "#212121"
                          : "DEE9FD",
                  }}
                >
                  {karyawan.phone}
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={{
                    color:
                      colorScheme === "dark"
                        ? "#DEE9FD"
                        : colorScheme == "light"
                          ? "#212121"
                          : "DEE9FD",
                  }}
                >
                  {karyawan.accessLevel === 1
                    ? "Admin"
                    : karyawan.accessLevel === 2
                      ? "HRD"
                      : "Karyawan"}
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={{
                    color:
                      colorScheme === "dark"
                        ? "#DEE9FD"
                        : colorScheme == "light"
                          ? "#212121"
                          : "DEE9FD",
                  }}
                >
                  <View className="flex-col gap-1 lg:flex-row">
                    <TouchableOpacity
                      onPress={() => {
                        setKaryawanId(karyawan.id);

                        setShowDeleteConfrim(true);
                      }}
                      className="rounded-md border border-gray-600 bg-red-200 p-3"
                    >
                      <Text className="text-gray-600">Hapus</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setKaryawanId(karyawan.id);
                        setFullName(karyawan.fullName);
                        setEmail(karyawan.email);
                        setPhone(karyawan.phone);

                        setShowUpdateModal(true);
                      }}
                      className="rounded-md border border-gray-600 bg-blue-200 p-3"
                    >
                      <Text className="text-gray-600">Edit</Text>
                    </TouchableOpacity>
                  </View>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
            {renderUpdateForm()}
            {renderDeleteConfrim()}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(totalKaryawan / 25)}
              onPageChange={async (page) => {
                setLoading(true);
                setPage(page);
                await GetUsers(page + 1);
                const karyawan = await storage.load({ key: "karyawan" });
                const karyawanData: IUser[] = JSON.parse(karyawan);
                const totalKaryawan = await storage.load({
                  key: "totalKaryawan",
                });
                setTotalKaryawan(parseInt(totalKaryawan));
                setKaryawan(karyawanData);
                setLoading(false);
              }}
              label={`${from + 1}-${to} of ${totalKaryawan}`}
              showFastPaginationControls
              numberOfItemsPerPage={25}
              selectPageDropdownRippleColor={"white"}
              dropdownItemRippleColor={'white'}
              paginationControlRippleColor={'white'}
            />
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
              <Text className="text-2xl font-bold text-gray-600 dark:text-neutral-300">
                Tambah Karyawan
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
              </TouchableOpacity>
            </View>
            {/* <View className="bg-[#f0fafd] rounded-t-[50px] h-full mt-[156] p-5 -mb-56"> */}
            {/* <View className="flex-row justify-between">
						<Text className="text-2xl font-bold text-gray-600 dark:text-neutral-300">Tambah Tugas</Text>
						<TouchableOpacity onPress={() => setShowModal(false)}>
							<FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
						</TouchableOpacity>
					</View> */}
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="my-5 flex-col items-center justify-center">
                {/* <Text className="text-2xl font-bold">Riwayat Presensi</Text> */}
                <View className="mt-4 w-full">
                  <Text className="text-md font-bold text-gray-600 dark:text-neutral-300">
                    Nama Lengkap
                  </Text>
                  <TextInput
                    className="border-b-2 border-b-gray-500 py-3 text-lg"
                    keyboardType="default"
                    onChangeText={(text) => setFullName(text)}
                  />
                </View>
                <View className="mt-4 w-full">
                  <Text className="text-md font-bold text-gray-600 dark:text-neutral-300">
                    Password
                  </Text>
                  <TextInput
                    className="border-b-2 border-b-gray-500 py-3 text-lg"
                    // value={value}
                    // keyboardType="default"
                    onChangeText={(text) => setPassword(text)}
                  />
                </View>
                <View className="mt-4 w-full">
                  <Text className="text-md font-bold text-gray-600 dark:text-neutral-300">
                    Email
                  </Text>
                  <TextInput
                    className="border-b-2 border-b-gray-500 py-3 text-lg"
                    // value={value}
                    // keyboardType="default"
                    onChangeText={(text) => setEmail(text)}
                  />
                </View>
                <View className="mt-4 w-full">
                  <Text className="text-md font-bold text-gray-600 dark:text-neutral-300">
                    No. HP
                  </Text>
                  <TextInput
                    className="border-b-2 border-b-gray-500 py-3 text-lg"
                    // value={value}
                    // keyboardType="default"
                    onChangeText={(text) => setPhone(text)}
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={async () => {
                  setShowModal(false);

                  const data: IUserData = {
                    fullName: fullName,
                    email: email,
                    phone: phone,
                    password: password,
                  };

                  const newKaryawan = await CreateUser(data);

                  if (newKaryawan instanceof AxiosError) {
                    console.log(newKaryawan);
                  } else {
                    setKaryawan([...karyawan, newKaryawan.data.data.user]);

                    await storage.save({
                      key: "karyawan",
                      data: karyawan,
                    });
                  }
                }}
              >
                <View className="mt-6 rounded-full bg-[#DEE9FD]">
                  <Text className="px-3 py-2 text-center text-xl font-semibold text-gray-600 dark:text-neutral-300">
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
  function renderUpdateForm() {
    return (
      <Modal animationType="fade" transparent={true} visible={showUpdateModal}>
        <View className="h-full items-center justify-center">
          <View className="w-full rounded-2xl bg-[#f0fafd] p-5 lg:w-[40%]">
            <View className="flex-row justify-between">
              <Text className="text-2xl font-bold text-gray-600 dark:text-neutral-300">
                Edit Karyawan
              </Text>
              <TouchableOpacity onPress={() => setShowUpdateModal(false)}>
                <FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="my-5 flex-col items-center justify-center">
                {/* <Text className="text-2xl font-bold">Riwayat Presensi</Text> */}
                <View className="mt-4 w-full">
                  <Text className="text-md font-bold text-gray-600 dark:text-neutral-300">
                    Nama Lengkap
                  </Text>
                  <TextInput
                    defaultValue={fullName}
                    className="border-b-2 border-b-gray-500 py-3 text-lg"
                    keyboardType="default"
                    onChangeText={(text) => setFullName(text)}
                  />
                </View>
                <View className="mt-4 w-full">
                  <Text className="text-md font-bold text-gray-600 dark:text-neutral-300">
                    Email
                  </Text>
                  <TextInput
                    className="border-b-2 border-b-gray-500 py-3 text-lg"
                    // value={value}
                    // keyboardType="default"
                    defaultValue={email}
                    onChangeText={(text) => setEmail(text)}
                  />
                </View>
                <View className="mt-4 w-full">
                  <Text className="text-md font-bold text-gray-600 dark:text-neutral-300">
                    No. HP
                  </Text>
                  <TextInput
                    className="border-b-2 border-b-gray-500 py-3 text-lg"
                    // value={value}
                    // keyboardType="default"
                    defaultValue={phone}
                    onChangeText={(text) => setPhone(text)}
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={async () => {
                  setShowUpdateModal(false);
                  setLoading(true);
                  const data: IUserData = {
                    fullName: fullName,
                    email: email,
                    phone: phone,
                    password: password,
                  };

                  const updatedKaryawan = await UpdateUser(karyawanId, data);

                  if (updatedKaryawan instanceof AxiosError) {
                    console.log(updatedKaryawan);
                  } else {
                    const index = karyawan.findIndex(
                      (k) => k.id === updatedKaryawan.data.data.user.id,
                    );
                    karyawan[index] = updatedKaryawan.data.data.user;

                    setKaryawan(karyawan);

                    await storage.save({
                      key: "karyawan",
                      data: karyawan,
                    });
                  }
                  setLoading(false);
                }}
              >
                <View className="mt-6 rounded-full bg-[#DEE9FD]">
                  <Text className="px-3 py-2 text-center text-xl font-semibold text-gray-600 dark:text-neutral-300">
                    Submit
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
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
              <Text className="text-2xl font-bold text-gray-600 dark:text-neutral-300">
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
                  const res = await DeleteUser(karyawanId);

                  if (res instanceof AxiosError) {
                    console.log(res);
                  } else {
                    setKaryawan(res.data.data.users);

                    await storage.save({
                      key: "karyawan",
                      data: karyawan,
                    });
                  }
                }}
              >
                <View className="mt-6 rounded-full bg-[#fddede]">
                  <Text className="px-3 py-2 text-center text-xl font-semibold text-gray-600 dark:text-neutral-300">
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
  TextLight: {
    color: "gray",
  },
  TextDark: {
    color: "white",
  },
});

export default KelolaKaryawan;
