import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ListeningHistory, ListeningHistoryDocument } from './schemas/listening-history.schema';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(ListeningHistory.name) private historyModel: Model<ListeningHistoryDocument>,
  ) {}

  async recordListen(userId: string, songId: string) {
    const record = new this.historyModel({ userId, songId });
    return record.save();
  }

  async getListeningHistory(userId: string, limit = 50) {
    return this.historyModel
      .find({ userId })
      .populate('songId')
      .sort({ playedAt: -1 })
      .limit(limit)
      .lean();
  }
}
