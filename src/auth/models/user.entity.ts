import {
  AfterInsert,
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  import { Role } from './role.enum';
  
  @Entity('user')
  export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    firstName: string;
  
    @Column()
    lastName: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column({ select: false })
    password: string;
  
    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role: Role;

    @AfterInsert()
    logInsert() {
      console.log('Inserted User with id', this.id);
    }

    @BeforeInsert()
  @BeforeUpdate()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}