import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResultCode, ResultObject } from '../../../helpers/heplersType';
import { Helpers } from '../../../helpers/helpers';
import { PostRepository } from '../../post.repository';
import { CreatePostDto } from '../../post.types';
import { PostQueryRepository } from '../../postQuery.repository';

export class UpdatePostCommand {
  constructor(
    public postId: string,
    public updatedPostData: CreatePostDto,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePost implements ICommandHandler<UpdatePostCommand> {
  constructor(
    public postRepository: PostRepository,
    public postQueryRepository: PostQueryRepository,
    public helpers: Helpers,
  ) {}

  async execute(command: UpdatePostCommand): Promise<ResultObject<string>> {
    await this.helpers.validateOrRejectModel(
      command.updatedPostData,
      CreatePostDto,
    );

    const isExistPost = await this.postQueryRepository.findPostById(
      command.postId.toString(),
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