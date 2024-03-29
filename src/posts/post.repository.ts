import { Injectable } from '@nestjs/common';
import { CreatePostDto, PostDBModel } from './post.types';
import { LikeStatusOption } from '../comments/comments.types';
import {
  LikeStatus,
  LikeStatusDBType,
  LikeStatusDocument,
} from '../likeStatus/likeStatus.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './post.schema';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post.name) public postModel: Model<PostDocument>,
    @InjectModel(LikeStatus.name)
    public likeStatusModel: Model<LikeStatusDocument>,
  ) {}

  async deletePost(id: string): Promise<boolean> {
    const result = await this.postModel.deleteOne({
      _id: new Types.ObjectId(id),
    });
    return result.deletedCount === 1;
  }

  async createPost(newPost: PostDBModel): Promise<string> {
    const result = await this.postModel.create(newPost);
    return result._id.toString();
    // if (result) {
    //   return {
    //     data: result._id.toString(),
    //     resultCode: ResultCode.NoContent,
    //     message: 'create a new post',
    //   };
    // }
    // return {
    //   data: null,
    //   resultCode: ResultCode.BadRequest,
    //   message: 'couldn`t create a new post',
    // };
    // return {
    //     id: result.insertedId.toString(),
    //     title: newPost.title,
    //     shortDescription: newPost.shortDescription,
    //     content: newPost.content,
    //     blogId: newPost.blogId,
    //     blogName: newPost.blogName,
    //     createdAt: newPost.createdAt.toISOString()
    // };
  }

  async getPostById(postId: string): Promise<PostDBModel | null> {
    const foundPost = await this.postModel.findById(postId);
    if (foundPost) {
      return foundPost;
    }
    return null;
  }

  async updatePost(
    id: string,
    updatedPostData: CreatePostDto,
  ): Promise<boolean> {
    const result = await this.postModel.updateOne(
      { _id: new Types.ObjectId(id) },
      {
        $set: {
          title: updatedPostData.title,
          shortDescription: updatedPostData.shortDescription,
          content: updatedPostData.content,
        },
      },
    );
    return result.matchedCount === 1;
  }

  async createLikeStatusForPost(
    entityId: Types.ObjectId,
    userId: Types.ObjectId,
    userLogin: string,
    likeStatus: LikeStatusOption,
  ) {
    const newLikeStatus: LikeStatusDBType = {
      entityId: entityId.toString(),
      userId: userId.toString(),
      userLogin,
      likeStatus,
      createdAt: new Date(),
    };
    await this.likeStatusModel.create(newLikeStatus);
    return true;
  }

  async updatePostLikeStatus(
    entityId: Types.ObjectId,
    userId: Types.ObjectId,
    likeStatus: LikeStatusOption,
  ) {
    // const newLikeStatus: LikeStatusDBType = {
    //     entityId: entityId.toString(),
    //     userId: userId.toString(),
    //     userLogin,
    //     likeStatus,
    //     createdAt: new Date()
    // }
    await this.likeStatusModel.findOneAndUpdate(
      { entityId, userId },
      {
        $set: {
          likeStatus: likeStatus,
        },
      },
    );
    return true;
  }
}
