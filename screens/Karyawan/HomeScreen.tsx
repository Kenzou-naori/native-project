// Sort import by longest to shortest, if same length sort by alphabetical

import { formatISODate, showToast } from "../../api/util";
import { getCompany } from "../../api/company";
import constant from "../../constant/date";
import storage from "../../utils/storage";
import {
  getAttendances,
  postAttendance,
  updateAttendance,
} from "../../api/attendance";
import {
  GetPaidLeave,
  GetPaidLeaves,
  SendPaidLeave,
} from "../../api/paidLeave";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Camera,
  CameraCapturedPicture,
  CameraType,
  FlashMode,
} from "expo-camera";
import { useColorScheme } from "nativewind";
import { StatusBar } from "expo-status-bar";
import { AxiosError } from "axios";

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

import Ionicons from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";

// HomeScreen
export default function HomeScreen({ navigation }: any) {
  const [hasCameraPermission] = Camera.useCameraPermissions();
  const [activePaidLeave, setActivePaidLeave] = useState<IPaidLeave | null>(
    null,
  );
  const [attendance, setAttendance] = useState<IAttendance | null>(null);
  const [image, setImage] = useState<CameraCapturedPicture | undefined>(
    undefined,
  );
  const [company, setCompany] = useState<ICompany | null>(null);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const { colorScheme, setColorScheme } = useColorScheme();
  const [_, setPaidLeaves] = useState<IPaidLeave[]>([]);
  const [user, setUser] = useState<IUser | null>(null);
  const [openCamera, setOpenCamera] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [flash, setFlash] = useState(FlashMode.off);
  const [openModal, setOpenModal] = useState(false);
  const [openSakit, setOpenSakit] = useState(false);
  const [type, setType] = useState(CameraType.back);
  const [cameraFor, setCameraFor] = useState("");
  const [monthDate, setMonthDate] = useState(0);
  const [yearDate, setYearDate] = useState(0);
  const [dayDate, setDayDate] = useState(0);
  const [endTime, setEndTime] = useState(1);
  const [title, setTitle] = useState("");
  const [day, setDay] = useState("");

  const cameraRef = useRef<Camera>(null);

  const updateThemeAndStorage = async (newColorScheme: any) => {
    try {
      setColorScheme(newColorScheme);
    } catch (error) {
      console.error("Error saving theme:", error);
    } finally {
      await storage.save({ key: "theme", data: newColorScheme });
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

    await storage.load({ key: "theme" }).then(async (res) => {
      updateThemeAndStorage(res);

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
    });
  }, []);
  // end refresh
  // loadDatas
  useEffect(() => {
    async function loadTheme() {
      const storedTheme = await storage.load({ key: "theme" });
      updateThemeAndStorage(storedTheme);
    }

    async function loadUserData() {
      const dataString = await storage.load({ key: "user" });
      const data = JSON.parse(dataString);
      setUser(data);
    }

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

    loadUserData();
    loadTheme();
    loadDate();
    loadTime();
    loadDatas();

    return () => {
      clearInterval(intervalTD);
    };
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.current?.takePictureAsync({
          quality: 0.5,
          base64: true,
          skipProcessing: true,
        });

        if (photo) {
          setImage(photo);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const toggleCameraType = () => {
    setType(type === CameraType.back ? CameraType.front : CameraType.back);
  };

  const toggleCamera = () => {
    if (!hasCameraPermission?.granted) {
      Camera.requestCameraPermissionsAsync();
      console.log("No access to camera");
      return;
    }

    setOpenCamera(!openCamera);
  };

  return (
    <>
      {renderCamera()}
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
            <TouchableOpacity
              onPress={() =>
                updateThemeAndStorage(
                  colorScheme === "light" ? "dark" : "light",
                )
              }
            >
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
                {user ? user.fullName : "—"}
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
                      onPress={() => {
                        toggleCamera();
                        setCameraFor("checkIn");
                      }}
                      // disabled={
                      //   day === "Sabtu" || day === "Minggu"
                      //     ? true
                      //     : attendance?.checkIn
                      //       ? true
                      //       : false
                      // }
                      // onPress={async () => {
                      //   let status: IAttendanceStatus = "hadir";
                      //   currentTime >= company?.checkInTime!
                      //     ? (status = "terlambat")
                      //     : (status = "hadir");

                      //   await postAttendance(status);

                      //   const att = await storage.load({ key: "attendance" });
                      //   const attData = JSON.parse(att);
                      //   setAttendance(attData);
                      // }}
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
                          ? formatISODate(activePaidLeave.startDate)
                          : "—"}
                      </Text>
                    </View>
                    <View className="flex-col">
                      <Text className="text-md  font-bold text-gray-600 dark:text-neutral-300">
                        Selama
                      </Text>
                      <Text className="text-md  font-semibold text-gray-600 dark:text-neutral-300">
                        {activePaidLeave?.days ? activePaidLeave.days : "—"}{" "}
                        Hari
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
    </>
  );

  function renderCamera() {
    return (
      <Modal visible={openCamera} animationType="slide" transparent={true}>
        <View className="h-full w-full justify-center bg-[#212121]">
          {cameraFor === "checkIn" ? (
            <Text className="absolute left-5 top-10 text-xl text-white dark:text-neutral-300">
              {hasCameraPermission?.granted
                ? isFaceDetected === true
                  ? "Face detected"
                  : "No face detected or more than one face detected"
                : "No access to camera"}
            </Text>
          ) : (
            <Text className="absolute left-5 top-10 text-xl text-white dark:text-neutral-300">
              {hasCameraPermission?.granted
                ? "Ambil foto surat sakit"
                : "No access to camera"}
            </Text>
          )}
          <TouchableOpacity
            onPress={() => setOpenCamera(false)}
            className="absolute right-5 top-5"
          >
            <Ionicons name="close" size={50} color="white" />
          </TouchableOpacity>
          {!image ? (
            <Camera
              className="aspect-[3/4] w-full"
              type={type}
              ref={cameraRef}
              flashMode={flash}
              faceDetectorSettings={
                hasCameraPermission?.granted
                  ? {
                      mode: "fast",
                      detectLandmarks: "all",
                      runClassifications: "all",
                    }
                  : undefined
              }
              onFacesDetected={(face) => {
                setIsFaceDetected(face.faces.length === 1);
              }}
            />
          ) : (
            <Image
              source={{ uri: image.uri }}
              className="aspect-[3/4] w-full"
            />
          )}

          <View className="absolute bottom-10 w-full flex-row justify-center">
            {image ? (
              <View className="w-full flex-row items-center justify-between px-10">
                <Ionicons
                  name="arrow-back"
                  size={50}
                  color="white"
                  onPress={() => setImage(undefined)}
                />
                <Ionicons
                  name="checkmark"
                  size={50}
                  color="white"
                  onPress={async () => {
                    if (cameraFor === "checkIn") {
                      let status: IAttendanceStatus = "hadir";
                      currentTime >= company?.checkInTime!
                        ? (status = "terlambat")
                        : (status = "hadir");

                      postAttendance(status, image.base64!);

                      const att = await storage.load({ key: "attendance" });
                      const attData = JSON.parse(att);
                      setAttendance(attData);

                      setImage(undefined);
                      setOpenCamera(false);
                    } else if (cameraFor === "sakit") {
                      setOpenCamera(false);
                    }
                  }}
                />
              </View>
            ) : (
              <View className="w-full flex-row justify-between px-10">
                <Ionicons
                  name="camera-reverse"
                  size={50}
                  color="white"
                  onPress={toggleCameraType}
                />
                <Ionicons
                  name="camera"
                  size={50}
                  color="white"
                  onPress={
                    cameraFor === "sakit" || isFaceDetected === true
                      ? takePicture
                      : () => {}
                  }
                />
                <Ionicons
                  name={flash === FlashMode.off ? "flash-off" : "flash"}
                  size={50}
                  color="white"
                  onPress={() =>
                    setFlash(
                      flash === FlashMode.off ? FlashMode.on : FlashMode.off,
                    )
                  }
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  }

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