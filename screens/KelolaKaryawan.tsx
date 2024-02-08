import { Text, View, ScrollView, Button, Modal, TouchableOpacity, TextInput } from "react-native";

import React, { useState } from "react";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { DataTable } from "react-native-paper";
import { CreateUser, DeleteUser, GetUsers, UpdateUser } from "../api/admin";
import { AxiosError } from "axios";
import storage from "../utils/storage";
import Spinner from "react-native-loading-spinner-overlay";
import Ionicons from "react-native-vector-icons/Ionicons";

const WebAdmin = () => {
	const [loading, setLoading] = useState(true);
	const [showDeleteConfrim, setShowDeleteConfrim] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [showUpdateModal, setShowUpdateModal] = useState(false);
	const [karyawan, setKaryawan] = useState<IUser[]>([]);
	const [page, setPage] = React.useState<number>(0);
	const [numberOfItemsPerPageList] = React.useState([10, 20, 30]);
	const [itemsPerPage, onItemsPerPageChange] = React.useState(numberOfItemsPerPageList[0]);
	const [karyawanId, setKaryawanId] = useState("");
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const from = page * itemsPerPage;
	const to = Math.min((page + 1) * itemsPerPage, karyawan.length);

	React.useEffect(() => {
		setPage(0);

		async function loadKaryawan() {
			const karyawan = await storage.load({ key: "karyawan" });
			const karyawanData = JSON.parse(karyawan);
			setKaryawan(karyawanData);
			setLoading(false);
		}

		loadKaryawan();
	}, [itemsPerPage]);

	return (
		<ScrollView className="w-full bg-[#DEE9FD]">
			<Spinner visible={loading} textContent={"Loading..."} />
			<View className="px-3 lg:px-60 py-6">
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
						className="bg-blue-500 p-3 rounded-md w-32 my-4 ">
						  <Text className="text-white text-center">
			<Ionicons color="white" name="refresh-circle-outline" size={17}/>
				Refresh</Text>
					</TouchableOpacity>
				</View>
				<View className="bg-[#f1f6ff] mb-6 rounded-md shadow-lg">
					<View className="p-4">
						<View className="flex-row items-center justify-between">
							<Text className=" font-semibold">Daftar Karyawan</Text>
							<TouchableOpacity
								onPress={() => setShowModal(true)}
								className="border border-gray-600 rounded-md p-1">
								<Text className="text-gray-600 font-semibold">Tambah Karyawan</Text>
							</TouchableOpacity>
							{renderForm()}
						</View>
					</View>

					<DataTable>
						{/* <ScrollView horizontal contentContainerStyle={{ flexDirection: 'column' }}> */}

						<DataTable.Pagination
							page={page}
							numberOfPages={Math.ceil(karyawan.length / itemsPerPage)}
							onPageChange={page => setPage(page)}
							label={`${from + 1}-${to} of ${karyawan.length}`}
							showFastPaginationControls
							numberOfItemsPerPage={25}
						/>
						<DataTable.Header>
							<DataTable.Title>Nama</DataTable.Title>
							<DataTable.Title>Email</DataTable.Title>
							<DataTable.Title>No. HP</DataTable.Title>
							<DataTable.Title>Aksi</DataTable.Title>
						</DataTable.Header>

						{karyawan.length === 0 && (
							<DataTable.Row>
								<DataTable.Cell>No data</DataTable.Cell>
								<DataTable.Cell>No data</DataTable.Cell>
								<DataTable.Cell>No data</DataTable.Cell>
								<DataTable.Cell>No data</DataTable.Cell>
							</DataTable.Row>
						)}

						{karyawan.slice(from, to).map(karyawan => (
							<DataTable.Row key={karyawan.id} className="py-2 lg:py-4">
								<DataTable.Cell>{karyawan.fullName}</DataTable.Cell>
								<DataTable.Cell>{karyawan.email}</DataTable.Cell>
								<DataTable.Cell>{karyawan.phone}</DataTable.Cell>
								<DataTable.Cell>
									<View className="flex-col gap-1 lg:flex-row ">
										<TouchableOpacity
											onPress={() => {
												setKaryawanId(karyawan.id);

												setShowDeleteConfrim(true);
											}}
											className=" border border-gray-600 bg-red-200 p-3 rounded-md ">
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
											className=" border border-gray-600 bg-blue-200 p-3 rounded-md">
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
							numberOfPages={Math.ceil(karyawan.length / itemsPerPage)}
							onPageChange={page => setPage(page)}
							label={`${from + 1}-${to} of ${karyawan.length}`}
							showFastPaginationControls
							numberOfItemsPerPageList={numberOfItemsPerPageList}
							numberOfItemsPerPage={itemsPerPage}
							onItemsPerPageChange={onItemsPerPageChange}
							selectPageDropdownLabel={"Rows per page"}
						/>
						{/* </ScrollView> */}
					</DataTable>
				</View>
			</View>

			{/* refresh */}
		</ScrollView>
	);
	function renderForm() {
		return (
			<Modal animationType="fade" transparent={true} visible={showModal}>
				<View className="items-center h-full justify-center">
					<View className="bg-[#f0fafd] rounded-2xl w-full lg:w-[40%] p-5">
						<View className="flex-row justify-between">
							<Text className="text-gray-600 text-2xl font-bold">Tambah Karyawan</Text>
							<TouchableOpacity onPress={() => setShowModal(false)}>
								<FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
							</TouchableOpacity>
						</View>
						{/* <View className="bg-[#f0fafd] rounded-t-[50px] h-full mt-[156] p-5 -mb-56"> */}
						{/* <View className="flex-row justify-between ">
						<Text className="text-gray-600 text-2xl font-bold">Tambah Tugas</Text>
						<TouchableOpacity onPress={() => setShowModal(false)}>
							<FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
						</TouchableOpacity>
					</View> */}
						<ScrollView showsVerticalScrollIndicator={false}>
							<View className="flex-col justify-center items-center my-5">
								{/* <Text className="text-2xl font-bold">Riwayat Presensi</Text> */}
								<View className="mt-4 w-full">
									<Text className="text-md text-gray-600 font-bold">Nama Lengkap</Text>
									<TextInput
										className="border-b-2 border-b-gray-500 text-lg py-3"
										keyboardType="default"
										onChangeText={text => setFullName(text)}
									/>
								</View>
								<View className="mt-4 w-full">
									<Text className="text-md text-gray-600 font-bold">Password</Text>
									<TextInput
										className="border-b-2 border-b-gray-500 text-lg py-3"
										// value={value}
										// keyboardType="default"
										onChangeText={text => setPassword(text)}
									/>
								</View>
								<View className="mt-4 w-full">
									<Text className="text-md text-gray-600 font-bold">Email</Text>
									<TextInput
										className="border-b-2 border-b-gray-500 text-lg py-3"
										// value={value}
										// keyboardType="default"
										onChangeText={text => setEmail(text)}
									/>
								</View>
								<View className="mt-4 w-full">
									<Text className="text-md text-gray-600 font-bold">No. HP</Text>
									<TextInput
										className="border-b-2 border-b-gray-500 text-lg py-3"
										// value={value}
										// keyboardType="default"
										onChangeText={text => setPhone(text)}
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
										password: password
									};

									const newKaryawan = await CreateUser(data);

									if (newKaryawan instanceof AxiosError) {
										console.log(newKaryawan);
									} else {
										setKaryawan([...karyawan, newKaryawan.data.data.user]);

										await storage.save({
											key: "karyawan",
											data: karyawan
										});
									}
								}}>
								<View className="bg-[#DEE9FD] rounded-full mt-6">
									<Text className="text-gray-600 px-3 py-2 font-semibold text-center text-xl">Tambah</Text>
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
				<View className="items-center h-full justify-center">
					<View className="bg-[#f0fafd] rounded-2xl w-full lg:w-[40%] p-5">
						<View className="flex-row justify-between">
							<Text className="text-gray-600 text-2xl font-bold">Edit Karyawan</Text>
							<TouchableOpacity onPress={() => setShowUpdateModal(false)}>
								<FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
							</TouchableOpacity>
						</View>
						<ScrollView showsVerticalScrollIndicator={false}>
							<View className="flex-col justify-center items-center my-5">
								{/* <Text className="text-2xl font-bold">Riwayat Presensi</Text> */}
								<View className="mt-4 w-full">
									<Text className="text-md text-gray-600 font-bold">Nama Lengkap</Text>
									<TextInput
										defaultValue={fullName}
										className="border-b-2 border-b-gray-500 text-lg py-3"
										keyboardType="default"
										onChangeText={text => setFullName(text)}
									/>
								</View>
								<View className="mt-4 w-full">
									<Text className="text-md text-gray-600 font-bold">Email</Text>
									<TextInput
										className="border-b-2 border-b-gray-500 text-lg py-3"
										// value={value}
										// keyboardType="default"
										defaultValue={email}
										onChangeText={text => setEmail(text)}
									/>
								</View>
								<View className="mt-4 w-full">
									<Text className="text-md text-gray-600 font-bold">No. HP</Text>
									<TextInput
										className="border-b-2 border-b-gray-500 text-lg py-3"
										// value={value}
										// keyboardType="default"
										defaultValue={phone}
										onChangeText={text => setPhone(text)}
									/>
								</View>
							</View>
							<TouchableOpacity
								onPress={async () => {
									setShowUpdateModal(false);
									const data: IUserData = {
										fullName: fullName,
										email: email,
										phone: phone,
										password: password
									};

									const updatedKaryawan = await UpdateUser(karyawanId, data);

									if (updatedKaryawan instanceof AxiosError) {
										console.log(updatedKaryawan);
									} else {
										const index = karyawan.findIndex(k => k.id === updatedKaryawan.data.data.user.id);
										karyawan[index] = updatedKaryawan.data.data.user;

										setKaryawan(karyawan);

										await storage.save({
											key: "karyawan",
											data: karyawan
										});
									}
								}}>
								<View className="bg-[#DEE9FD] rounded-full mt-6">
									<Text className="text-gray-600 px-3 py-2 font-semibold text-center text-xl">Submit</Text>
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
			<Modal animationType="fade" transparent={true} visible={showDeleteConfrim}>
				<View className="items-center h-full justify-center">
					<View className="bg-[#f0fafd] rounded-2xl w-full lg:w-[40%] p-5">
						<View className="flex-row justify-between">
							<Text className="text-gray-600 text-2xl font-bold">Apakah anda yakin?</Text>
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
									<Text className="text-gray-600 px-3 py-2 font-semibold text-center text-xl">Yakin</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		);
	}
};

export default WebAdmin;
