import { StyleSheet, Text, TextInput, View, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import storage from "../utils/storage";

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
		<View className="mt-6 bg-[#DEE9FD]">
			<View className="bg-[#f0fafd] rounded-t-[50px] h-full mt-6 p-5 -mb-6">
				<ScrollView showsVerticalScrollIndicator={false}>
					<View className="flex-col justify-center my-5">
						<Text className="text-2xl font-bold text-center text-gray-600">Profile</Text>
						<View className="mt-4">
							<Text className="text-gray-500 text-md">Nama Lengkap</Text>
							<Text className="py-2 text-xl border-b-2 border-b-gray-500">{fullName}</Text>
							{/* <TextInput
								value={value}
								onChangeText={onChangeText}
								placeholder={fullName}
								autoCapitalize={autoCapitalize}
								editable={false}

								keyboardType={keyboardType}
								secureTextEntry={secureTextEntry}
							/> */}
						</View>
						<View className="mt-4">
							<Text className="text-gray-500 text-md">Alamat Email</Text>
							<Text className="py-2 text-xl border-b-2 border-b-gray-500">{email}</Text>

							{/* <TextInput
								value={email}
								
								onChangeText={onChangeText}
								placeholder={email}
								autoCapitalize={autoCapitalize}
								keyboardType="email-address"
								secureTextEntry={secureTextEntry}
								editable={false}
							/> */}
						</View>
						<View className="mt-4">
							<Text className="text-gray-500 text-md">Nomor Telepon</Text>
							<Text className="py-2 text-xl border-b-2 border-b-gray-500">{phone}</Text>

							{/* <TextInput
								value={value}
								onChangeText={onChangeText}
								placeholder={phone}
								autoCapitalize={autoCapitalize}
								keyboardType="phone-pad"
								editable={false}

								secureTextEntry={secureTextEntry}
							/> */}
						</View>
					</View>
				</ScrollView>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	label: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
		marginBottom: 8
	}
});

export default ProfileScreen;
