import { getSchedule, postSchedule } from "../api/schedule";

import constant from "../constant/date";
import storage from "../utils/storage";

import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";
import { faPlusSquare, faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useEffect, useState } from "react";

interface DetailScreenProps {
  navigation: any;
  value: string;
  onChangeText: (text: string) => void;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?:
    | "default"
    | "number-pad"
    | "decimal-pad"
    | "numeric"
    | "email-address"
    | "phone-pad";
  secureTextEntry?: boolean;
}

const DetailScreen = ({ value }: DetailScreenProps) => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [day, setDay] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const [data, setData] = useState<ISchedule[]>([]);

  useEffect(() => {
    const d = new Date();
    let date = d.getDate().toString(); //Current Date
    let month = (d.getMonth() + 1).toString(); //Current Month
    let year = d.getFullYear().toString(); //Current Year

    async function loadDate() {
      let day = constant.weekdays[d.getDay()];
      let month = constant.months[d.getMonth()];

      setDay(day);
      setCurrentDate(date + " " + month + " " + year);
    }

    async function loadData() {
      date = date.padStart(2, "0");
      month = month.padStart(2, "0");
      year = year.padStart(2, "0");

      await getSchedule(date + "-" + month + "-" + year);
      const schedule = await storage.load({ key: "schedule" });
      if (schedule === null) return;
      try {
        const scheduleData = JSON.parse(schedule);
        setData(scheduleData);
      } catch (error) {
        console.error("Invalid JSON string:", schedule);
      }
    }

    loadDate();
    loadData();

    const intervalDate = setInterval(() => {
      loadDate();
    }, 1000);
    const intervalData = setInterval(() => {
      loadData();
    }, 1000 * 60);

    return () => {
      clearInterval(intervalDate);
      clearInterval(intervalData);
    };
  }, []);

  return (
    <View className="mt-6 bg-[#DEE9FD]">
      <View className="p-5">
        <View className="mt-3 flex flex-row items-center justify-center rounded-full bg-[#DEE9FD] p-3 shadow-xl shadow-gray-800">
          <Text className="mr-3 text-2xl font-bold text-gray-800">{day}</Text>
          <Text className="text-2xl font-bold text-gray-800">
            {currentDate}
          </Text>
        </View>
      </View>
      <View className="-mb-56 mt-6 h-full rounded-t-[50px] bg-[#f0fafd] p-5">
        {renderModal()}
        <View className="my-5 flex-row justify-between">
          <Text className="text-2xl font-bold text-gray-700">
            Tugas hari ini
          </Text>
          <TouchableOpacity onPress={() => setOpenModal(true)}>
            <FontAwesomeIcon icon={faPlusSquare} size={25} color="#53a0ff" />
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {data.map((item, index) => (
            <View
              className="mb-[20] flex flex-col rounded-2xl border border-gray-400 bg-[#DEE9FD] p-[20]"
              key={item.id}
            >
              <Text className="text-2xl font-bold text-gray-600">
                {item.title}
              </Text>
              <View className="mt-5 flex-row items-center justify-end">
                <Text className="text-xl font-semibold text-gray-600">
                  {item.startTime}
                </Text>
                <Text>—</Text>
                <Text className="text-xl font-semibold text-gray-600">
                  {item.endTime}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  function renderModal() {
    return (
      <Modal visible={openModal} animationType="fade" transparent={true}>
        <View className="-mb-56 mt-[156] h-full rounded-t-[50px] bg-[#f0fafd] p-5">
          <View className="flex-row justify-between">
            <Text className="text-2xl font-bold text-gray-600">
              Tambah Tugas
            </Text>
            <TouchableOpacity onPress={() => setOpenModal(false)}>
              <FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="my-5 flex-col items-center justify-center">
              {/* <Text className="text-2xl font-bold">Riwayat Presensi</Text> */}
              <View className="mt-4 w-full">
                <Text className="text-md font-bold text-gray-600">
                  Nama Kegiatan
                </Text>
                <TextInput
                  className="border-b-2 border-b-gray-500 py-3 text-lg"
                  keyboardType="default"
                  onChangeText={(text) => setTitle(text)}
                />
              </View>
              <View className="mt-4 w-full">
                <Text className="text-md font-bold text-gray-600">Mulai</Text>
                <TextInput
                  className="border-b-2 border-b-gray-500 py-3 text-lg"
                  value={value}
                  keyboardType="default"
                  onChangeText={(text) => setStartTime(text)}
                />
              </View>
              <View className="mt-4 w-full">
                <Text className="text-md font-bold text-gray-600">Selesai</Text>
                <TextInput
                  className="border-b-2 border-b-gray-500 py-3 text-lg"
                  value={value}
                  keyboardType="default"
                  onChangeText={(text) => setEndTime(text)}
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={async () => {
                setOpenModal(false);

                const data: IScheduleData = {
                  title: title,
                  date: currentDate,
                  startTime: startTime,
                  endTime: endTime,
                };

                await postSchedule(data);

                const schedule = await storage.load({ key: "schedule" });
                const scheduleData = JSON.parse(schedule);

                setData(scheduleData);
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
      </Modal>
    );
  }
};

export default DetailScreen;
