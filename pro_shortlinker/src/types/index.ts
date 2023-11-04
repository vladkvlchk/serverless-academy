export type TokensType = {
    accessToken: string
    refreshToken: string
}

export type UserModelType = {
    email: string
    password: string
}

export type LinkModelType = {
    id: string,
    short_link: string,
    original_link: string,
    expiration_time: string,
    owner_email: string,
}