import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";

export default function HomeScreen() {
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
    <View className="mt-6">
      <StatusBar backgroundColor="#5A9CFF" style="light" />
      <View className="flex-row justify-between items-center bg-[#5A9CFF] p-5">
        <Text className="text-white text-xl font-bold">
          PT. Kenzou Aplikasi
        </Text>
      </View>

      <View className="flex flex-col gap-4 mt-6 p-5">
        <View className="bg-white rounded-lg shadow-lg shadow-blue-200 p-4">
          <View className=" items-center mb-4">
            <Text className="text-3xl font-bold">{day},</Text>
            <Text className="text-2xl font-bold">{currentDate}</Text>
          </View>
          <Separator />
          <View className="flex-row justify-center gap-32">
            <View className="flex-row gap-2 mt-3">
              <View>
                <Text className="text-lg text-black font-bold">Masuk</Text>
                <Text className="text-2xl text-gray-600 font-medium">
                  08:30:12
                </Text>
              </View>
            </View>
            <View className="flex-row gap-2 mt-3">
              <View>
                <Text className="text-lg text-black font-bold">Keluar</Text>
                <Text className="text-2xl text-gray-600 font-medium">-</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-lg shadow-lg shadow-blue-200 p-4">
          <View>
            <Text className="text-md font-normal tracking-wide">
              Presensi Masuk/Keluar
            </Text>
          </View>
          <Separator />
          <View className="flex-row pt-4 justify-between">
            <Pressable className="bg-[#00A12D] p-2  rounded-lg">
              <Text className="text-white text-lg ">Presensi Masuk</Text>
            </Pressable>
            <Pressable className="bg-[#e3e3e3] p-2 rounded-lg">
              <Text className="text-[#ff1515] text-lg">Presensi Keluar</Text>
            </Pressable>
          </View>
        </View>
        <View className="bg-white rounded-lg shadow-lg shadow-blue-200 p-4">
          <View>
            <Text className="text-md font-normal tracking-wide">
              Pengajuan Izin Sakit/Cuti
            </Text>
          </View>
          <Separator />
          <View className="flex-row pt-4 justify-between">
            <Pressable className="bg-[#3170E8] px-8 py-2  rounded-lg">
              <Text className="text-white text-lg ">Izin Sakit</Text>
            </Pressable>
            <Pressable className="bg-[#3170E8] px-8 py-2 rounded-lg">
              <Text className="text-white text-lg">Izin Cuti</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const Separator = () => <View className="h-[1px] w-full bg-black"></View>;
