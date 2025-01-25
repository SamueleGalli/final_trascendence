export class Logged {
    constructor(image, name, login_name, email, bio) {
        this.image = image;
        this.name = name;
        this.login_name = login_name;
        this.email = email;
        this.bio = bio;
    }
}

export class Guest {
    constructor(image, name, email, id, bio) {
        this.image = image;
        this.name = name;
        this.email = email;
        this.id = id;
        this.bio = bio;
    }
}

export const profiles = [];

export class profile {
    constructor(email, dispaly_name, bio, avatar)
    {
        this.email = email;
        this.dispaly_name = dispaly_name;
        this.bio = bio;
        this.avatar = avatar;
    }
}

export function getProfileByField(field, value) {
    return profiles.find(profile => profile[field] === value);
}