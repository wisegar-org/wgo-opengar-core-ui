import { SuccessResponse, ErrorResponse } from './BasicResponse'

export class UserResponse {
    id: number
    token: string
    name: string
    lastName: string
    userName: string
    email: string
    profileImage: string
    roles: string[]

    /**
     *
     */
    constructor(id: number, name: string, lastName: string, userName: string, email:string, token: string, profileImage: string, roles: string[]) {
        this.id = id
        this.name = name
        this.lastName = lastName
        this.userName = userName
        this.email = email
        this.token = token
        this.profileImage = profileImage
        this.roles = roles
    }
}
export class UserLoginSuccessResponse extends SuccessResponse {
    user: UserResponse
    /**
     *
     */
    constructor(id: number, name: string, lastName: string, userName: string, email:string, token: string, profileImage: string, roles: string[]) {
        super()
        this.user = new UserResponse(id, name, lastName, userName, email, token, profileImage, roles)
    }
}

export class UserLoginErrorResponse extends ErrorResponse {
    isCheckEmailError: Boolean

    /**
     *
     */
    constructor(message?: string, isCheckEmailError?: Boolean) {
        super(message);
        this.isCheckEmailError = !!isCheckEmailError
    }
}