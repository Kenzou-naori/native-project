// api import
import {
  getAttendances,
  postAttendance,
  updateAttendance,
} from "../../api/attendance";
import { GetPaidLeave, GetPaidLeaves, SendPaidLeave } from "../../api/paidLeave";
import { getCompany } from "../../api/company";
import { showToast } from "../../api/util";
import constant from "../../constant/date";
import storage from "../../utils/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';

// end api import

// frontend import
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { AxiosError } from "axios";
import { useColorScheme } from "nativewind";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  RefreshControl,
  Button,
} from "react-native";

import Toast from "react-native-toast-message";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker';

// end frontend import

const saveTheme = async ({theme}:any) => {
  try {
    await AsyncStorage.setItem('theme', theme); // Store theme as string
  } catch (error) {
    console.error('Error saving theme:', error);
  }
};

const loadTheme = async () => {
  try {
    const storedTheme = await AsyncStorage.getItem('theme');
    return storedTheme || 'dark'; // Return theme or default (e.g., 'dark')
  } catch (error) {
    console.error('Error loading theme:', error);
    return 'dark';
  }
};
// HomeScreen
export default function HomeScreen({ navigation }: any) {
  const [day, setDay] = useState("");
  const [title, setTitle] = useState("");
  const [dayDate, setDayDate] = useState(0);
  const [monthDate, setMonthDate] = useState(0);
  const [yearDate, setYearDate] = useState(0);
  const [endTime, setEndTime] = useState(1);
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openSakit, setOpenSakit] = useState(false);
  const [company, setCompany] = useState<ICompany | null>(null);
  const [attendance, setAttendance] = useState<IAttendance | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activePaidLeave, setActivePaidLeave] = useState<IPaidLeave | null>(
    null,
  );
  const [_, setPaidLeaves] = useState<IPaidLeave[]>([]);
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [image, setImage] = useState<string | null>(null);
  const [storedTheme, setStoredTheme] = useState(null); // Initialize stored theme

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('darkTheme');
        setStoredTheme(storedTheme || 'light'); // Use default 'light' if no value found
      } catch (error) {
        console.error('Error fetching stored theme:', error);
      }
    };

    fetchTheme();
  }, []); // Load theme on component mount

  const updateThemeAndStorage = async (newColorScheme:any) => {
    try {
      await AsyncStorage.setItem('darkTheme', newColorScheme);
      setStoredTheme(newColorScheme);
      toggleColorScheme(); // Update current theme using nativewind's functionality
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      // aspect: [3, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) { // Use "canceled" here
      setImage(result.assets[0].uri);
    }
  };

  // When refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const d = new Date();

    setDayDate(d.getDate());
    setMonthDate(d.getMonth() + 1);
    setYearDate(d.getFullYear());

    let date = d.getDate().toString(); //Current Date
    let month = (d.getMonth() + 1).toString(); //Current Month
    let year = d.getFullYear().toString(); //Current Year

    date = date.padStart(2, "0");
    month = month.padStart(2, "0");
    year = year.padStart(2, "0");

    await getAttendances(date + "-" + month + "-" + year).then(async (res) => {
      if (res instanceof AxiosError) {
        console.log(res.response);
      } else {
        await storage.load({ key: "attendance" }).then(async (res) => {
          const attendancesData = JSON.parse(res);
          setAttendance(attendancesData);

          await getCompany().then(async (res) => {
            if (res instanceof AxiosError) {
              console.log(res);
            } else {
              setCompany(res.data.data.company);

              await GetPaidLeave().then(async (res) => {
                if (res instanceof AxiosError) {
                  console.log(res.response?.data.message);
                } else {
                  setActivePaidLeave(res.data.data.paidLeave);

                  await GetPaidLeaves().then((res) => {
                    if (res instanceof AxiosError) {
                      console.log(res.response?.data.message);
                    } else {
                      setPaidLeaves(res.data.data.paidLeaves);
                      setRefreshing(false);
                    }
                  });
                }
              });
            }
          });
        });
      }
    });
  }, []);
  // end refresh
  // loadDatas
  useEffect(() => {
    const d = new Date();
    let date = d.getDate().toString(); //Current Date
    let month = d.getMonth().toString(); //Current Month
    let year = d.getFullYear().toString(); //Current Year

    setDayDate(d.getDate());
    setMonthDate(d.getMonth() + 1);
    setYearDate(d.getFullYear());

    async function loadDate() {
      let day = constant.weekdays[d.getDay()];
      let month = constant.months[d.getMonth()];

      setDay(day);
      setCurrentDate(date + " " + month + " " + year);
    }

    async function loadTime() {
      const d = new Date();
      let hours = d.getHours().toString().padStart(2, "0");
      let minutes = d.getMinutes().toString().padStart(2, "0");
      let seconds = d.getSeconds().toString().padStart(2, "0");

      setCurrentTime(hours + ":" + minutes + ":" + seconds);
    }

    async function loadDatas() {
      date = date.padStart(2, "0");
      month = (parseInt(month) + 1).toString().padStart(2, "0");
      year = year.padStart(2, "0");

      setRefreshing(true);
      await getAttendances(date + "-" + month + "-" + year).then(
        async (res) => {
          if (res instanceof AxiosError) {
            console.log(res.response);
          } else {
            await storage.load({ key: "attendance" }).then(async (res) => {
              const attendancesData = JSON.parse(res);
              setAttendance(attendancesData);

              await getCompany().then(async (res) => {
                if (res instanceof AxiosError) {
                  console.log(res);
                } else {
                  setCompany(res.data.data.company);

                  await GetPaidLeave().then(async (res) => {
                    if (res instanceof AxiosError) {
                      console.log(res.response?.data.message);
                    } else {
                      setActivePaidLeave(res.data.data.paidLeave);

                      await GetPaidLeaves().then((res) => {
                        if (res instanceof AxiosError) {
                          console.log(res.response?.data.message);
                        } else {
                          setPaidLeaves(res.data.data.paidLeaves);
                          setRefreshing(false);
                        }
                      });
                    }
                  });
                }
              });
            });
          }
        },
      );
    }

    const intervalTD = setInterval(() => {
      loadTime();
      loadDate();
    }, 1000);

    loadDate();
    loadTime();
    loadDatas();

    return () => {
      clearInterval(intervalTD);
    };
  }, []);
  // end load datas
  const [fullName, setFullName] = useState("");
  useEffect(() => {
    const getUserData = async () => {
      const dataString = await storage.load({ key: "user" });
      const data = JSON.parse(dataString);
      setFullName(data.fullName);
    };

    getUserData();
  }, []);

  return (
    <View className=" h-full bg-[#DEE9FD] dark:bg-[#212121]">
      <StatusBar
        backgroundColor={
          colorScheme === "light"
            ? "#DEE9FD"
            : colorScheme == "dark"
              ? "#212121"
              : "DEE9FD"
        }
        style={colorScheme === "dark" ? "light" : "dark"}
      />
      <View className="mt-6 flex-row justify-between px-5">
        <View className="mx-auto mt-5 flex w-16 flex-row items-center justify-center rounded-full bg-[#DEE9FD] p-2 shadow-md shadow-gray-800 dark:bg-[#3a3a3a] dark:shadow-white">
          {/* <Switch value={colorScheme =='dark'} onChange={toggleColorScheme}/> */}
          <TouchableOpacity onPress={() => updateThemeAndStorage(storedTheme === 'dark' ? 'light' : 'dark')}>
            <Ionicons
              size={32}
              color={
                colorScheme === "dark"
                  ? "#DEE9FD"
                  : colorScheme == "light"
                    ? "#212121"
                    : "DEE9FD"
              }
              name={
                colorScheme === "light"
                  ? "sunny-outline"
                  : colorScheme == "dark"
                    ? "moon-outline"
                    : "sunny-outline"
              }
            />
          </TouchableOpacity>
        </View>
        <View className="mx-auto mt-5 flex w-48 flex-row items-center justify-center rounded-full bg-[#cedfff] p-2 shadow-md shadow-gray-800 dark:bg-[#3a3a3a] dark:shadow-white ">
          <Image
            source={require("../../assets/images/logo.png")}
            className="h-8 w-6"
          />
          <Text className="p-2 text-center text-xl font-bold tracking-widest  text-gray-600 dark:text-neutral-300">
            {company?.name ? company.name : ""}
          </Text>
        </View>
        {/* logout */}
        <View className="mx-auto mt-5 flex w-16 flex-row items-center justify-center rounded-full bg-[#DEE9FD] p-2 shadow-md shadow-gray-800 dark:bg-[#3a3a3a] dark:shadow-white ">
          <TouchableOpacity
            onPress={async () => {
              await storage.remove({ key: "user" });
              await storage.remove({ key: "token" });
              await storage.remove({ key: "attendance" });
              await storage.remove({ key: "attendances" });
              await storage.remove({ key: "paidLeaves" });
              await storage.save({ key: "isLoggedin", data: false });

              navigation.navigate("Login");
            }}
          >
            <Ionicons size={32} color="red" name="log-out-outline" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        className="mt-2 h-full bg-[#DEE9FD] dark:bg-[#212121]"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className=" mb-2 mt-2 px-8">
          <View className="rounded-[30px] bg-[#cedfff] p-4 shadow-md shadow-gray-800 dark:bg-[#3a3a3a] dark:shadow-white">
            <Text className="text-lg font-semibold  text-gray-600 dark:text-neutral-300">
              Halo,
            </Text>
            <Text className="text-xl font-bold  text-gray-600 dark:text-neutral-300">
              {fullName}
            </Text>
          </View>
        </View>
        <View className="p-2">
          <View className="rounded-[60px] px-5">
            <View className="flex flex-col justify-center gap-8">
              <View className="rounded-[60px] bg-[#cedfff]  p-4 shadow shadow-gray-800 dark:bg-[#3a3a3a] dark:shadow-white">
                <View className="mb-4 items-center">
                  <Text className="text-3xl font-bold  text-gray-600 dark:text-neutral-300">
                    {day},
                  </Text>
                  <Text className="text-2xl font-bold  text-gray-600 dark:text-neutral-300">
                    {currentDate}
                  </Text>
                </View>
                <Separator />
                <View className="flex-row justify-around">
                  <View className="mt-3 items-center">
                    <Text className="text-lg font-bold  text-gray-600 dark:text-neutral-300">
                      Masuk
                    </Text>
                    <Text
                      className={
                        day === "Sabtu" || day === "Minggu"
                          ? "text-2xl  font-medium text-gray-600 dark:text-neutral-300"
                          : currentTime >= company?.checkInTime!
                            ? "text-2xl font-medium text-red-500"
                            : "text-2xl  font-medium text-gray-600 dark:text-neutral-300"
                      }
                    >
                      {day === "Sabtu" || day === "Minggu"
                        ? "—"
                        : attendance?.checkIn
                          ? attendance.checkIn
                          : currentTime}
                    </Text>
                  </View>
                  <View className="mt-3 items-center">
                    <Text className="text-lg font-bold  text-gray-600 dark:text-neutral-300">
                      Keluar
                    </Text>
                    <Text className="text-2xl font-medium  text-gray-600 dark:text-neutral-300">
                      {day === "Sabtu" || day === "Minggu"
                        ? "—"
                        : attendance?.checkIn && !attendance?.checkOut
                          ? currentTime
                          : attendance?.checkOut
                            ? attendance.checkOut
                            : "—"}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="rounded-[50px] bg-[#cedfff]  px-4 py-6 shadow shadow-gray-800 dark:bg-[#3a3a3a] dark:shadow-white">
                <View>
                  <Text className="text-md font-semibold  tracking-wide text-gray-600 dark:text-neutral-300">
                    Presensi Masuk/Keluar
                  </Text>
                </View>
                <Separator />
                <View className="flex-row justify-around pt-4">
                  <TouchableOpacity
                    className={
                      day === "Sabtu" || day === "Minggu"
                        ? "rounded-[30px] bg-[#e3e3e3] p-2"
                        : attendance?.checkIn
                          ? "rounded-[30px] bg-[#e3e3e3] p-2"
                          : "rounded-[30px] bg-[#90ee90] p-2"
                    }
                    disabled={
                      day === "Sabtu" || day === "Minggu"
                        ? true
                        : attendance?.checkIn
                          ? true
                          : false
                    }
                    onPress={async () => {
                      let status: IAttendanceStatus = "hadir";
                      currentTime >= company?.checkInTime!
                        ? (status = "terlambat")
                        : (status = "hadir");

                      await postAttendance(status);

                      const att = await storage.load({ key: "attendance" });
                      const attData = JSON.parse(att);
                      setAttendance(attData);
                    }}
                  >
                    <Text className="px-9 text-lg font-semibold  text-gray-600">
                      Masuk
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={
                      day === "Sabtu" || day === "Minggu"
                        ? "rounded-[30px] bg-[#e3e3e3] p-2"
                        : attendance?.checkIn && attendance?.checkOut
                          ? "invisible rounded-[30px] bg-[#e3e3e3] p-2"
                          : attendance?.checkIn
                            ? "visible rounded-[30px] bg-[#00A12D] p-2"
                            : "rounded-[30px] bg-[#e3e3e3] p-2"
                    }
                    disabled={
                      day === "Sabtu" || day === "Minggu"
                        ? true
                        : attendance?.checkIn && attendance?.checkOut
                          ? true
                          : attendance?.checkIn
                            ? false
                            : true
                    }
                    onPress={async () => {
                      await updateAttendance(attendance?.id!);

                      const att = await storage.load({ key: "attendance" });
                      const attData = JSON.parse(att);
                      setAttendance(attData);
                    }}
                  >
                    <Text className="px-9 text-lg font-semibold text-gray-600 ">
                      Keluar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="mb-20 rounded-[50px]  bg-[#cedfff] px-4 py-6 shadow shadow-gray-800 dark:bg-[#3a3a3a] dark:shadow-white">
                {renderModal()}
                {renderSakit()}
                <View>
                  <Text className="text-md font-semibold  tracking-wide text-gray-600 dark:text-neutral-300">
                    Pengajuan Izin Cuti
                  </Text>
                </View>
                <Separator />
                <View className="flex-row justify-around pt-4">
                  <Pressable
                    className={
                      day === "Sabtu" || day === "Minggu"
                        ? "rounded-[30px] bg-[#e3e3e3] px-8 py-2"
                        : activePaidLeave
                          ? "rounded-[30px] bg-[#e3e3e3] px-8 py-2"
                          : "rounded-[30px] bg-[#90ee90] px-8 py-2"
                    }
                    onPress={() => setOpenModal(true)}
                  >
                    <Text className="px-5 text-lg font-semibold  text-gray-600">
                      Cuti
                    </Text>
                  </Pressable>
                  <Pressable
                    className={
                      day === "Sabtu" || day === "Minggu"
                        ? "rounded-[30px] bg-[#e3e3e3] px-8 py-2"
                        : activePaidLeave
                          ? "rounded-[30px] bg-[#e3e3e3] px-8 py-2"
                          : "rounded-[30px] bg-[#90ee90] px-8 py-2"
                    }
                    onPress={() => setOpenSakit(true)}
                  >
                    <Text className="px-5 text-lg font-semibold  text-gray-600">
                      Sakit
                    </Text>
                  </Pressable>
                </View>
                
                <View className="flex-row justify-around pt-4">
                  <View className="flex-col">
                    <Text className="text-md  font-bold text-gray-600 dark:text-neutral-300">
                      Alasan
                    </Text>
                    <Text className="text-md  font-semibold text-gray-600 dark:text-neutral-300">
                      {activePaidLeave?.reason ? activePaidLeave.reason : "—"}
                    </Text>
                  </View>
                  <View className="flex-col">
                    <Text className="text-md  font-bold text-gray-600 dark:text-neutral-300">
                      Mulai
                    </Text>
                    <Text className="text-md  font-semibold text-gray-600 dark:text-neutral-300">
                      {activePaidLeave?.startDate
                        ? activePaidLeave.startDate
                        : "—"}
                    </Text>
                  </View>
                  <View className="flex-col">
                    <Text className="text-md  font-bold text-gray-600 dark:text-neutral-300">
                      Selama
                    </Text>
                    <Text className="text-md  font-semibold text-gray-600 dark:text-neutral-300">
                      {activePaidLeave?.days ? activePaidLeave.days : "—"} Hari
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <Toast />
      </ScrollView>
    </View>
  );
  function renderModal() {
    return (
      <Modal visible={openModal} animationType="slide" transparent={true}>
        <View className="h-full rounded-[20px] bg-[#f0fafd] p-5 dark:bg-[#3a3a3a]">
          <View className="flex-row justify-between ">
            <Text className="text-2xl font-bold  text-gray-600 dark:text-neutral-300">
              Pengajuan Cuti
            </Text>
            <TouchableOpacity onPress={() => setOpenModal(false)}>
              <FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="my-5 flex-col items-center justify-center">
              {/* <Text className="text-2xl font-bold">Riwayat Presensi</Text> */}
              <View className="mt-4 w-full">
                <Text className="text-md  font-bold text-gray-600 dark:text-neutral-300">
                  Foto Dokumen Penguat (Optional)
                </Text>
                <Button
                  title="Buka Kamera"
                  onPress={() => {
                    toggleCamera();
                    setCameraFor("sakit");
                  }}
                />
                <View className="mt-3">
                  {image && (
                    <>
                      <Button
                        title="Hapus"
                        onPress={() => setImage(undefined)}
                      />
                      <Image
                        source={{ uri: image.uri }}
                        className="aspect-[3/4] w-full"
                      />
                    </>
                  )}
                </View>
              </View>
              <View className="mt-4 w-full">
                <Text className="text-md  font-bold text-gray-600 dark:text-neutral-300">
                  Alasan
                </Text>
                <TextInput
                  className="border-b-2 border-b-gray-500 py-3 text-lg"
                  keyboardType="default"
                  onChangeText={(text) => setTitle(text)}
                />
              </View>
              <View className="mt-4 w-full">
                {/* <Text className="font-bold  text-gray-600 dark:text-neutral-300 text-md">Mulai</Text>
								<TextInput
									className="py-3 text-lg border-b-2 border-b-gray-500"
									// value={value}
									keyboardType="default"
									onChangeText={text => setStartTime(text)}
								/> */}
                <Text className="text-md  font-bold text-gray-600 dark:text-neutral-300">
                  Mulai Pada
                </Text>
                {/* day/month/year section */}
                <View className="flex-row justify-between">
                  <View className="flex-col">
                    <Text className="text-md  font-bold text-gray-600 dark:text-neutral-300">
                      Tanggal
                    </Text>
                    <TextInput
                      className="border-b-2 border-b-gray-500 p-3 text-lg"
                      // value={dayDate.toString()}
                      keyboardType="number-pad"
                      onChangeText={(text) => setDayDate(parseInt(text))}
                    />
                  </View>
                  <View className="flex-col">
                    <Text className="text-md  font-bold text-gray-600 dark:text-neutral-300">
                      Bulan
                    </Text>
                    <TextInput
                      className="border-b-2 border-b-gray-500 p-3 text-lg"
                      // value={value}
                      keyboardType="number-pad"
                      onChangeText={(text) => setMonthDate(parseInt(text))}
                    />
                  </View>
                  <View className="flex-col">
                    <Text className="text-md  font-bold text-gray-600 dark:text-neutral-300">
                      Tahun
                    </Text>
                    <TextInput
                      className="border-b-2 border-b-gray-500 p-3 text-lg"
                      // value={value}
                      keyboardType="number-pad"
                      onChangeText={(text) => setYearDate(parseInt(text))}
                    />
                  </View>
                </View>
              </View>
              <View className="mt-4 w-full">
                <Text className="text-md  font-bold text-gray-600 dark:text-neutral-300">
                  Selama
                </Text>
                <View className="flex-row">
                  <TextInput
                    className="border-b-2 border-b-gray-500 p-3 text-lg"
                    // value={value}
                    keyboardType="number-pad"
                    onChangeText={(text) => setEndTime(parseInt(text))}
                  />
                  <Text className="text-md mt-7  font-bold text-gray-600 dark:text-neutral-300">
                    Hari
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={async () => {
                const date =
                  dayDate.toString().padStart(2, "0") +
                  "-" +
                  monthDate.toString().padStart(2, "0") +
                  "-" +
                  yearDate.toString().padStart(2, "0");

                if (title === "") {
                  showToast("Alasan tidak boleh kosong");
                  return;
                } else if (date === "--") {
                  showToast("Tanggal tidak boleh kosong");
                  return;
                } else if (endTime === 0) {
                  showToast("Lama cuti tidak boleh kosong");
                  return;
                } else if (currentDate > date) {
                  showToast("Tanggal tidak boleh kurang dari hari ini");
                  return;
                }

                const data: IAPIPaidLeaveData = {
                  reason: title,
                  startDate: date,
                  days: endTime,
                  attachment: image?.base64 ?? "",
                };
                await SendPaidLeave(data).then((res) => {
                  if (res instanceof AxiosError) {
                    console.log(res);
                  } else {
                    setOpenModal(false);
                  }
                });
              }}
            >
              <View className="mt-6 rounded-full bg-[#DEE9FD] dark:bg-[#212121]">
                <Text className="px-3 py-2 text-center text-xl font-semibold  text-gray-600 dark:text-neutral-300">
                  Kirim
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    );
  }

  function renderSakit() {
    return (
      <Modal visible={openSakit} animationType="slide" transparent={true}>
        <View className="h-full rounded-[20px] bg-[#f0fafd] p-5 dark:bg-[#3a3a3a]">
          <View className="flex-row justify-between ">
            <Text className="text-2xl font-bold  text-gray-600 dark:text-neutral-300">
              Pengajuan Izin Sakit
            </Text>
            <TouchableOpacity
              onPress={() => {
                setOpenSakit(false);
                setImage(undefined);
              }}
            >
              <FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="my-5 flex-col items-center justify-center">
              {/* <Text className="text-2xl font-bold">Riwayat Presensi</Text> */}
              <View className="mt-4 w-full">
                <Text className="text-md  font-bold text-gray-600 dark:text-neutral-300">
                  Foto Surat Sakit
                </Text>
                <Button
                  title="Buka Kamera"
                  onPress={() => {
                    toggleCamera();
                    setCameraFor("sakit");
                  }}
                />
                <View className="mt-3">
                  {image && (
                    <>
                      <Button
                        title="Hapus"
                        onPress={() => setImage(undefined)}
                      />
                      <Image
                        source={{ uri: image.uri }}
                        className="aspect-[3/4] w-full"
                      />
                    </>
                  )}
                </View>
              </View>
              <View className="mt-4 w-full">
                <Text className="text-md  font-bold text-gray-600 dark:text-neutral-300">
                  Selama
                </Text>
                <View className="flex-row">
                  <TextInput
                    className="border-b-2 border-b-gray-500 p-3 text-lg"
                    // value={value}
                    keyboardType="number-pad"
                    onChangeText={(text) => setEndTime(parseInt(text))}
                  />
                  <Text className="text-md mt-7  font-bold text-gray-600 dark:text-neutral-300">
                    Hari
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={async () => {
                const date =
                  dayDate.toString().padStart(2, "0") +
                  "-" +
                  monthDate.toString().padStart(2, "0") +
                  "-" +
                  yearDate.toString().padStart(2, "0");

                if (title === "") {
                  showToast("Alasan tidak boleh kosong");
                  return;
                } else if (date === "--") {
                  showToast("Tanggal tidak boleh kosong");
                  return;
                } else if (endTime === 0) {
                  showToast("Lama cuti tidak boleh kosong");
                  return;
                } else if (currentDate > date) {
                  showToast("Tanggal tidak boleh kurang dari hari ini");
                  return;
                }

                const data: IAPIPaidLeaveData = {
                  reason: title,
                  startDate: date,
                  days: endTime,
                  attachment: image?.base64 ?? "",
                };
                await SendPaidLeave(data).then((res) => {
                  if (res instanceof AxiosError) {
                    console.log(res);
                  } else {
                    setOpenModal(false);
                    setImage(undefined);
                  }
                });
              }}
            >
              <View className="mt-6 rounded-full bg-[#DEE9FD] dark:bg-[#212121]">
                <Text className="px-3 py-2 text-center text-xl font-semibold  text-gray-600 dark:text-neutral-300">
                  Kirim
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    );
  }

}

const Separator = () => (
  <View className="my-1 h-px w-full bg-black dark:bg-neutral-300 "></View>
);
