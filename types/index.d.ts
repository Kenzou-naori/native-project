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

interface IAPIResponseGetAttendances {
    data: IAttendance[];
    success: boolean;
}

interface IAttendance {
    id: string;
    date: string;
    time: string;
    user: IUser;
}
