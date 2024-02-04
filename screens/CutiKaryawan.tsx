import { Text, View, ScrollView, Modal, TouchableOpacity } from "react-native";

import React, { useState } from "react";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { DataTable } from "react-native-paper";
import { GetPaidLeaves, SetPaidLeaveStatus } from "../api/admin";
import { AxiosError } from "axios";
import Spinner from "react-native-loading-spinner-overlay";

const WebAdmin = () => {
	const [loading, setLoading] = useState(true);
	const [showCek, setShowCek] = useState(false);
	const [cuti, setCuti] = useState<IPaidLeaveWithuser[]>([]);
	const [page, setPage] = React.useState<number>(0);
	const [numberOfItemsPerPageList] = React.useState([10, 20, 30]);
	const [itemsPerPage, onItemsPerPageChange] = React.useState(numberOfItemsPerPageList[0]);
	const from = page * itemsPerPage;
	const to = Math.min((page + 1) * itemsPerPage, cuti.length);

	React.useEffect(() => {
		setPage(0);

		const fetchCuti = async () => {
			await GetPaidLeaves().then(res => {
				if (res instanceof AxiosError) {
					console.log(res);
					setLoading(false);
				} else {
					setCuti(res.data.data.paidLeaves);
					setLoading(false);
				}
			});
		};

		fetchCuti();
	}, [itemsPerPage]);

	return (
		<ScrollView className="w-full bg-[#DEE9FD]">
			<Spinner visible={loading} textContent={"Loading..."} />
			<View className="px-3 lg:px-60 py-6">
				<View className="bg-[#f1f6ff] mb-6 rounded-md shadow-lg">
					<View className="p-4">
						<View className="flex-row items-center justify-between">
							<Text className=" font-semibold">Daftar Cuti Karyawan</Text>

							{renderCek()}
						</View>
					</View>
					<DataTable>
						{/* <ScrollView horizontal contentContainerStyle={{ flexDirection: 'column' }}> */}
						<DataTable.Pagination
							page={page}
							numberOfPages={Math.ceil(cuti.length / itemsPerPage)}
							onPageChange={page => setPage(page)}
							label={`${from + 1}-${to} of ${cuti.length}`}
							numberOfItemsPerPageList={numberOfItemsPerPageList}
							numberOfItemsPerPage={itemsPerPage}
							onItemsPerPageChange={onItemsPerPageChange}
							showFastPaginationControls
							selectPageDropdownLabel={"Rows per page"}
						/>
						<DataTable.Header>
							<DataTable.Title>Nama</DataTable.Title>
							<DataTable.Title>Email</DataTable.Title>
							<DataTable.Title>Alasan</DataTable.Title>
							<DataTable.Title>Status</DataTable.Title>
							<DataTable.Title>Aksi</DataTable.Title>
						</DataTable.Header>

						{cuti.slice(from, to).map(cutit => (
							<DataTable.Row key={cutit.id} className="py-2 lg:py-4">
								<DataTable.Cell>{cutit.user.fullName}</DataTable.Cell>
								<DataTable.Cell>{cutit.user.email}</DataTable.Cell>
								<DataTable.Cell>{cutit.reason}</DataTable.Cell>
								<DataTable.Cell>
									{cutit.status === 0 ? "Pending" : cutit.status === 1 ? "Diterima" : "Ditolak"}
								</DataTable.Cell>
								<DataTable.Cell>
									{/* <TouchableOpacity
										onPress={() => setShowCek(true)}
										className=" border border-gray-600 bg-yellow-200 p-3 rounded-md">
										<Text className="text-gray-600">Cek Perizinan</Text>
									</TouchableOpacity> */}
									<TouchableOpacity
										onPress={() =>
											SetPaidLeaveStatus(cutit.id, "1").then(() => {
												const newCuti = cutit;
												newCuti.status = 1;
												setCuti(cuti.map(c => (c.id === cutit.id ? newCuti : c)));
											})
										}
										className="border border-gray-600 bg-green-200 p-3 rounded-md mr-1">
										<Text className="text-gray-600">Terima</Text>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={async () =>
											await SetPaidLeaveStatus(cutit.id, "2").then(() => {
												const newCuti = cutit;
												newCuti.status = 2;
												setCuti(cuti.map(c => (c.id === cutit.id ? newCuti : c)));
											})
										}
										className="border border-gray-600 bg-red-200 p-3 rounded-md ml-1">
										<Text className="text-gray-600">Tolak</Text>
									</TouchableOpacity>
								</DataTable.Cell>
							</DataTable.Row>
						))}

						<DataTable.Pagination
							page={page}
							numberOfPages={Math.ceil(cuti.length / itemsPerPage)}
							onPageChange={page => setPage(page)}
							label={`${from + 1}-${to} of ${cuti.length}`}
							numberOfItemsPerPageList={numberOfItemsPerPageList}
							numberOfItemsPerPage={itemsPerPage}
							onItemsPerPageChange={onItemsPerPageChange}
							showFastPaginationControls
							selectPageDropdownLabel={"Rows per page"}
						/>
						{/* </ScrollView> */}
					</DataTable>
				</View>
			</View>
			{/* refresh */}
			<View className="flex flex-row">
				<TouchableOpacity
					onPress={async () => {
						setLoading(true);
						const res = await GetPaidLeaves();
						if (!(res instanceof AxiosError)) {
							setCuti(res.data.data.paidLeaves);
              setLoading(false);
						}
						setLoading(false);
					}}
					className="bg-blue-500 p-3 rounded-md w-32 mt-4 mx-auto">
					<Text className="text-white text-center">Refresh</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
	function renderCek() {
		return (
			<Modal animationType="fade" transparent={true} visible={showCek}>
				<View className="items-center h-full justify-center">
					<View className="bg-[#f0fafd] rounded-2xl w-full lg:w-[40%] p-5">
						<View className="flex-row justify-between">
							<Text className="text-gray-600 text-2xl font-bold">Tambah Karyawan</Text>
							<TouchableOpacity onPress={() => setShowCek(false)}>
								<FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
							</TouchableOpacity>
						</View>
						<ScrollView showsVerticalScrollIndicator={false}>
							<View className="flex-col justify-center my-5">
								<Text className="text-2xl text-gray-600 text-center font-bold">Profile</Text>
								<View className="mt-4">
									<Text className="text-md text-gray-500">Nama Lengkap</Text>
									<Text className="text-xl border-b-2 border-b-gray-500 py-2">fullName</Text>
								</View>
								<View className="mt-4">
									<Text className="text-md text-gray-500">Alamat Email</Text>
									<Text className="text-xl border-b-2 border-b-gray-500 py-2">email</Text>
								</View>
								<View className="mt-4">
									<Text className="text-md text-gray-500">Nomor Telepon</Text>
									<Text className="text-xl border-b-2 border-b-gray-500 py-2">phone</Text>
								</View>
							</View>
							<View className="flex justify-center items-center">
								<TouchableOpacity
									onPress={async () => {
										setShowCek(false);
									}}
									className="bg-[#90ee90] w-full p-3 rounded-2xl mb-3">
									<Text className="text-xl font-bold text-gray-600 text-center">Setuju</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={async () => {
										setShowCek(false);
									}}
									className="bg-[#DEE9FD] w-full p-3 rounded-2xl mb-3">
									<Text className="text-xl font-bold text-gray-600 text-center">Tolak</Text>
								</TouchableOpacity>
							</View>
						</ScrollView>
					</View>
				</View>
				{/* </View> */}
			</Modal>
		);
	}
};

export default WebAdmin;
