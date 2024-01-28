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

interface IAPIResponseRegister {
    data: {
        token: string;
        user: IUser;
    };
    success: boolean;
}

interface IUser {
    id: string;
    email: string;
    fullName: string;
    phone: string;
}

interface IAPIResponseGetCompany {
    data: {
        company: ICompany;
    }
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
