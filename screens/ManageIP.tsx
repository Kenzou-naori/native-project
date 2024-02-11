import { Text, View, ScrollView, Linking, Alert } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Spinner from "react-native-loading-spinner-overlay";
import storage from "../utils/storage";
import { AxiosError } from "axios";
import { TextInput } from "react-native-gesture-handler";
import { getCompany } from "../api/company";
const ManageIP = () => {
  const [loading, setLoading] = useState(false);
  const [ipAddress, setIpAddress] = useState("");
  type OpenURLButtonProps = {
    url: string;
    children: string;
  };
  const supportedURL = "https://whatismyipaddress.com/";

  const OpenURLButton = ({ url, children }: OpenURLButtonProps) => {
    const handlePress = useCallback(async () => {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    }, [url]);

    return (
      <Text onPress={handlePress} style={{ color: "blue" }}>
        {children}
      </Text>
    );
  };

  return (
    <ScrollView className="w-full bg-[#DEE9FD]">
      <Spinner visible={loading} textContent={"Loading..."} />
      <View className="p-6 py-6 lg:px-60">
        <View className="flex-row gap-3"></View>
        <View className="bg-[#f1f6ff] rounded-md shadow-lg">
          <View className="p-8">
            <View className="flex-row justify-between items-center">
              <Text className="font-semibold">Manage IP</Text>
            </View>
            <View className="items-center border border-gray-200 p-4 mt-2 rounded-2xl">
              <View className="w-1/2">
                <Text className="text-gray-600 font-semibold">IP Address</Text>
              </View>
              <View className="w-1/2">
                <TextInput
                  className="py-3 px-2 text-lg border-2 rounded-xl border-gray-500"
                  keyboardType="default"
                  // defaultValue={company?.name ? company.name : ""}
                  onChangeText={(text) => setIpAddress(text)}
                />
              </View>
              <View>
                <Text>
                  Catatan: Cek IP pada website{" "}
                  <OpenURLButton url={supportedURL}>
                    https://whatismyipaddress.com/
                  </OpenURLButton>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ManageIP;
