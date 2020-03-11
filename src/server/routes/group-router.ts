import { Router, Request, Response, NextFunction } from "express";
import * as Orm from "typeorm";

import * as Api from "~shared/api";
import { log } from "~server/log";
import * as Entity from "~shared/model/entities";
import * as Dto from "~shared/model/data-transfer-objects";
import * as Repository from "~shared/model/repositories";

const FREE_USER_MAX_GROUPS = 5; // TODO: load from config
enum Template {
    GroupProfile = "group-profile",
    GroupDashboard = "group-dashboard",
    GroupSettings = "group-settings",
    GroupForumHome = "group-forum-home",
}

const router = Router();

async function groupQueryMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const query = req.params["query"];
        const group = await Orm.getCustomRepository(Repository.GroupRepository)
            .findOneFromQuery(query);

        if (! group) {
            res.status(404);
            return res.render("error", { error: `group not found: ${query}` });
        }

        if (group.publicVisible) {
            req.resource = group;
            return next();
        }

        const membership: Entity.GroupUser = req.user.groupMemberships
            .filter((gu: Entity.GroupUser) => gu.group.id === group.id)?.[0];

        if (! membership) {
            // TODO: don't expose private group to unauthorized user at all
            res.status(403);
            return res.render("error", { error: `user ${req.user} not authorized to view group ${group.id}` })
        } else {
            req.resource = group;
            return next();
        }
    } catch (err) {
        log.warn(`groupQueryMiddleware: ${err}`);
        next();
    }
}

router.get("/new", async (req, res) => {
    const count = await Orm.getCustomRepository(Repository.GroupRepository).countGroupsWithOwner(req.user);
    log.info(`groups/new: user owns ${count} groups`);
    if (count >= FREE_USER_MAX_GROUPS) {
        res.status(403);
        res.render("error", { error: `user ${req.user} can't create any more new groups` });
    } else {
        res.render("new-group");
    }
});

// NOTE: i could just do the traditional /groups/profile?id=******** thing...
router.get("/:query", groupQueryMiddleware, async (req, res) => {
    try {
        res.render(Template.GroupProfile, { user: req.user, group: req.resource });
    } catch (error) {
        log.warn(`groups/:query router: ${error}`);
        res.render("error", { error });
    }
});

router.get("/:query/dashboard", async (req, res) => {
    try {
        const group = req.resource as Entity.Group;
        res.render(Template.GroupDashboard, { user: req.user, group });
    } catch (error) {
        log.warn(`groups/:query/dashboard router: ${error}`);
        res.status(500);
        res.render("error", { error });
    }
});

router.get("/:query/settings", async (req, res) => {
    try {
        const group = req.resource as Entity.Group;
        res.render(Template.GroupSettings, { user: req.user, group });
    } catch (error) {
        log.warn(`groups/:query/settings router: ${error}`);
        res.status(500);
        res.render("error", { error });
    }
});

router.get("/:query/forum", async (req, res) => {
    res.status(501);
    res.render("error", { error: "not yot implemented" });
});

export default router;
