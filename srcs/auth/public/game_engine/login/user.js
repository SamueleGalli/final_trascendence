export class Logged {
    constructor(image, name, login_name, email) {
        this.image = image;
        this.name = name;
        this.login_name = login_name;
        this.email = email;
    }
}

export class Guest {
    constructor(image, name, email, id) {
        this.image = image;
        this.name = name;
        this.email = email;
        this.id = id;
    }
}