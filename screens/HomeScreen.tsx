import { StyleSheet, Text, View, Pressable, ScrollView, Image, TouchableOpacity, TextInput, Modal } from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";

// import for api
import constant from "../constant/date";
import { getCompany } from "../api/company";
import storage from "../utils/storage";
import {
  getAttendances,
  postAttendance,
  updateAttendance,
} from "../api/attendance";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";

export default function HomeScreen() {
  const [day, setDay] = useState("");
  const [title, setTitle] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [company, setCompany] = useState<ICompany | null>(null);
  const [attendance, setAttendance] = useState<IAttendance | null>(null);

  useEffect(() => {
    const d = new Date();
    let date = d.getDate().toString(); //Current Date
    let month = d.getMonth().toString(); //Current Month
    let year = d.getFullYear().toString(); //Current Year

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

    async function loadCompany() {
      await getCompany();
      const company = await storage.load({ key: "company" });
      const companyData = JSON.parse(company);

      setCompany(companyData);
    }

    async function loadAttendance() {
      date = date.padStart(2, "0");
      month = month.padStart(2, "0");
      year = year.padStart(2, "0");

      await getAttendances(date + "-" + month + "-" + year);
      const attendance = await storage.load({ key: "attendance" });
      const attendanceData = JSON.parse(attendance);

      setAttendance(attendanceData);
    }

    const intervalTD = setInterval(() => {
      loadTime();
      loadDate();
    }, 1000);

    const intervalAC = setInterval(() => {
      loadAttendance();
      loadCompany();
    }, 1000 * 60);

    loadDate();
    loadTime();
    loadCompany();
    loadAttendance();

    return () => {
      clearInterval(intervalTD);
      clearInterval(intervalAC);
    };
  }, []);

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
    <View className="mt-6 bg-[#DEE9FD] h-full">
      <StatusBar backgroundColor="#DEE9FD" style="dark" />
      <View className="p-2 w-60 mx-auto mt-5 flex flex-row justify-center items-center bg-[#DEE9FD] rounded-full shadow-xl shadow-gray-800">
        <Image source={require("../assets/images/logo.png")} className=" w-6 h-8"/>
        <Text className=" text-gray-600 text-center  p-2 text-xl font-bold tracking-widest	">
          {company?.name ? company.name : ""}
        </Text>
      </View>
      <View className=" px-10 mt-6 mb-2">
        <View className="rounded-full bg-[#cedfff] shadow shadow-gray-800 p-4">
      <Text className="text-lg text-gray-600 font-semibold">Halo,</Text>
      <Text className="text-xl text-gray-600 font-bold">{fullName}</Text>
        </View>
      </View>
	  <View className="p-5">
        <View
          className=" rounded-[60px] px-5 "
        >
          <View className="flex flex-col gap-8 justify-center">
            <View className="bg-[#cedfff] rounded-[60px] shadow shadow-gray-800 p-4">
              <View className=" items-center mb-4">
                <Text className="text-3xl text-gray-600 font-bold">{day},</Text>
                <Text className="text-2xl text-gray-600 font-bold">{currentDate}</Text>
              </View>
              <Separator />
              <View className="flex-row justify-around">
                <View className="mt-3 items-center">
                    <Text className="text-lg text-gray-600 font-bold">Masuk</Text>
                    <Text
                      className={
                        day === "Sabtu" || day === "Minggu"
                          ? "text-2xl text-gray-600 font-medium"
                          : currentTime >= company?.checkInTime!
                          ? "text-red-500 text-2xl font-medium"
                          : "text-2xl text-gray-600 font-medium"
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
                    <Text className="text-lg text-gray-600 font-bold">Keluar</Text>
                    <Text className="text-2xl text-gray-600 font-medium">
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

            <View className="bg-[#cedfff] rounded-[50px] shadow shadow-gray-800 px-4 py-6">
              <View>
                <Text className="text-md text-gray-600 font-semibold tracking-wide">
                  Presensi Masuk/Keluar
                </Text>
              </View>
              <Separator />
              <View className="flex-row pt-4 justify-around">
                <TouchableOpacity
                  className={
                    day === "Sabtu" || day === "Minggu"
                      ? "bg-[#e3e3e3] p-2 rounded-[30px]"
                      : attendance?.checkIn
                      ? "bg-[#e3e3e3] p-2 rounded-[30px]"
                      : "bg-[#90ee90] p-2 rounded-[30px]"
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
                  <Text className="text-gray-600 text-lg font-semibold px-9">Masuk</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={
                    day === "Sabtu" || day === "Minggu"
                      ? "bg-[#e3e3e3] p-2 rounded-[30px]"
                      : attendance?.checkIn && attendance?.checkOut
                      ? "bg-[#e3e3e3] p-2 rounded-[30px] invisible"
                      : attendance?.checkIn
                      ? "bg-[#00A12D] p-2 rounded-[30px] visible"
                      : "bg-[#e3e3e3] p-2 rounded-[30px]"
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
                  <Text className="text-black text-lg font-semibold px-9">Keluar</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="bg-[#cedfff] rounded-[50px] shadow shadow-gray-800 px-4 py-6">
              {renderModal()}
              <View>
                <Text className="text-md text-gray-600 font-semibold tracking-wide">
                  Pengajuan Izin Cuti
                </Text>
              </View>
              <Separator />
              <View className="flex-row pt-4 justify-around">
                {/* <Pressable
                  className={
                    day === "Sabtu" || day === "Minggu"
                      ? "bg-[#e3e3e3] px-8 py-2 rounded-[30px]"
                      : attendance?.checkIn
                      ? "bg-[#e3e3e3] px-8 py-2 rounded-[30px]"
                      : "bg-[#53a0ff] px-8 py-2 rounded-[30px]"
                  }
                >
                  <Text className="text-gray-600 text-lg font-semibold px-5">Sakit</Text>
                </Pressable> */}
                <Pressable
                  className={
                    day === "Sabtu" || day === "Senin"
                      ? "bg-[#e3e3e3] px-8 py-2 rounded-[30px]"
                      : attendance?.checkIn
                      ? "bg-[#e3e3e3] px-8 py-2 rounded-[30px]"
                      : "bg-[#90ee90] px-8 py-2 rounded-[30px]"
                  }
                  onPress={() => setOpenModal(true)}
                >
                  <Text className="text-gray-600 text-lg font-semibold px-5">Cuti</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
        </View>
    </View>
  );
  function renderModal() {
		return (
			<Modal visible={openModal} animationType="slide" transparent={true}>
				<View className="bg-[#f0fafd] rounded-t-[50px] h-full mt-[156] p-5 -mb-56">
					<View className="flex-row justify-between ">
						<Text className="text-gray-600 text-2xl font-bold">Pengajuan Cuti</Text>
						<TouchableOpacity onPress={() => setOpenModal(false)}>
							<FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
						</TouchableOpacity>
					</View>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View className="flex-col justify-center items-center my-5">
							{/* <Text className="text-2xl font-bold">Riwayat Presensi</Text> */}
							<View className="mt-4 w-full">
							<Text className="text-md text-gray-600 font-bold">Alasan</Text>
								<TextInput
									className="border-b-2 border-b-gray-500 text-lg py-3 "
									keyboardType="default"
									onChangeText={text => setTitle(text)}
								/>
							</View>
							<View className="mt-4 w-full">
							<Text className="text-md text-gray-600 font-bold">Mulai</Text>
								<TextInput
									className="border-b-2 border-b-gray-500 text-lg py-3"
									// value={value}
									keyboardType="default"
									onChangeText={text => setStartTime(text)}
								/>
							</View>
							<View className="mt-4 w-full">
								<Text className="text-md text-gray-600 font-bold">Selesai</Text>
								<TextInput
									className="border-b-2 border-b-gray-500 text-lg py-3"
									// value={value}
									keyboardType="default"
									onChangeText={text => setEndTime(text)}
								/>
							</View>
						</View>
							<TouchableOpacity
								onPress={async () => {
									setOpenModal(false);

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
								}}>
								<View className="bg-[#DEE9FD] rounded-full mt-6">
									<Text className="text-gray-600 px-3 py-2 font-semibold text-center text-xl">Tambah</Text>
								</View>
							</TouchableOpacity>
					</ScrollView>
				</View>
			</Modal>
		);
	}
}



const Separator = () => <View className="h-[1px] w-full bg-black"></View>;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "black",
    shadowOpacity: 1,
    elevation: 15,
  },
});
