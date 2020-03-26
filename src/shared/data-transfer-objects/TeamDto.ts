import * as Dto from '.';
import { BaseDto } from './BaseDto';
import {
    Team,
} from '~server/model/entities';

export class TeamDto extends BaseDto<Team> {
    constructor(obj: Team, origin?: string) {
        super(obj, origin);
    }
}
