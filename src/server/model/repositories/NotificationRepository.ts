import * as Orm from 'typeorm';

import { BaseRepository } from './BaseRepository';
import { Notification } from '~server/model/entities';
import * as Dto from '~shared/data-transfer-objects';

@Orm.EntityRepository(Notification)
export class NotificationRepository extends BaseRepository<Notification> {
    createFromDto(dto: Dto.NotificationDto): Promise<Notification> {
        throw new Error('Method not implemented.');
    }
}
