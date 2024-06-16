

// const UserStatus_TypeDefault = [
//     "NONE",
//     "VERIFIED",
//     "NOT-VERIFIED",
//     "BLOCKED",
//     "DELETED",
//     "SUSPENDED",
//     "PENDING",
//     "ACTIVE",
//     "INACTIVE"
// ] as const;
// export type AuthStatus_Type = typeof UserStatus_TypeDefault[number];


export enum AuthStatus_Enum {
    NONE = "NONE",
    VERIFIED = "VERIFIED",
    NOT = "NOT",
    BLOCKED = "BLOCKED",
    DELETED = "DELETED",
    SUSPENDED = "SUSPENDED",
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}