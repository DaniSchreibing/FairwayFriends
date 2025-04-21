import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { UserRole } from "./Roles.enum";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  age!: number;

  @Column()
  UserID!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: true,
  })
  Role!: UserRole;
}
