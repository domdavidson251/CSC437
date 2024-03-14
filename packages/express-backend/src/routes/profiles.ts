import express, { Request, Response } from "express";
import { Profile } from "../../../ts-models/src/profile";
import profiles from "../services/profiles";

const router = express.Router();

router.post("/", (req: Request, res: Response) => {
  const newProfile = req.body;

  profiles
    .create(newProfile)
    .then((profile: Profile) => res.status(201).send(profile))
    .catch((err) => res.status(500).send(err));
});

router.get("/", (req: Request, res: Response) => {
  profiles
    .getAll()
    .then((allProfiles: Profile[]) => {
      if (allProfiles.length === 0) {
        res.status(404).send("No profiles found");
      } else {
        res.json(allProfiles);
      }
    })
})

router.get("/:userid", (req: Request, res: Response) => {
  const { userid } = req.params;

  profiles
    .get(userid)
    .then((profile: Profile | undefined) => {
      if (!profile) throw "Not found";
      else res.json(profile);
    })
    .catch((err) => res.status(404).end());
});

router.put("/:userid", (req: Request, res: Response) => {
  const { userid } = req.params;
  const newProfile = req.body;

  profiles
    .update(userid, newProfile)
    .then((profile: Profile) => res.json(profile))
    .catch((err) => res.status(404).end());
});

export default router;