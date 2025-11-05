import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GameInstanceDocument = GameInstance & Document;

class GameRef {
  @Prop({ type: Types.ObjectId, ref: 'GameSession', required: true })
  gameSessionId: Types.ObjectId;
}

@Schema({ collection: 'game_instances', timestamps: true })
export class GameInstance {
  @Prop({
    type: [GameRef],
    default: [],
  })
  games: GameRef[];
}

export const GameInstanceSchema = SchemaFactory.createForClass(GameInstance);
