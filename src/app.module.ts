import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UserRepository } from './users/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from './cats/cats-shema';
import { CatsRepository } from './cats/cats.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMongoUri } from './getMongoUri';
import { PostController } from './posts/post.controller';
import { AuthController } from './auth/auth.controller';
import { BlogController } from './blogs/blog.controller';
import { CommentsController } from './comments/comments.controller';
import { DeviceController } from './devices/device.controller';
import { UsersQueryRepository } from './users/usersQuery.repository';
import { AuthRepository } from './auth/auth.repository';
import { AuthService } from './auth/auth.service';
import { BlogRepository } from './blogs/blog.repository';
import { BlogQueryRepository } from './blogs/blogQuery.repository';
import { BlogService } from './blogs/blogs.service';
import { CommentsService } from './comments/comments.service';
import { CommentsRepository } from './comments/comments.repository';
import { CommentsQueryRepository } from './comments/commentsQuery.repository';
import { DeviceQueryRepository } from './devices/deviceQuery.repository';
import { DeviceService } from './devices/device.service';
import { DeviceRepository } from './devices/device.repository';
import { PostService } from './posts/post.service';
import { PostQueryRepository } from './posts/postQuery.repository';
import { PostRepository } from './posts/post.repository';
import { JwtService } from './jwt/jwt.service';
import { Helpers } from './helpers/helpers';
import { LikeStatus, LikeStatusSchema } from './likeStatus/likeStatus.type';

import { Device, DeviceSchema } from './devices/device.types';
import { Blog, BlogSchema } from './blogs/blog.schema';
import {
  LoginAttempt,
  LoginAttemptSchema,
  RecoveryCode,
  RecoveryCodeSchema,
} from './auth/auth.schema';
import { Comment, CommentsSchema } from './comments/comment.schema';
import { Post, PostSchema } from './posts/post.schema';
import { User, UsersSchema } from './users/user.schema';
import { TestingController } from './testingDelete/testing.controller';
import { TestingService } from './testingDelete/testing.service';
import { TestingRepository } from './testingDelete/testing.repository';
import { BasicStrategy } from './auth/strategies/basic.strategy';
import { BasicAuthGuard } from './auth/guards/basic-auth.guard';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { settings } from './settings';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCommentForPost } from './comments/application/use-cases/CreateCommentForPost';
import { DeleteCommentById } from './comments/application/use-cases/DeleteCommentById';
import { UpdateCommentById } from './comments/application/use-cases/UpdateCommentById';
import { UpdateCommentLikeStatusById } from './comments/application/use-cases/UpdateCommentLikeStatusById';
import { CreateUser } from './users/application/use-cases/CreateUser';
import { DeleteUser } from './users/application/use-cases/DeleteUser';
import { FindUserById } from './users/application/use-cases/FindUserById';
import { CreatePost } from './posts/application/use-cases/CreatePost';
import { CreatePostForExistingBlog } from './posts/application/use-cases/CreatePostForExistingBlog';
import { DeletePost } from './posts/application/use-cases/DeletePost';
import { UpdatePost } from './posts/application/use-cases/UpdatePost';
import { UpdatePostLikeStatusById } from './posts/application/use-cases/UpdatePostLikeStatusById';
import { GetUserIdByAccessToken } from './jwt/application/use-cases/GetUserIdByAccessToken';
import { GetUserIdByRefreshToken } from './jwt/application/use-cases/GetUserIdByRefreshToken';
import { GetTokenInfoByRefreshToken } from './jwt/application/use-cases/GetTokenInfoByRefreshToken';
import { CreateRefreshJWT } from './jwt/application/use-cases/CreateRefreshJWT';
import { CreateJWT } from './jwt/application/use-cases/CreateJWT';
import { DeleteOtherUserDevice } from './devices/application/use-cases/DeleteOtherUserDevice';
import { DeleteUserDeviceById } from './devices/application/use-cases/DeleteUserDeviceById';
import { CreateBlog } from './blogs/application/use-cases/CreateBlog';
import { DeleteBlog } from './blogs/application/use-cases/DeleteBlog';
import { UpdateBlog } from './blogs/application/use-cases/UpdateBlog';
import { CreateUserByRegistration } from './auth/application/use-cases/CreateUserByRegistration';
import { ConfirmEmail } from './auth/application/use-cases/ConfirmEmail';
import { ConfirmAndChangePassword } from './auth/application/use-cases/ConfirmAndChangePassword';
import { CheckCredential } from './auth/application/use-cases/CheckCredential';
import { ChangeUserConfirmationCode } from './auth/application/use-cases/ChangeUserConfirmationCode';
import { AddRecoveryCodeAndEmail } from './auth/application/use-cases/AddRecoveryCodeAndEmail';
import { AddDeviceInfoToDB } from './auth/application/use-cases/AddDeviceInfoToDB';
import { BlogExistsRule, PostExistsRule } from './posts/post.types';

const providers = [
  AppService,
  UsersService,
  UserRepository,
  UsersQueryRepository,
  CatsRepository,
  AuthRepository,
  AuthService,
  BlogRepository,
  BlogQueryRepository,
  BlogService,
  CommentsService,
  CommentsRepository,
  CommentsQueryRepository,
  DeviceQueryRepository,
  DeviceService,
  DeviceRepository,
  PostService,
  PostQueryRepository,
  PostRepository,
  JwtService,
  Helpers,
  TestingService,
  TestingRepository,
  ConfigService,
  BasicStrategy,
  BasicAuthGuard,
  JwtStrategy,
  JwtAuthGuard,
  LocalAuthGuard,
  LocalStrategy,
  BlogExistsRule,
  PostExistsRule,
];
const useCases = [
  CreateCommentForPost,
  DeleteCommentById,
  UpdateCommentById,
  UpdateCommentLikeStatusById,
  CreateUser,
  DeleteUser,
  FindUserById,
  CreatePost,
  CreatePostForExistingBlog,
  DeletePost,
  UpdatePost,
  UpdatePostLikeStatusById,
  GetUserIdByAccessToken,
  GetUserIdByRefreshToken,
  GetTokenInfoByRefreshToken,
  CreateRefreshJWT,
  CreateJWT,
  DeleteOtherUserDevice,
  DeleteUserDeviceById,
  CreateBlog,
  DeleteBlog,
  UpdateBlog,
  CreateUserByRegistration,
  ConfirmEmail,
  ConfirmAndChangePassword,
  CheckCredential,
  ChangeUserConfirmationCode,
  AddRecoveryCodeAndEmail,
  AddDeviceInfoToDB,
];

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(getMongoUri()),
    JwtModule.register({
      secret: settings.JWT_SECRET,
      signOptions: { expiresIn: '10m' },
    }),
    MongooseModule.forFeature([
      { name: Cat.name, schema: CatSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: LikeStatus.name, schema: LikeStatusSchema },
      { name: RecoveryCode.name, schema: RecoveryCodeSchema },
      { name: LoginAttempt.name, schema: LoginAttemptSchema },
      { name: User.name, schema: UsersSchema },
      { name: Device.name, schema: DeviceSchema },
      { name: Comment.name, schema: CommentsSchema },
    ]),
  ],
  controllers: [
    AppController,
    UsersController,
    PostController,
    AuthController,
    BlogController,
    CommentsController,
    DeviceController,
    TestingController,
  ],
  providers: [...providers, ...useCases],
})
export class AppModule {}
