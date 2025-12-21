import { User as ApiUser, UserDto as ApiUserDto, UserUserTypeEnum } from "../api/generated/api";

// Re-export generated API models so the rest of the app uses the server contract directly.
export type User = ApiUser;
export type UserDto = ApiUserDto;
export type UserType = typeof UserUserTypeEnum[keyof typeof UserUserTypeEnum];
export const UserType = UserUserTypeEnum;