import * as Dto from ".";
import { BaseDto } from "../BaseDto";
import * as Entity from "../entities";

export class NotificationDto extends BaseDto<Entity.Notification> {
    recipient?: Dto.UserDto;
    dateCreated?: Date;
    read?: boolean;
    message?: string;
    linkedResourceUri?: string;

    constructor(base: Entity.Notification, origin?: string) {
        super(base, origin);
        this.recipient = new Dto.UserDto(base.recipient);
        this.dateCreated = base.dateCreated;
        this.read = base.read;
        this.message = base.message;
        this.linkedResourceUri = base.linkedResourceUri;
    }
}
