import { IoAdapter } from '@nestjs/platform-socket.io';
import { Repository } from 'typeorm';
import { Session, User } from 'src/utils/typeorm';
import { AuthenticatedSocket } from 'src/utils/interfaces';
import { INestApplicationContext } from '@nestjs/common';
import { Services } from 'src/utils/constants';
import * as cookie from 'cookie';
import * as cookieParser from 'cookie-parser';
import { plainToInstance } from 'class-transformer';

export class WebSocketAdapter extends IoAdapter {
  private sessionRepository: Repository<Session>;
  constructor(appOrHttpServer?: INestApplicationContext) {
    super(appOrHttpServer);
    this.sessionRepository = appOrHttpServer.get(
      Services.AUTH,
    ).sessionRepository;
  }
  createIOServer(port: number, options?: any) {
    // const sessionRepository = getRepository(Session);
    const sever = super.createIOServer(port, options);
    sever.use(async (socket: AuthenticatedSocket, next) => {
      console.log('inside websocket adapter');
      const { cookie: clientCookie } = socket.handshake.headers;

      if (!clientCookie) {
        console.log('client has no cookie');
        return next(new Error('not Authenticated'));
      }
      const { CHAT_APP_SESSION_ID } = cookie.parse(clientCookie);
      const signedCookie = cookieParser.signedCookie(
        CHAT_APP_SESSION_ID,
        process.env.COOKIE_SECRET,
      );
      if (!signedCookie) return next(new Error('Error signing cookie'));
      const sessionDB = await this.sessionRepository.findOne({
        where: { id: signedCookie },
      });
      const user = JSON.parse(sessionDB.json).passport.user;
      const userSerialized = plainToInstance(User, user);
      socket.user = userSerialized;
      next();
    });
    return sever;
  }
}
