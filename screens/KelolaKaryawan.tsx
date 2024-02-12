import { Text, View, ScrollView, StyleSheet, Modal, TouchableOpacity, TextInput } from "react-native";

import { useEffect, useState } from "react";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { DataTable } from "react-native-paper";
import { CreateUser, DeleteUser, GetUsers, UpdateUser } from "../api/admin";
import { AxiosError } from "axios";
import storage from "../utils/storage";
import Spinner from "react-native-loading-spinner-overlay";
import Ionicons from "react-native-vector-icons/Ionicons";

const WebAdmin = () => {
	const [loading, setLoading] = useState(false);
	const [showDeleteConfrim, setShowDeleteConfrim] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [showUpdateModal, setShowUpdateModal] = useState(false);
	const [karyawan, setKaryawan] = useState<IUser[]>([]);
	const [totalKaryawan, setTotalKaryawan] = useState(0);
	const [page, setPage] = useState(0);
	const [karyawanId, setKaryawanId] = useState("");
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const from = page * 25;
	const to = Math.min((page + 1) * 25, totalKaryawan);
	const [visible, setVisible] = useState(false);

	const toggleDropdown = () => {
		setVisible(!visible);
	};

	useEffect(() => {
		setPage(0);

		async function loadKaryawan() {
			setLoading(true);
			const karyawan = await GetUsers(page + 1);
			if (karyawan instanceof AxiosError) {
				console.log(karyawan);
			} else {
				setKaryawan(karyawan.data.data.users);
				setTotalKaryawan(karyawan.data.data.total);
				await storage.save({
					key: "karyawan",
					data: karyawan.data.data.users
				});
			}
			setLoading(false);
		}
		loadKaryawan();
	}, []);

	function sortAscending() {
		let temp = [...karyawan];

		temp.sort((a: IUser, b: IUser) => {
			if (a.created_at < b.created_at) {
				return 1;
			} else if (a.created_at > b.created_at) {
				return -1;
			}
			return 0;
		});
		setKaryawan(temp);
		console.log(temp);
	}
	function sortDescending() {
		let temp = [...karyawan];

		temp.sort((a: IUser, b: IUser) => {
			if (a.created_at < b.created_at) {
				return -1;
			} else if (a.created_at > b.created_at) {
				return 1;
			}
			return 0;
		});
		setKaryawan(temp);
		console.log(temp);
	}
	function sortAZ() {
		let temp = [...karyawan];

		temp.sort((a: IUser, b: IUser) => {
			if (a.fullName < b.fullName) {
				return -1;
			} else if (a.fullName > b.fullName) {
				return 1;
			}
			return 0;
		});
		setKaryawan(temp);
		console.log(temp);
	}
	function sortZA() {
		let temp = [...karyawan];

		temp.sort((a: IUser, b: IUser) => {
			if (a.fullName < b.fullName) {
				return 1;
			} else if (a.fullName > b.fullName) {
				return -1;
			}
			return 0;
		});
		setKaryawan(temp);
		console.log(temp);
	}
	function renderDropdown() {
		if (visible) {
			return (
				<View
					className="absolute top-10 float-right bg-white flex-col rounded-lg shadow-lg w-48"
					style={{ elevation: 999, zIndex: 999 }}>
					<TouchableOpacity
						onPress={() => {
							toggleDropdown();
							sortAZ();
						}}
						className="py-4 border-b border-b-gray-3 v00">
						<Text className="px-2">A-Z</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							toggleDropdown();
							sortZA();
						}}
						className="py-4 border-b border-b-gray-3 v00">
						<Text className="px-2">Z-A</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							toggleDropdown();
							sortAscending();
						}}
						className="py-4 border-b border-b-gray-3 v00">
						<Text className="px-2">Terbaru</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							toggleDropdown();
							sortDescending();
						}}
						className="py-4 border-b border-b-gray-3 v00">
						<Text className="px-2">Terlama</Text>
					</TouchableOpacity>
				</View>
			);
		}
	}
	return (
		<ScrollView className="w-full bg-[#DEE9FD]">
			<Spinner visible={loading} textContent={"Loading..."} />
			<View className="py-6 px-3 lg:px-10 xl:px-24 2xl:px-60">
				<View className="flex-row">
					<View className="flex-row py-4 flex-wrap gap-4 w-[60%]">
						<View className="border rounded-2xl border-gray-400 w-[45%] lg:w-[247px] items-center p-[20] mb-[20] mt-4 flex-row bg-[#f1f6ff]">
							<Ionicons size={32} color="black" name="people-outline" />
							<View className="flex-col ml-4">
								<Text className="text-2xl font-bold text-gray-600">{totalKaryawan}</Text>
								<Text className="text-xl font-semibold text-gray-600">Karyawan</Text>
							</View>
						</View>
					</View>
				</View>
				<View className="flex-row">
					<TouchableOpacity
						onPress={async () => {
							setLoading(true);
							const karyawan = await GetUsers(page + 1);
							if (karyawan instanceof AxiosError) {
								console.log(karyawan);
							} else {
								setKaryawan(karyawan.data.data.users);
								setTotalKaryawan(karyawan.data.data.total);
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
							<Text className="font-semibold">Daftar Karyawan</Text>
							<View className="flex-row gap-2">
								<TouchableOpacity onPress={toggleDropdown} className=" border border-gray-600 rounded-md p-1">
									{renderDropdown()}
									<View className="flex-row justify-end items-center">
										<Text className="font-semibold text-gray-600">Sort By</Text>
										<Ionicons name="chevron-down-outline" size={18} color="gray" />
									</View>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => setShowModal(true)}
									className="p-1 rounded-md border border-gray-600">
									<Text className="font-semibold text-gray-600">Tambah Karyawan</Text>
								</TouchableOpacity>
							</View>
							{renderForm()}
						</View>
					</View>

					<DataTable>
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

						{karyawan.map(karyawan => (
							<DataTable.Row key={karyawan.id} className="py-2 lg:py-4">
								<DataTable.Cell>{karyawan.fullName}</DataTable.Cell>
								<DataTable.Cell>{karyawan.email}</DataTable.Cell>
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
										<TouchableOpacity
											onPress={() => {
												setKaryawanId(karyawan.id);
												setFullName(karyawan.fullName);
												setEmail(karyawan.email);
												setPhone(karyawan.phone);

												setShowUpdateModal(true);
											}}
											className="p-3 bg-blue-200 rounded-md border border-gray-600">
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
							numberOfPages={Math.ceil(totalKaryawan / 25)}
							onPageChange={async page => {
								setLoading(true);
								setPage(page);
								await GetUsers(page + 1);
								const karyawan = await storage.load({ key: "karyawan" });
								const karyawanData: IUser[] = JSON.parse(karyawan);
								const totalKaryawan = await storage.load({
									key: "totalKaryawan"
								});
								setTotalKaryawan(parseInt(totalKaryawan));
								setKaryawan(karyawanData);
								setLoading(false);
							}}
							label={`${from + 1}-${to} of ${totalKaryawan}`}
							showFastPaginationControls
							numberOfItemsPerPage={25}
						/>
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
							<Text className="text-2xl font-bold text-gray-600">Tambah Karyawan</Text>
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
									<Text className="font-bold text-gray-600 text-md">Nama Lengkap</Text>
									<TextInput
										className="py-3 text-lg border-b-2 border-b-gray-500"
										keyboardType="default"
										onChangeText={text => setFullName(text)}
									/>
								</View>
								<View className="mt-4 w-full">
									<Text className="font-bold text-gray-600 text-md">Password</Text>
									<TextInput
										className="py-3 text-lg border-b-2 border-b-gray-500"
										// value={value}
										// keyboardType="default"
										onChangeText={text => setPassword(text)}
									/>
								</View>
								<View className="mt-4 w-full">
									<Text className="font-bold text-gray-600 text-md">Email</Text>
									<TextInput
										className="py-3 text-lg border-b-2 border-b-gray-500"
										// value={value}
										// keyboardType="default"
										onChangeText={text => setEmail(text)}
									/>
								</View>
								<View className="mt-4 w-full">
									<Text className="font-bold text-gray-600 text-md">No. HP</Text>
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
	function renderUpdateForm() {
		return (
			<Modal animationType="fade" transparent={true} visible={showUpdateModal}>
				<View className="justify-center items-center h-full">
					<View className="bg-[#f0fafd] rounded-2xl w-full lg:w-[40%] p-5">
						<View className="flex-row justify-between">
							<Text className="text-2xl font-bold text-gray-600">Edit Karyawan</Text>
							<TouchableOpacity onPress={() => setShowUpdateModal(false)}>
								<FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
							</TouchableOpacity>
						</View>
						<ScrollView showsVerticalScrollIndicator={false}>
							<View className="flex-col justify-center items-center my-5">
								{/* <Text className="text-2xl font-bold">Riwayat Presensi</Text> */}
								<View className="mt-4 w-full">
									<Text className="font-bold text-gray-600 text-md">Nama Lengkap</Text>
									<TextInput
										defaultValue={fullName}
										className="py-3 text-lg border-b-2 border-b-gray-500"
										keyboardType="default"
										onChangeText={text => setFullName(text)}
									/>
								</View>
								<View className="mt-4 w-full">
									<Text className="font-bold text-gray-600 text-md">Email</Text>
									<TextInput
										className="py-3 text-lg border-b-2 border-b-gray-500"
										// value={value}
										// keyboardType="default"
										defaultValue={email}
										onChangeText={text => setEmail(text)}
									/>
								</View>
								<View className="mt-4 w-full">
									<Text className="font-bold text-gray-600 text-md">No. HP</Text>
									<TextInput
										className="py-3 text-lg border-b-2 border-b-gray-500"
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
									setLoading(true);
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
									setLoading(false);
								}}>
								<View className="bg-[#DEE9FD] rounded-full mt-6">
									<Text className="py-2 px-3 text-xl font-semibold text-center text-gray-600">Submit</Text>
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

export default WebAdmin;
