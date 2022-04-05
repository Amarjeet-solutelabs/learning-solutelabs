import { from, Observable } from 'rxjs';
import { FeedPost } from './../models/post.interface';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { FeedPostEntity } from '../models/post.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FeedService {
    constructor(
        @InjectRepository(FeedPostEntity)
        private readonly feedPostRepo:Repository<FeedPostEntity>
    ) {}

    createPost(feedPost:FeedPost): Observable<FeedPost> {
        return from(this.feedPostRepo.save(feedPost))
    }
}
