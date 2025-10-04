import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ItemSeries } from '../../item-series/entities/item-sery.entity';

@Entity('averages')
export class Average {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  score: number;

  @Column({ nullable: false })
  username: string;

  @ManyToOne(() => ItemSeries, (series) => series.averages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_series_id' })
  itemSeries: ItemSeries;
}
