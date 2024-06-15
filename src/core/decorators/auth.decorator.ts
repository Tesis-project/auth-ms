import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Auth_Guard } from "../guards/auth.guard";


export function Auth() {

    return applyDecorators(
        // RoleProtect(...roles),
        // UseGuards(AuthGuard('jwt'), AuthGuard())
        UseGuards(AuthGuard('jwt'), Auth_Guard)



        // UseGuards(AuthGuard, RolesGuard),
        // ApiBearerAuth(),
        // ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}

// export function Auth_Admin_Internal() {

//     return applyDecorators(
//         UseGuards(AuthGuard('jwt'), Admin_Internal_Guard)
//     );
// }

// export function Auth_SameID() {

//     return applyDecorators(
//         // RoleProtect(...roles),
//         UseGuards(AuthGuard('jwt'), SameUserAuthGuard)

//         // UseGuards(AuthGuard, RolesGuard),
//         // ApiBearerAuth(),
//         // ApiUnauthorizedResponse({ description: 'Unauthorized' }),
//     );
// }

// export function Auth_SameIdOrAdmin() {

//     return applyDecorators(
//         // RoleProtect(...roles),
//         UseGuards(AuthGuard('jwt'), SameUserOrAdminGuard)

//         // UseGuards(AuthGuard, RolesGuard),
//         // ApiBearerAuth(),
//         // ApiUnauthorizedResponse({ description: 'Unauthorized' }),
//     );
// }

