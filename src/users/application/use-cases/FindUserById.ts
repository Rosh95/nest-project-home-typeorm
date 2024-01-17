import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../user.repository';
import { Helpers } from '../../../helpers/helpers';
import { NewUsersDBType } from '../../user.types';

export class FindUserByIdCommand {
  constructor(public userId: string) {}
}

@CommandHandler(FindUserByIdCommand)
export class FindUserById implements ICommandHandler<FindUserByIdCommand> {
  constructor(
    public userRepository: UserRepository,
    public helpers: Helpers,
  ) {}

  async execute(command: FindUserByIdCommand): Promise<NewUsersDBType | null> {
    return await this.userRepository.findUserById(command.userId);
  }
}