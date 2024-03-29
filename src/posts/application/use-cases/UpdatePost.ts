import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResultCode, ResultObject } from '../../../helpers/heplersType';
import { Helpers } from '../../../helpers/helpers';
import { CreatePostWithBlogIdDto } from '../../post.types';
import { PostRepositorySql } from '../../post.repository.sql';
import { PostQueryRepositorySql } from '../../postQuery.repository.sql';

export class UpdatePostCommand {
  constructor(
    public postId: string,
    public updatedPostData: CreatePostWithBlogIdDto,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePost implements ICommandHandler<UpdatePostCommand> {
  constructor(
    public postRepository: PostRepositorySql,
    public postQueryRepository: PostQueryRepositorySql,
    public helpers: Helpers,
  ) {}

  async execute(command: UpdatePostCommand): Promise<ResultObject<string>> {
    // await this.helpers.validateOrRejectModel(
    //   command.updatedPostData,
    //   CreatePostWithBlogIdDto,
    // );

    const isExistPost = await this.postQueryRepository.findPostById(
      command.postId,
    );
    if (!isExistPost) {
      return {
        data: null,
        resultCode: ResultCode.NotFound,
        message: 'couldn`t find blog',
      };
    }
    const updatedPost = await this.postRepository.updatePost(
      command.postId,
      command.updatedPostData,
    );
    if (!updatedPost) {
      return {
        data: null,
        resultCode: ResultCode.BadRequest,
        message: 'couldn`t update blog',
      };
    }
    return {
      data: 'ok',
      resultCode: ResultCode.NoContent,
    };
  }
}
