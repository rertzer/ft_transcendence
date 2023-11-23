// import { HttpService } from "@nestjs/axios";
// import { firstValueFrom } from "rxjs";
// import { FtUser } from "./dto/FtUser.dto";
// import { ForbiddenException, ImATeapotException } from "@nestjs/common";
// import { PrismaUserService } from "src/prisma/user/prisma.user.service";


// async function validateUser(dto: FtUser) {

//   const prismaUser = new PrismaUserService;
//   let user = await this.prismaUser.getUserByLogin(dto.login);
//   console.log("USSSSSSSSSSSSSSSSER is ", user);
//   if (!user) {
//     user = await this.prismaUser.createUser(dto);
//   }
//   console.log("usssssssssser is now", user);
//   if (!user) {
//     throw new ImATeapotException("For real: I'm a Teapot");
//   }
//   return user;
// }


// export default async function fetchFtUser (accessToken: string, cb:any){
//     const headersRequest = {
//         Authorization: `Bearer ${accessToken}`,
//       };
//       const httpService = new HttpService;
//       try {
//         const { data } = await firstValueFrom(
//           httpService.get('https://api.intra.42.fr/v2/me', {
//             headers: headersRequest,
//           }),
//         );
//         const user: FtUser = {
//           login: data.login,
//           first_name: data.first_name,
//           last_name: data.last_name,
//           username: data.usual_full_name,
//           email: data.email,
//         };
//         const pong_user = validateUser(user);
//         return cb(null, pong_user);
//       } catch (error) {
//         throw new ForbiddenException('42, we have a problem');
//       }
// }