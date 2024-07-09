import { Field, InterfaceType } from "@nestjs/graphql";
import { BaseEntity } from "./base-entity";

@InterfaceType()
export abstract class User extends BaseEntity {
    @Field(() => String, { nullable: false })
    name: string;

    @Field(() => String, { nullable: false })
    username: string;

    @Field(() => String, { nullable: false })
    password: string;
}