import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { SessionEntity as ISessionEntity } from 'typeorm-store';

@Entity()
class SessionEntity extends BaseEntity implements ISessionEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  expiresAt: number;

  @Column()
  data: string;
}

export default SessionEntity;
