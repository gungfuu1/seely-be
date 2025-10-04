import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ItemSeries } from '../../item-series/entities/item-sery.entity';

@Entity('owner_scores')
export class OwnerScore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;


  // OwnerScore → N ItemSeries
  @OneToMany(() => ItemSeries, (itemSeries) => itemSeries.ownerScore)
  itemSeries: ItemSeries[];
}
