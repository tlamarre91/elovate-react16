import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import * as Api from '~shared/api';
import { log } from '~shared/log';
import { UserRepository } from '~server/model/repositories';

export const JWT_COOKIE_NAME = 'elovateJwt';
export const JWT_EXP_TIME = 60 * 60 * 24;
// TODO: is HS512 the best choice? probably switch to public key
export const JWT_ALGO = 'HS512';

// TODO CRITICAL: include origin IP address in cookie. validate IFF request IP matches. (https://trello.com/c/m64J3DJe)
export function generateUserJwt(uid: number, secret: string, refresh: boolean) {
    return jwt.sign(
        {
            uid,
            refresh,
            loginTime: new Date(),
        },
        secret,
        {
            algorithm: JWT_ALGO,
            expiresIn: JWT_EXP_TIME,
        },
    );
}

export function init(userRepo: UserRepository) {
    return (req: Request, res: Response, next: NextFunction) => {
        const jwtCookie = req.signedCookies[JWT_COOKIE_NAME];
        if (jwtCookie) {
            jwt.verify(
                jwtCookie,
                req.app.get('secret'),
                { algorithms: [JWT_ALGO] },
                async (
                    err: jwt.VerifyErrors,
                    payload: { [key: string]: string },
                ) => {
                    if (err) {
                        // NOTE: if we get attempts to forge JWTs, here's where we'll see them.
                        // TODO: track bad login attempts (https://trello.com/c/glamcZmT)
                        log.info(`jwt.verify: ${err} (ip: ${req.ip})`);
                        return next();
                    }

                    try {
                        const user = await userRepo.findOne(
                            parseInt(payload.uid),
                        );
                        if (!user) {
                            return next();
                        }

                        const iat = parseInt(payload.iat);
                        const invalidated = iat <= (user.invalidateLoginsBefore ?? 0);
                        if (invalidated) {
                            log.info(
                                `saw expired JWT for user: ${user.username} (ip: ${req.ip})`,
                            );
                            return next();
                        }

                        req.user = user;
                        req.groupMemberships = user.groupMemberships;
                        if (payload.refresh) {
                            const newToken = generateUserJwt(
                                user.id,
                                req.app.get('secret'),
                                true,
                            );
                            res.cookie(JWT_COOKIE_NAME, newToken, {
                                signed: true,
                            });
                        }
                    } catch (err) {
                        log.error(`authorization: ${err}`);
                    }

                    next();
                },
            );
        } else {
            next();
        }
    };
}

export function requireAuthorization(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    if (!req.user) {
        res.status(403);
        return res.json(new Api.Response(false, 'not logged in'));
    }

    next();
}
