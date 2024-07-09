import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import * as path from "node:path";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      sortSchema: true,
      playground: true,
      introspection: true,
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), "dist", "schema.gql")
    }),
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
