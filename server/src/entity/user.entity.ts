import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public uuid: string;
}

export default UserEntity;
