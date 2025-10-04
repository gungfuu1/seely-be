import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Rating } from '../../rating/entities/rating.entity';
import { OwnerScore } from '../../owner-score/entities/owner-score.entity';
import { User } from '../../users/entities/user.entity';
import { Average } from '../../averages/entities/average.entity';

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

  @ManyToOne(() => Rating, { eager: true })
  @JoinColumn({ name: 'rating_id' })
  rating: Rating;

  @ManyToOne(() => OwnerScore, { eager: true })
  @JoinColumn({ name: 'owner_score_id' })
  ownerScore: OwnerScore;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Average, (avg) => avg.itemSeries)
averages: Average[];

  @Column({ type: 'float', nullable: true })
  avg_rating: number;

  @Column({ type: 'int', nullable: true })
  rating_count: number;
}
