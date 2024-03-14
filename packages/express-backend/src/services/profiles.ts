import { Profile } from "../../../ts-models/profile";
import ProfileModel from "../mongo/profile";

function index(): Promise<Profile[]> {
  return ProfileModel.find();
}

function get(userid: String): Promise<Profile> {
  return ProfileModel.find({ userid })
    .then((list) => list[0])
    .catch((err) => {
      throw `${userid} Not Found`;
    });
}

function getAll(): Promise<Profile[]> {
  return ProfileModel.find()
    .then((profiles) => profiles)
    .catch((err) => {
      throw "Error fetching profiles";
    });
}

function create(profile: Profile): Promise<Profile> {
  const p = new ProfileModel(profile);
  return p.save();
}

function update(userid: String, profile: Profile): Promise<Profile> {
  return new Promise((resolve, reject) => {
    ProfileModel.findOneAndUpdate({ userid }, profile, {
      new: true,
    }).then((profile) => {
      if (profile) resolve(profile);
      else reject("Failed to update profile");
    });
  });
}

export default { index, get, getAll, create, update };