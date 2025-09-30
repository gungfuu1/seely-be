import { User } from '@app/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm';
import { ItemSeries } from './item-sery.entity';

@Entity('averages')
@Unique(['user', 'itemSeries']) 
export class Average {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  score: number;

  @ManyToOne(() => ItemSeries, { nullable: false })
  @JoinColumn({ name: 'item_series_id', referencedColumnName: 'id' })
  itemSeries: ItemSeries;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;
}
