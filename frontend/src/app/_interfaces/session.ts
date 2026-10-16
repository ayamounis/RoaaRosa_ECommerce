export interface ISession {
    user: IUser
    expires: string
}

export interface IUser {
    name: string
    email: string
    id: string
}