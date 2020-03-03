import express from "express";
import jwt from "jsonwebtoken";

import * as Util from "~server/util";
import { log } from "~server/log";
import { UserRepository } from "~shared/model/repositories";

export function sessionManager(userRepo: UserRepository) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const jwtCookie = req.signedCookies["elovateJwt"];
        if (jwtCookie) {
            jwt.verify(jwtCookie, req.app.get("secret"),
                async (err: jwt.VerifyErrors, payload: { [key: string]: string }) => {
                    if (err) {
                        log.warn(`jwt.verify: ${err}`);
                    } else {
                        try {
                            const user = await userRepo.findOne(parseInt(payload["uid"]));
                            if (user) {
                                const exp = parseInt(payload["exp"])
                                const expired = exp < (user.loginExp ?? 0);
                                const invalidated = exp < (user.invalidateLoginsBefore ?? 0);
                                if (!(expired || invalidated)) {
                                    req.user = user;
                                    const newToken = Util.generateUserJwt(user.id, req.app.get("secret"));
                                    res.cookie("elovate.jwt", newToken, { signed: true });
                                } else {
                                    log.info(`saw expired JWT for user: ${user.username}`);
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
