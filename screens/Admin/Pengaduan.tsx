import {
  GetFeedbacks,
  GetPaidLeaves,
  SetPaidLeaveStatus,
  UpdateFeedbackStatus,
} from "../../api/admin";
import {
  capitalizeFirstLetter,
  formatDate,
  formatISODate,
} from "../../api/util";

import storage from "../../utils/storage";

import { Text, View, ScrollView, Modal, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { DataTable } from "react-native-paper";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";

import Spinner from "react-native-loading-spinner-overlay";
import Ionicons from "react-native-vector-icons/Ionicons";

const PengaduanUser = () => {
  const [feedbacks, setFeedbacks] = useState<IFeedbackWithUser[]>([]);
  const [totalFeedbacks, setTotalFeedbacks] = useState<number>(0);
  const [showCek, setShowCek] = useState(false);
  const [loading, setLoading] = useState(true);

  const { colorScheme, toggleColorScheme } = useColorScheme();

  const [page, setPage] = useState<number>(0);
  const from = page * 25;
  const to = Math.min((page + 1) * 25, totalFeedbacks);

  useEffect(() => {
    setPage(0);

    async function loadCuti() {
      const feedbacksString = await storage.load({ key: "feedbacks" });
      const feedbacksData = JSON.parse(feedbacksString);
      const totalFeedbacks = await storage.load({ key: "totalFeedbacks" });

      setTotalFeedbacks(parseInt(totalFeedbacks));
      setFeedbacks(feedbacksData);
      setLoading(false);
    }

    loadCuti();
  }, []);

  return (
    <ScrollView className="w-full bg-[#DEE9FD] dark:bg-[#212121]">
      <Spinner visible={loading} textContent={"Loading..."} />
      {/* refresh */}
      <View className="px-3 py-6 lg:px-10 xl:px-24 2xl:px-60">
        <View className="flex-row">
          <TouchableOpacity
            onPress={async () => {
              setLoading(true);
              const res = await GetFeedbacks();
              if (res instanceof AxiosError) {
                setLoading(false);
                return;
              }
              const feedbacks = res.data.data.feedbacks;
              const totalFeedbacks = res.data.data.totalFeedbacks;
              setTotalFeedbacks(totalFeedbacks);
              setFeedbacks(feedbacks);
            }}
            className="my-4 w-32 rounded-md bg-blue-500 p-3"
          >
            <Text className="text-center text-white">
              <Ionicons color="white" name="refresh-circle-outline" size={17} />
              Refresh
            </Text>
          </TouchableOpacity>
        </View>
        <View className="mb-6 rounded-md bg-[#f1f6ff] shadow-lg dark:bg-[#3a3a3a] dark:shadow-white">
          <View className="p-4">
            <View className="flex-row items-center justify-between">
              <Text className="font-semibold text-gray-600 dark:text-neutral-300">
                Daftar Pengaduan Karyawan
              </Text>

              {renderCek()}
            </View>
          </View>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title
                textStyle={{
                  color:
                    colorScheme === "dark"
                      ? "#DEE9FD"
                      : colorScheme == "light"
                        ? "#212121"
                        : "DEE9FD",
                }}
              >
                Nama
              </DataTable.Title>
              <DataTable.Title
                textStyle={{
                  color:
                    colorScheme === "dark"
                      ? "#DEE9FD"
                      : colorScheme == "light"
                        ? "#212121"
                        : "DEE9FD",
                }}
              >
                Email
              </DataTable.Title>
              <DataTable.Title
                textStyle={{
                  color:
                    colorScheme === "dark"
                      ? "#DEE9FD"
                      : colorScheme == "light"
                        ? "#212121"
                        : "DEE9FD",
                }}
              >
                Alasan
              </DataTable.Title>
              <DataTable.Title
                textStyle={{
                  color:
                    colorScheme === "dark"
                      ? "#DEE9FD"
                      : colorScheme == "light"
                        ? "#212121"
                        : "DEE9FD",
                }}
              >
                Tanggal Dikirim
              </DataTable.Title>
              <DataTable.Title
                textStyle={{
                  color:
                    colorScheme === "dark"
                      ? "#DEE9FD"
                      : colorScheme == "light"
                        ? "#212121"
                        : "DEE9FD",
                }}
              >
                Status
              </DataTable.Title>
              <DataTable.Title
                textStyle={{
                  color:
                    colorScheme === "dark"
                      ? "#DEE9FD"
                      : colorScheme == "light"
                        ? "#212121"
                        : "DEE9FD",
                }}
              >
                Aksi
              </DataTable.Title>
            </DataTable.Header>

            {!feedbacks ||
              (feedbacks.length === 0 && (
                <DataTable.Row>
                  <DataTable.Cell
                    textStyle={{
                      color:
                        colorScheme === "dark"
                          ? "#DEE9FD"
                          : colorScheme == "light"
                            ? "#212121"
                            : "DEE9FD",
                    }}
                  >
                    No data
                  </DataTable.Cell>
                  <DataTable.Cell
                    textStyle={{
                      color:
                        colorScheme === "dark"
                          ? "#DEE9FD"
                          : colorScheme == "light"
                            ? "#212121"
                            : "DEE9FD",
                    }}
                  >
                    No data
                  </DataTable.Cell>
                  <DataTable.Cell
                    textStyle={{
                      color:
                        colorScheme === "dark"
                          ? "#DEE9FD"
                          : colorScheme == "light"
                            ? "#212121"
                            : "DEE9FD",
                    }}
                  >
                    No data
                  </DataTable.Cell>
                  <DataTable.Cell
                    textStyle={{
                      color:
                        colorScheme === "dark"
                          ? "#DEE9FD"
                          : colorScheme == "light"
                            ? "#212121"
                            : "DEE9FD",
                    }}
                  >
                    No data
                  </DataTable.Cell>
                  <DataTable.Cell
                    textStyle={{
                      color:
                        colorScheme === "dark"
                          ? "#DEE9FD"
                          : colorScheme == "light"
                            ? "#212121"
                            : "DEE9FD",
                    }}
                  >
                    No data
                  </DataTable.Cell>
                  <DataTable.Cell
                    textStyle={{
                      color:
                        colorScheme === "dark"
                          ? "#DEE9FD"
                          : colorScheme == "light"
                            ? "#212121"
                            : "DEE9FD",
                    }}
                  >
                    No data
                  </DataTable.Cell>
                </DataTable.Row>
              ))}

            {feedbacks &&
              feedbacks.map((cutit) => (
                <DataTable.Row key={cutit.id} className="py-2 lg:py-4">
                  <DataTable.Cell
                    textStyle={{
                      color:
                        colorScheme === "dark"
                          ? "#DEE9FD"
                          : colorScheme == "light"
                            ? "#212121"
                            : "DEE9FD",
                    }}
                  >
                    {cutit.user.fullName}
                  </DataTable.Cell>
                  <DataTable.Cell
                    textStyle={{
                      color:
                        colorScheme === "dark"
                          ? "#DEE9FD"
                          : colorScheme == "light"
                            ? "#212121"
                            : "DEE9FD",
                    }}
                  >
                    {cutit.user.email}
                  </DataTable.Cell>
                  <DataTable.Cell
                    textStyle={{
                      color:
                        colorScheme === "dark"
                          ? "#DEE9FD"
                          : colorScheme == "light"
                            ? "#212121"
                            : "DEE9FD",
                    }}
                  >
                    {cutit.content}
                  </DataTable.Cell>
                  <DataTable.Cell
                    textStyle={{
                      color:
                        colorScheme === "dark"
                          ? "#DEE9FD"
                          : colorScheme == "light"
                            ? "#212121"
                            : "DEE9FD",
                    }}
                  >
                    {formatISODate(cutit.created_at)}
                  </DataTable.Cell>
                  <DataTable.Cell
                    textStyle={{
                      color:
                        colorScheme === "dark"
                          ? "#DEE9FD"
                          : colorScheme == "light"
                            ? "#212121"
                            : "DEE9FD",
                    }}
                  >
                    {capitalizeFirstLetter(cutit.status)}
                  </DataTable.Cell>
                  <DataTable.Cell
                    textStyle={{
                      color:
                        colorScheme === "dark"
                          ? "#DEE9FD"
                          : colorScheme == "light"
                            ? "#212121"
                            : "DEE9FD",
                    }}
                  >
                    {cutit.status === "pending" ? (
                      <>
                        <TouchableOpacity
                          onPress={async () => {
                            setLoading(true);
                            await UpdateFeedbackStatus(
                              cutit.id,
                              "selesai",
                            ).then(() => {
                              const newCuti = cutit;
                              newCuti.status = "selesai";
                              setFeedbacks(
                                feedbacks.map((c) =>
                                  c.id === cutit.id ? newCuti : c,
                                ),
                              );
                            });
                            setLoading(false);
                          }}
                          className="mr-1 rounded-md border border-gray-600 bg-green-200 p-3"
                        >
                          <Text className="text-gray-600">Selesai</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={async () => {
                            setLoading(true);
                            await UpdateFeedbackStatus(cutit.id, "2").then(
                              () => {
                                const newCuti = cutit;
                                newCuti.status = "ditolak";
                                setFeedbacks(
                                  feedbacks.map((c) =>
                                    c.id === cutit.id ? newCuti : c,
                                  ),
                                );
                              },
                            );
                            setLoading(false);
                          }}
                          className="ml-1 rounded-md border border-gray-600 bg-red-200 p-3"
                        >
                          <Text className="text-gray-600">Tolak</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <Text className="mr-1 rounded-md border border-gray-600 bg-gray-200 p-3">
                          Sudah dikonfirmasi
                        </Text>
                      </>
                    )}
                  </DataTable.Cell>
                </DataTable.Row>
              ))}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(totalFeedbacks / 25)}
              onPageChange={async (page) => {
                setLoading(true);
                setPage(page);
                await GetFeedbacks(page).then(async () => {
                  const feedbacks = await storage.load({ key: "paidLeaves" });
                  const feedbacksData: IFeedbackWithUser[] =
                    JSON.parse(feedbacks);
                  const totalCuti = await storage.load({
                    key: "totalFeedbacks",
                  });
                  setTotalFeedbacks(parseInt(totalCuti));
                  setFeedbacks(feedbacksData);
                });
                setLoading(false);
              }}
              label={`${from + 1}-${to} of ${totalFeedbacks}`}
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
