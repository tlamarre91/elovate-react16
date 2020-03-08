import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { log } from "~server/log";
import { UserRepository } from "~shared/model/repositories";

export const JWT_EXP_TIME = 60 * 60 * 24;
// TODO: is HS512 the best choice? probably switch to public key
export const JWT_ALGO = "HS512";
export function generateUserJwt(uid: number, secret: string, refresh: boolean) {
    return jwt.sign({
        uid,
        refresh,
        loginTime: new Date()
    }, secret, {
        algorithm: JWT_ALGO,
        expiresIn: JWT_EXP_TIME
    });
}

export function init(userRepo: UserRepository) {
    return (req: Request, res: Response, next: NextFunction) => {
        const jwtCookie = req.signedCookies["elovateJwt"];
        if (jwtCookie) {
            jwt.verify(jwtCookie, req.app.get("secret"), { algorithms: [JWT_ALGO] },
                async (err: jwt.VerifyErrors, payload: { [key: string]: string }) => {
                    if (err) {
                        // NOTE: if we get attempts to forge JWTs, here's where we'll see them.
                        log.warn(`jwt.verify: ${err} (ip: ${req.ip})`);
                    } else {
                        try {
                            const user = await userRepo.findOne(parseInt(payload["uid"]));
                            if (user) {
                                const exp = parseInt(payload["exp"]);
                                const iat = parseInt(payload["iat"]);
                                // TODO: if i really need to i can code golf this down a bit
                                const expired = exp < (user.loginExp ?? 0);
                                const invalidated = Math.min(exp, iat) < (user.invalidateLoginsBefore ?? 0);
                                if (!(expired || invalidated)) {
                                    req.user = user;
                                    req.groupMemberships = user.groupMemberships;
                                    if (payload["refresh"]) {
                                        const newToken = generateUserJwt(user.id, req.app.get("secret"), true);
                                        res.cookie("elovate.jwt", newToken, { signed: true });
                                    }
                                } else {
                                    log.info(`saw expired JWT for user: ${user.username} (ip: ${req.ip})`);
                                }
                            }
                        } catch (err) {
                            log.warn(`sessionManager: ${err}`);
                        }
                    }
                    next();
                });
        } else {
            log.info("request passed with no JWT");
            next();
        }
    };
}
