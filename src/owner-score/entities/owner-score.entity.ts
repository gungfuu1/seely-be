import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('owner_scores')

export class OwnerScore {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text'})
    name: string;
}
