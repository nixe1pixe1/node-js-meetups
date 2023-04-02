const { MeetupDto, MeetupUpdateDto } = require("./meetup.dto");
const { MeetupService } = require("./meetup.service");
const { handleError } = require("./utils");

class MeetupController {
  static async getAllMeetups(req, res) {
    try {
      const meetups = await MeetupService.getAllMeetups();
      res.send(meetups);
    } catch (err) {
      handleError(res, err);
    }
  }

  static async getMeetupById(req, res) {
    try {
      const { id } = req.params;
      const meetup = await MeetupService.getMeetupById(id);
      if (meetup) return res.send(meetup);
      res.status(404).send(`Meetup with id ${id} not found`);
    } catch (err) {
      handleError(res, err);
    }
  }

  static async createMeetup(req, res) {
    const { name, description, tags, time, location } = req.body;
    const meetupDto = new MeetupDto(name, description, tags, time, location);
    try {
      const meetup = await MeetupService.createMeetup(meetupDto);
      res.send(meetup);
    } catch (err) {
      handleError(res, err);
    }
  }

  static async updateMeetupById(req, res) {
    const { name, description, tags, time, location } = req.body;
    const { id } = req.params;
    const meetupUpdateDto = new MeetupUpdateDto(
      name,
      description,
      tags,
      time,
      location
    );
    try {
      const meetup = await MeetupService.updateMeetupById(id, meetupUpdateDto);
      if (meetup) return res.send(meetup);
      res.status(404).send(`Meetup with id ${id} not found`);
    } catch (err) {
      handleError(res, err);
    }
  }

  static async deleteMeetupById(req, res) {
    try {
      const { id } = req.params;
      const meetup = await MeetupService.deleteMeetupById(id);
      if (meetup) return res.send(meetup);
      res.status(404).send(`Meetup with id ${id} not found`);
    } catch (err) {
      handleError(res, err);
    }
  }
}

module.exports = { MeetupController };
