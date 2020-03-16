import * as Dto from ".";
import { BaseDto } from "../BaseDto";
import { Notification } from "../entities/Notification";

export class NotificationDto extends BaseDto<Notification> {
    recipient?: Dto.UserDto;
    dateCreated?: Date;
    read?: boolean;
    message?: string;
    linkedResourceUri?: string;

    constructor(obj: Notification, origin?: string) {
        super(obj, origin);
        this.recipient = new Dto.UserDto(obj.recipient);
        this.dateCreated = obj.dateCreated;
        this.read = obj.read;
        this.message = obj.message;
        this.linkedResourceUri = obj.linkedResourceUri;
    }
}
