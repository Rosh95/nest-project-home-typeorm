import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Injectable,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from './blogs.service';
import { PostService } from '../posts/post.service';
import { Helpers, queryDataType } from '../helpers/helpers';
import { BlogViewType, CreateBlogDto } from './blogs.types';
import { JwtService } from '../jwt/jwt.service';
import {
  CreatePostDto,
  PaginatorPostViewType,
  PostViewModel,
} from '../posts/post.types';
import { mappingErrorStatus, ResultObject } from '../helpers/heplersType';
import { ParseObjectIdPipe, ParseStringPipe } from '../pipes/ParseObjectIdPipe';
import { Types } from 'mongoose';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { QueryData } from '../helpers/decorators/helpers.decorator.queryData';
import { AccessTokenHeader } from '../users/decorators/user.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePostForExistingBlogCommand } from '../posts/application/use-cases/CreatePostForExistingBlog';
import { CreateBlogCommand } from './application/use-cases/CreateBlog';
import { DeleteBlogCommand } from './application/use-cases/DeleteBlog';
import { UpdateBlogCommand } from './application/use-cases/UpdateBlog';
import { GetUserIdByAccessTokenCommand } from '../jwt/application/use-cases/GetUserIdByAccessToken';
import { SkipThrottle } from '@nestjs/throttler';
import { BlogQueryRepositorySql } from './blogQuery.repository.sql';
import { PostQueryRepositorySql } from '../posts/postQuery.repository.sql';

@Injectable()
@SkipThrottle()
@Controller('blogs')
export class BlogController {
  constructor(
    public blogService: BlogService,
    public blogQueryRepository: BlogQueryRepositorySql,
    public postService: PostService,
    public postQueryRepository: PostQueryRepositorySql,
    public jwtService: JwtService,
    public helpers: Helpers,
    private commandBus: CommandBus,
  ) {}

  @Get()
  async getBlogs(@QueryData() queryData: queryDataType) {
    return await this.blogQueryRepository.getAllBlogs(queryData);
  }

  @Get(':blogId')
  async getBlogById(@Param('blogId', new ParseStringPipe()) blogId: string) {
    const foundBlog: BlogViewType | null =
      await this.blogQueryRepository.findBlogById(blogId);
    if (foundBlog) {
      return foundBlog;
    }
    throw new NotFoundException({
      message: { error: 'couldn`t find' },
    });
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':blogId')
  @HttpCode(204)
  async deleteBlog(
    @Param('blogId', new ParseObjectIdPipe()) blogId: Types.ObjectId,
  ) {
    const result = await this.commandBus.execute(
      new DeleteBlogCommand(blogId.toString()),
    );
    if (result.data === null) return mappingErrorStatus(result);
    return true;
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createBlog(@Body() inputData: CreateBlogDto) {
    const createBlogInfo: ResultObject<string> = await this.commandBus.execute(
      new CreateBlogCommand(inputData),
    );
    if (createBlogInfo.data === null) return mappingErrorStatus(createBlogInfo);
    return await this.blogQueryRepository.findBlogById(createBlogInfo.data);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':blogId')
  @HttpCode(204)
  async updateBlog(
    @Param('blogId', new ParseObjectIdPipe()) blogId: Types.ObjectId,
    @Body() createBlogDto: CreateBlogDto,
  ) {
    const updateBlog: ResultObject<string> = await this.commandBus.execute(
      new UpdateBlogCommand(blogId.toString(), createBlogDto),
    );
    if (updateBlog.data === null) {
      mappingErrorStatus(updateBlog);
    }
    return true;
  }

  @Get(':blogId/posts')
  async getPostsFromBlogById(
    @QueryData() queryData: queryDataType,
    @Param('blogId', new ParseStringPipe()) blogId: string,
    @AccessTokenHeader() accessToken: string,
  ) {
    const currentAccessToken = accessToken ? accessToken : null;
    const userId = await this.commandBus.execute(
      new GetUserIdByAccessTokenCommand(currentAccessToken),
    );
    const foundPosts: PaginatorPostViewType | null =
      await this.postQueryRepository.getAllPostOfBlog(
        blogId,
        queryData,
        userId,
      );
    return foundPosts;
  }

  @UseGuards(BasicAuthGuard)
  @Post(':blogId/posts')
  @HttpCode(201)
  async createPostForBlogById(
    @QueryData() queryData: queryDataType,
    @Param('blogId', new ParseObjectIdPipe()) blogId: Types.ObjectId,
    @Body() createPostDto: CreatePostDto,
  ) {
    const newPost: ResultObject<string> = await this.commandBus.execute(
      new CreatePostForExistingBlogCommand(createPostDto, blogId.toString()),
    );
    if (newPost.data === null) {
      return mappingErrorStatus(newPost);
    }
    const gotNewPost: PostViewModel | null = newPost.data
      ? await this.postQueryRepository.findPostById(newPost.data)
      : null;
    return gotNewPost;
  }
}
