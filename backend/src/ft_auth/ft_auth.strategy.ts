import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FortytwoStrategy extends PassportStrategy(
  Strategy,
  'oauth2',
) {
  constructor(
    private config: ConfigService,
    private httpService: HttpService,
  ) {
    super(
      {
        authorizationURL:
          'https://api.intra.42.fr/oauth/authorize',
        tokenURL: 'https://api.intra.42.fr/oauth/token',
        clientID: config.get('FORTYTWO_CLIENTID'),
        clientSecret: config.get('FORTYTWO_CLIENTSECRET'),
        callbackURL: 'http://localhost:4000/ft_auth/callback',
        scope: 'public',
      },
      async function (
        accessToken: string,
        refreshToken: string,
        profile: any,
        cb: any,
      ) {
        console.log('Youyouyuyouy', accessToken, profile);

        const headersRequest = {
          Authorization: `Bearer ${accessToken}`,
        };
        const {data} = await firstValueFrom(
          httpService.get('https://api.intra.42.fr/v2/me', {
            headers: headersRequest,
          }),
        );

        console.log('opla', data.login, data.first_name);
        //User.findOrCreate({ exampleId: profile.id }, function (err: any, user: any) {
        //    return cb(err, user);
        return cb(null, profile);
      },
    );
  }
}
