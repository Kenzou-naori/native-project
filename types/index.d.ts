interface IAPIErrorResponse {
	success: boolean;
	message: string;
}

interface IAPIResponseLogin {
	data: {
		token: string;
		user: IUser;
	};
	success: boolean;
}

interface IAPIResponseCreateUser {
	data: {
		token: string;
		user: IUser;
	};
	success: boolean;
}

interface IAPIResponseUpdateUser {
	data: {
		user: IUser;
	};
	success: boolean;
}

interface IAPIResponseDeleteUser {
	data: {
		users: IUser[];
	};
	success: boolean;
}

interface IUser {
	id: string;
	email: string;
	fullName: string;
	phone: string;
	accessLevel: number;
}

interface IUserData {
	email: string;
	fullName: string;
	phone: string;
	password: string;
}

interface IAPIResponseGetCompany {
	data: {
		company: ICompany;
	};
	success: boolean;
}

interface ICompany {
	id: string;
	name: string;
	ipAdresses: string[];
	checkInTime: string;
	checkOutTime: string;
	created_at: string;
	updated_at: string;
}

interface IAPIResponseGetAttendances {
	data: {
		attendances: IAttendance[];
	};
	success: boolean;
}

interface IAPIResponseGetAttendancesWithUser {
	data: {
		attendances: IAttendanceWithUser[];
		total: number;
	};
	success: boolean;
}

interface IAPIResponsePostAttendance {
	data: {
		attendance: IAttendance;
	};
	success: boolean;
}

type IAttendanceStatus = "hadir" | "izin" | "sakit" | "alpa" | "terlambat";
interface IAttendance {
	id: string;
	userId: string;
	ipAddress: string;
	status: IAttendanceStatus;
	date: string;
	checkIn: string;
	checkOut: string;
	created_at: string;
	updated_at: string;
}

interface IAttendanceWithUser extends IAttendance {
	user: IUser;
}

interface IScheduleData {
	title: string;
	startTime: string;
	endTime: string;
	date: string;
}

interface ISchedule {
	id: string;
	title: string;
	startTime: string;
	endTime: string;
	date: string;
	created_at: string;
	updated_at: string;
}

interface IAPIResponseGetSchedule {
	data: {
		schedules: ISchedule[];
	};
	success: boolean;
}

interface IAPIResponsePostSchedule {
	data: {
		schedule: ISchedule;
	};
	success: boolean;
}

interface IAPIResponseGetUser {
	data: {
		user: IUser;
	};
	success: boolean;
}

interface IAPIResponseGetUsers {
	data: {
		users: IUser[];
		total: number;
	};
	success: boolean;
}

interface IAPIPaidLeaveData {
	reason: string;
	startDate: string;
	days: number;
}

interface IPaidLeave {
	id: string;
	userId: string;
	reason: string;
	startDate: string;
	days: number;
	status: number;
	statusBy: string;
	created_at: string;
	updated_at: string;
}

interface IPaidLeaveWithuser extends IPaidLeave {
	user: IUser;
}

interface IAPIResponsePostPaidLeave {
	data: {
		paidLeave: IPaidLeave;
	};
	success: boolean;
}

interface IAPIResponseGetPaidLeave {
	data: {
		paidLeave: IPaidLeave;
	};
	success: boolean;
}

interface IAPIResponseGetPaidLeaves {
	data: {
		paidLeaves: IPaidLeave[];
	};
	success: boolean;
}

interface IAPIResponseGetPaidLeavesWithUser {
	data: {
		paidLeaves: IPaidLeaveWithuser[];
		total: number;
	};
	success: boolean;
}
