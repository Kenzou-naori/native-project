import storage from "../utils/storage";

import { Text, View, ScrollView } from "react-native";
import { useEffect, useState } from "react";

const ProfileScreen = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEMail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const getUserData = async () => {
      const dataString = await storage.load({ key: "user" });
      const data = JSON.parse(dataString);
      setEMail(data.email);
      setFullName(data.fullName);
      setPhone(data.phone);
    };

    getUserData();
  }, []);

  return (
    <View className="mt-6 bg-[#DEE9FD] dark:bg-[#212121] ">
      <View className="-mb-6 mt-6 h-full rounded-t-[50px] bg-[#f0fafd] p-5 dark:bg-[#3a3a3a]">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="my-5 flex-col justify-center">
            <Text className="text-center text-2xl font-bold text-gray-600 dark:text-neutral-300 ">
              Profile
            </Text>
            <View className="mt-4">
              <Text className="text-md text-gray-500 dark:text-neutral-300">
                Nama Lengkap
              </Text>
              <Text className="border-b-2 border-b-gray-500 py-2 text-xl dark:text-neutral-300 ">
                {fullName}
              </Text>
            </View>
            <View className="mt-4">
              <Text className="text-md text-gray-500  dark:text-neutral-300">
                Alamat Email
              </Text>
              <Text className="border-b-2 border-b-gray-500 py-2 text-xl dark:text-neutral-300 ">
                {email}
              </Text>
            </View>
            <View className="mt-4">
              <Text className="text-md text-gray-500  dark:text-neutral-300">
                Nomor Telepon
              </Text>
              <Text className="border-b-2 border-b-gray-500 py-2 text-xl dark:text-neutral-300 ">
                {phone}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ProfileScreen;
