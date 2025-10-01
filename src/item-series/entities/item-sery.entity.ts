import { OwnerScore } from '@app/owner-score/entities/owner-score.entity';
import { Rating } from '@app/rating/entities/rating.entity';
import { User } from '@app/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'item_series' })
export class ItemSeries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column()
  description: string;

  @ManyToOne(() => Rating)
  @JoinColumn({ name: 'rating', referencedColumnName: 'id' })
  rating: Rating;

  @ManyToOne(() => OwnerScore)
  @JoinColumn({ name: 'ownerscore_id', referencedColumnName: 'id' })
  ownerScore: OwnerScore;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @Column({ type: 'float', default: 0 })
  avg_rating: number;

  @Column({ type: 'int', default: 0 })
  rating_count: number;
}
