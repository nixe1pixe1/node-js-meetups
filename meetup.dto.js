class MeetupDto {
  constructor(name, description, tags, time, location) {
    this.name = name;
    this.description = description;
    this.tags = tags;
    this.time = time;
    this.location = location;
  }
}

class MeetupUpdateDto {
  constructor(name, description, tags, time, location) {
    this.name = name;
    this.description = description;
    this.tags = tags;
    this.time = time;
    this.location = location;
  }
}

module.exports = { MeetupDto, MeetupUpdateDto };
