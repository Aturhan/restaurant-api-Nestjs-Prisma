import { SetMetadata } from "@nestjs/common"

export const ROLES_KEY = 'role'
export const HasRole = (role: string) => SetMetadata(ROLES_KEY,role)