export interface User {
    id?: string;
    username: string;
    email: string;
    password: string;
    roles?: string[];
    userRoles?: {
        role: {
            name: string;
        };
    }[];
}
