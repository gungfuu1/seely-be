import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ItemSeries } from '../../item-series/entities/item-sery.entity';

@Entity('rating')
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  // 1 Rating → N ItemSeries
  @OneToMany(() => ItemSeries, (itemSeries) => itemSeries.rating)
  itemSeries: ItemSeries[];
}
