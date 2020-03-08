import * as Dto from ".";
import { BaseDto } from "../BaseDto";
import * as Entity from "../entities";

export class NotificationDto extends BaseDto<Entity.Notification> {
    recipient?: Dto.UserDto;
    dateCreated?: Date;
    read?: boolean;
    message?: string;
    linkedResourceUri?: string;

    constructor(obj: Entity.Notification, origin?: string) {
        super(obj, origin);
        this.recipient = new Dto.UserDto(obj.recipient);
        this.dateCreated = obj.dateCreated;
        this.read = obj.read;
        this.message = obj.message;
        this.linkedResourceUri = obj.linkedResourceUri;
    }
}
