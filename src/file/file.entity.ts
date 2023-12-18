import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalName: string;

  @Column()
  type: string;

  @Column()
  key: string;
}
