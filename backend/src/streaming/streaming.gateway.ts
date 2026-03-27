import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:3000' },
  namespace: '/streaming',
})
export class StreamingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.query?.token;
      if (!token) {
        client.disconnect();
        return;
      }
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'secret',
      });
      const userId = payload.sub;
      const deviceId = (client.handshake.query?.deviceId as string) || client.id;
      client.data.userId = userId;
      client.data.deviceId = deviceId;
      await client.join(`user:${userId}`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Cleanup handled by socket.io
  }

  /** Notify all of user's devices except the new active one to stop playback */
  notifyDeviceTakenOver(userId: string, activeDeviceId: string) {
    this.server.to(`user:${userId}`).emit('device_taken_over', {
      activeDeviceId,
      message: 'Another device is playing on your account.',
    });
  }
}
