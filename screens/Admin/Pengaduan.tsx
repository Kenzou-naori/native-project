import { GetPaidLeaves, SetPaidLeaveStatus } from "../../api/admin";
import { formatDate, formatISODate } from "../../api/util";

import storage from "../../utils/storage";

import { Text, View, ScrollView, Modal, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { DataTable } from "react-native-paper";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";

import Spinner from "react-native-loading-spinner-overlay";
import Ionicons from "react-native-vector-icons/Ionicons";

const PengaduanUser = () => {
  const [loading, setLoading] = useState(true);
  const [showCek, setShowCek] = useState(false);
  const [cuti, setCuti] = useState<IPaidLeaveWithuser[]>([]);
  const [totalCuti, setTotalCuti] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const from = page * 25;
  const to = Math.min((page + 1) * 25, cuti.length);

  useEffect(() => {
    setPage(0);

    async function loadCuti() {
      const cuti = await storage.load({ key: "cuti" });
      const cutiData = JSON.parse(cuti);
      const totalCuti = await storage.load({ key: "totalCuti" });

      setTotalCuti(parseInt(totalCuti));
      setCuti(cutiData);
      setLoading(false);
    }

    loadCuti();
  }, []);

  return (
    <ScrollView className="w-full bg-[#DEE9FD]">
      <Spinner visible={loading} textContent={"Loading..."} />
      {/* refresh */}
      <View className="px-3 py-6 lg:px-10 xl:px-24 2xl:px-60">
        <View className="flex-row">
          <TouchableOpacity
            onPress={async () => {
              setLoading(true);
              const res = await GetPaidLeaves(page + 1);
              if (!(res instanceof AxiosError)) {
                setCuti(res.data.data.paidLeaves);
                setLoading(false);
              }
              setLoading(false);
            }}
            className="my-4 w-32 rounded-md bg-blue-500 p-3"
          >
            <Text className="text-center text-white">
              <Ionicons color="white" name="refresh-circle-outline" size={17} />
              Refresh
            </Text>
          </TouchableOpacity>
        </View>
        <View className="mb-6 rounded-md bg-[#f1f6ff] shadow-lg">
          <View className="p-4">
            <View className="flex-row items-center justify-between">
              <Text className="font-semibold">Daftar Pengaduan Karyawan</Text>

              {renderCek()}
            </View>
          </View>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Nama</DataTable.Title>
              <DataTable.Title>Email</DataTable.Title>
              <DataTable.Title>Pengaduan</DataTable.Title>
              <DataTable.Title>Status</DataTable.Title>
              <DataTable.Title>Aksi</DataTable.Title>
            </DataTable.Header>

            {cuti.length === 0 && (
              <DataTable.Row>
                <DataTable.Cell>No data</DataTable.Cell>
                <DataTable.Cell>No data</DataTable.Cell>
                <DataTable.Cell>No data</DataTable.Cell>
                <DataTable.Cell>No data</DataTable.Cell>
                <DataTable.Cell>No data</DataTable.Cell>
              </DataTable.Row>
            )}

            {cuti.map((cutit) => (
              <DataTable.Row key={cutit.id} className="py-2 lg:py-4">
                <DataTable.Cell>{cutit.user.fullName}</DataTable.Cell>
                <DataTable.Cell>{cutit.user.email}</DataTable.Cell>
                <DataTable.Cell>{cutit.reason}</DataTable.Cell>
                <DataTable.Cell>
                  {cutit.status === 0
                    ? "Pending"
                    : cutit.status === 1
                      ? "Sudah Betul"
                      : "Ditolak"}
                </DataTable.Cell>
                <DataTable.Cell>
                  {cutit.status < 1 ? (
                    <>
                      <TouchableOpacity
                        onPress={() =>
                          SetPaidLeaveStatus(cutit.id, "1").then(() => {
                            const newCuti = cutit;
                            newCuti.status = 1;
                            setCuti(
                              cuti.map((c) =>
                                c.id === cutit.id ? newCuti : c,
                              ),
                            );
                          })
                        }
                        className="mr-1 rounded-md border border-gray-600 bg-green-200 p-3"
                      >
                        <Text className="text-gray-600">Sudah Selesai</Text>
                      </TouchableOpacity>
                      {/* <TouchableOpacity
                        onPress={async () =>
                          await SetPaidLeaveStatus(cutit.id, "2").then(() => {
                            const newCuti = cutit;
                            newCuti.status = 2;
                            setCuti(
                              cuti.map((c) =>
                                c.id === cutit.id ? newCuti : c,
                              ),
                            );
                          })
                        }
                        className="ml-1 rounded-md border border-gray-600 bg-red-200 p-3"
                      >
                        <Text className="text-gray-600">Tolak</Text>
                      </TouchableOpacity> */}
                    </>
                  ) : (
                    <>
                      <Text className="mr-1 rounded-md border border-gray-600 bg-gray-200 p-3">
                        Sudah dibetulkan
                      </Text>
                    </>
                  )}
                </DataTable.Cell>
              </DataTable.Row>
            ))}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(totalCuti / 25)}
              onPageChange={async (page) => {
                setLoading(true);
                setPage(page);
                await GetPaidLeaves(page + 1);
                const paidLeaves = await storage.load({ key: "paidLeaves" });
                const paidLeavesData: IPaidLeaveWithuser[] =
                  JSON.parse(paidLeaves);
                const totalCuti = await storage.load({
                  key: "totalPaidLeaves",
                });
                setTotalCuti(parseInt(totalCuti));
                setCuti(paidLeavesData);
                setLoading(false);
              }}
              label={`${from + 1}-${to} of ${totalCuti}`}
              showFastPaginationControls
              numberOfItemsPerPage={25}
            />
          </DataTable>
        </View>
      </View>
    </ScrollView>
  );
  function renderCek() {
    return (
      <Modal animationType="fade" transparent={true} visible={showCek}>
        <View className="h-full items-center justify-center">
          <View className="w-full rounded-2xl bg-[#f0fafd] p-5 lg:w-[40%]">
            <View className="flex-row justify-between">
              <Text className="text-2xl font-bold text-gray-600">
                Tambah Karyawan
              </Text>
              <TouchableOpacity onPress={() => setShowCek(false)}>
                <FontAwesomeIcon icon={faSquareXmark} size={25} color="red" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="my-5 flex-col justify-center">
                <Text className="text-center text-2xl font-bold text-gray-600">
                  Profile
                </Text>
                <View className="mt-4">
                  <Text className="text-md text-gray-500">Nama Lengkap</Text>
                  <Text className="border-b-2 border-b-gray-500 py-2 text-xl">
                    fullName
                  </Text>
                </View>
                <View className="mt-4">
                  <Text className="text-md text-gray-500">Alamat Email</Text>
                  <Text className="border-b-2 border-b-gray-500 py-2 text-xl">
                    email
                  </Text>
                </View>
                <View className="mt-4">
                  <Text className="text-md text-gray-500">Nomor Telepon</Text>
                  <Text className="border-b-2 border-b-gray-500 py-2 text-xl">
                    phone
                  </Text>
                </View>
              </View>
              <View className="flex items-center justify-center">
                <TouchableOpacity
                  onPress={async () => {
                    setShowCek(false);
                  }}
                  className="mb-3 w-full rounded-2xl bg-[#90ee90] p-3"
                >
                  <Text className="text-center text-xl font-bold text-gray-600">
                    Setuju
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    setShowCek(false);
                  }}
                  className="mb-3 w-full rounded-2xl bg-[#DEE9FD] p-3"
                >
                  <Text className="text-center text-xl font-bold text-gray-600">
                    Tolak
                  </Text>
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

export default PengaduanUser;
