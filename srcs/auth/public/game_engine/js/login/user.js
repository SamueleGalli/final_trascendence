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

export let profiles = [];

export class profile {
    constructor(email, display_name, realname, bio, image, type)
    {
        this.email = email;
        this.display_name = display_name;
        this.realname = realname
        this.bio = bio;
        this.image = image;
        this.type = type;
        this.num_friends = 0;
    }
}

export let friend_list = [];

export class Friend {
    constructor(name, status)
    {
        this.name = name;
        this.status = status;
    }
}
export function getProfileByField(field, value) {
    return profiles.find(profile => profile[field] === value);
}

export function setAuthenticated() {
    fetch('/set_authenticated', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ access_granted: true })
    });
}