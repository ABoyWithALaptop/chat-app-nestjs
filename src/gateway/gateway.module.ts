import { Module } from '@nestjs/common';
import { Services } from 'src/utils/constants';
import { MessingGateway } from './gateway';
import { GatewaySessionManager } from './gateway.session';

@Module({
  providers: [
    MessingGateway,
    {
      provide: Services.GATEWAY_SESSION_MANAGER,
      useClass: GatewaySessionManager,
    },
  ],
})
export class GatewayModule {}
