import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Rating } from '../../rating/entities/rating.entity';
import { OwnerScore } from '../../owner-score/entities/owner-score.entity';
import { User } from '../../users/entities/user.entity';

@Entity('item_series')
export class ItemSeries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  // FK → rating
  @ManyToOne(() => Rating, { eager: true })
  @JoinColumn({ name: 'rating_id' })
  rating: Rating;

  // FK → owner_scores
  @ManyToOne(() => OwnerScore, { eager: true })
  @JoinColumn({ name: 'owner_score_id' })
  ownerScore: OwnerScore;

  // FK → users
  @ManyToOne(() => User, { eager: false })
@JoinColumn({ name: 'user_id' })
user: User;

  @Column({ type: 'float', nullable: true })
  avg_rating: number;

  @Column({ type: 'int', nullable: true })
  rating_count: number;
}
