import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Session, SessionDocument } from './schemas/session.schema';

@Injectable()
export class SessionsService {
  constructor(@InjectModel(Session.name) private sessionModel: Model<SessionDocument>) {}

  async create(userId: string, deviceId: string, token: string) {
    await this.deactivateOtherSessions(userId, deviceId);
    const session = new this.sessionModel({ userId, deviceId, token, isActive: true });
    return session.save();
  }

  async deactivateOtherSessions(userId: string, exceptDeviceId?: string) {
    const query: any = { userId: new Types.ObjectId(userId), isActive: true };
    if (exceptDeviceId) query.deviceId = { $ne: exceptDeviceId };
    return this.sessionModel.updateMany(query, { isActive: false });
  }

  async getActiveSession(userId: string) {
    return this.sessionModel.findOne({ userId, isActive: true }).lean();
  }

  async getActiveSessionForDevice(userId: string, deviceId: string) {
    return this.sessionModel.findOne({ userId, deviceId, isActive: true }).lean();
  }

  async isDeviceAllowed(userId: string, deviceId: string): Promise<{ allowed: boolean; message?: string }> {
    const activeSession = await this.getActiveSession(userId);
    if (!activeSession) return { allowed: true };
    if (activeSession.deviceId === deviceId) return { allowed: true };
    return {
      allowed: false,
      message: 'Another device is currently playing. Stop playback on that device first.',
    };
  }

  async stopSession(userId: string, deviceId?: string) {
    const query: any = { userId: new Types.ObjectId(userId) };
    if (deviceId) query.deviceId = deviceId;
    return this.sessionModel.updateMany(query, { isActive: false });
  }

  async updateActivity(userId: string, deviceId: string) {
    return this.sessionModel.findOneAndUpdate(
      { userId, deviceId, isActive: true },
      { lastActivity: new Date() },
    );
  }

  async getAllActiveSessions() {
    return this.sessionModel.find({ isActive: true }).populate('userId', 'name email').lean();
  }

  async getSessionsByUser(userId: string) {
    return this.sessionModel.find({ userId }).sort({ lastActivity: -1 }).lean();
  }
}
