import { Text, View, ScrollView, StyleSheet, Modal, TouchableOpacity, TextInput } from "react-native";

import { useEffect, useState } from "react";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { DataTable } from "react-native-paper";
import { CreateUser, DeleteUser, GetUsers, UpdateUser } from "../api/admin";
import { AxiosError } from "axios";
import { getCompany } from "../api/company";
import storage from "../utils/storage";
import Spinner from "react-native-loading-spinner-overlay";
import Ionicons from "react-native-vector-icons/Ionicons";

const ManageIP = () => {
	const [loading, setLoading] = useState(false);
	const [showDeleteConfrim, setShowDeleteConfrim] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [karyawan, setKaryawan] = useState<IUser[]>([]);
	const [company, setCompany] = useState<ICompany | null>(null);
	const [karyawanId, setKaryawanId] = useState("");
	const [phone, setPhone] = useState("");


	useEffect(() => {

		async function loadKaryawan() {
			setLoading(true);
			const karyawan = await GetUsers();
			if (karyawan instanceof AxiosError) {
				console.log(karyawan);
			} else {
				setKaryawan(karyawan.data.data.users);
				await storage.save({
					key: "karyawan",
					data: karyawan.data.data.users
				});
			}
			setLoading(false);
		}
		loadKaryawan();
	}, []);

	return (
		<ScrollView className="w-full bg-[#DEE9FD]">
			<Spinner visible={loading} textContent={"Loading..."} />
			<View className="py-6 px-3 lg:px-10 xl:px-24 2xl:px-60">
				<View className="flex-row">
					<TouchableOpacity
						onPress={async () => {
							setLoading(true);
							const karyawan = await GetUsers();
							if (karyawan instanceof AxiosError) {
								console.log(karyawan);
							} else {
								setKaryawan(karyawan.data.data.users);
								await storage.save({
									key: "karyawan",
									data: karyawan.data.data.users
								});
							}
							setLoading(false);
						}}
						className="p-3 my-4 w-32 bg-blue-500 rounded-md">
						<Text className="text-center text-white">
							<Ionicons color="white" name="refresh-circle-outline" size={17} />
							Refresh
						</Text>
					</TouchableOpacity>
				</View>
				<View className="bg-[#f1f6ff] mb-6 rounded-md shadow-lg">
					<View className="p-4" style={{ elevation: 10, zIndex: 10 }}>
						<View className="flex-row justify-between items-center">
							<Text className="font-semibold">Daftar Alamat IP</Text>
							<View className="flex-row gap-2">
								<TouchableOpacity
									onPress={() => setShowModal(true)}
									className="p-1 rounded-md border border-gray-600">
									<Text className="font-semibold text-gray-600">Tambah Alamat IP</Text>
								</TouchableOpacity>
							</View>
							{renderForm()}
						</View>
					</View>

					<DataTable>
						<DataTable.Header>
							<DataTable.Title>Alamat IP</DataTable.Title>
							<DataTable.Title>Aksi</DataTable.Title>
						</DataTable.Header>

						{karyawan.length === 0 && (
							<DataTable.Row>
								<DataTable.Cell>No data</DataTable.Cell>
								<DataTable.Cell>No data</DataTable.Cell>
							</DataTable.Row>
						)}

						{karyawan.map(karyawan => (
							<DataTable.Row key={karyawan.id} className="py-2 lg:py-4">
								<DataTable.Cell>{karyawan.phone}</DataTable.Cell>
								<DataTable.Cell>
									<View className="flex-col gap-1 lg:flex-row">
										<TouchableOpacity
											onPress={() => {
												setKaryawanId(karyawan.id);

												setShowDeleteConfrim(true);
											}}
											className="p-3 bg-red-200 rounded-md border border-gray-600">
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
				<View className="justify-center items-center h-full">
					<View className="bg-[#f0fafd] rounded-2xl w-full lg:w-[40%] p-5">
						<View className="flex-row justify-between">
							<Text className="text-2xl font-bold text-gray-600">Tambah Alamat IP</Text>
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
							<View className="flex-col justify-center items-center my-5">
								{/* <Text className="text-2xl font-bold">Riwayat Presensi</Text> */}
								<View className="mt-4 w-full">
									<Text className="font-bold text-gray-600 text-md">Alamat IP</Text>
									<TextInput
										className="py-3 text-lg border-b-2 border-b-gray-500"
										// value={value}
										// keyboardType="default"
										onChangeText={text => setPhone(text)}
									/>
								</View>
							</View>
							<TouchableOpacity
								onPress={async () => {
									// setShowModal(false);

									// const data: IUserData = {
									// 	phone: phone,
									// };

									// const newKaryawan = await CreateUser(data);

									// if (newKaryawan instanceof AxiosError) {
									// 	console.log(newKaryawan);
									// } else {
									// 	setKaryawan([...karyawan, newKaryawan.data.data.user]);

									// 	await storage.save({
									// 		key: "karyawan",
									// 		data: karyawan
									// 	});
									// }
								}}>
								<View className="bg-[#DEE9FD] rounded-full mt-6">
									<Text className="py-2 px-3 text-xl font-semibold text-center text-gray-600">Tambah</Text>
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
			<Modal animationType="fade" transparent={true} visible={showDeleteConfrim}>
				<View className="justify-center items-center h-full">
					<View className="bg-[#f0fafd] rounded-2xl w-full lg:w-[40%] p-5">
						<View className="flex-row justify-between">
							<Text className="text-2xl font-bold text-gray-600">Apakah anda yakin?</Text>
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
											data: karyawan
										});
									}
								}}>
								<View className="bg-[#fddede] rounded-full mt-6">
									<Text className="py-2 px-3 text-xl font-semibold text-center text-gray-600">Yakin</Text>
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
