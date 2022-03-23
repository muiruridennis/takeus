import { PrimaryGeneratedColumn, Column, BaseEntity, Entity, BeforeInsert, OneToMany } from "typeorm";
import { MinLength } from "class-validator";
import { Exclude } from "class-transformer";
 import Post from "../../posts/entity/posts.entity";


@Entity()
class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ 
        unique: true //unique flag. It indicates that there should not be two users with the same email
    })
    email: string;


    @Column()
    @Exclude()
    password: string;
    @OneToMany(() => Post, (post: Post) => post.creator)
    public posts: Post[];

    @Column({
        nullable: true
      })
      @Exclude()
      public currentHashedRefreshToken?: string;
  
};
export default User;