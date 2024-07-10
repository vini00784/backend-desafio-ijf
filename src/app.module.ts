import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import * as path from "node:path";
import * as Resolvers from "./graphql/resolvers";
import { JwtModule } from '@nestjs/jwt';
import { JwtMiddleware } from './middleware/jwt';

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
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: +configService.get<string>('JWT_EXPIRATION_TIME') },
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [],
  providers: [
    ...Object.values(Resolvers),
    JwtMiddleware
  ]
})
export class AppModule { }
