import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { FtUser } from "./dto/FtUser.dto";
import { ForbiddenException } from "@nestjs/common";

export default async function fetchFtUser (accessToken: string, cb:any){
    const headersRequest = {
        Authorization: `Bearer ${accessToken}`,
      };
      const httpService = new HttpService;
      try {
        const { data } = await firstValueFrom(
          httpService.get('https://api.intra.42.fr/v2/me', {
            headers: headersRequest,
          }),
        );
        const user: FtUser = {
          login: data.login,
          first_name: data.first_name,
          last_name: data.last_name,
          username: data.usual_full_name,
          email: data.email,
        };
        return cb(null, user);
      } catch (error) {
        throw new ForbiddenException('42, we have a problem');
      }
}