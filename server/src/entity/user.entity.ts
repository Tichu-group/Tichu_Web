import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OAuthProvider } from '../types/auth.type';

@Entity()
class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('varchar', { length: 30 })
  public userName: string;

  @Column('varchar', { length: 10 })
  public oAuthProvider: OAuthProvider;

  @Column('varchar', { length: 200 })
  public oAuthId: string;
}

export default UserEntity;
