const express = require("express");
const { MeetupController } = require("./meetup.controller");

const app = express();
app.use(express.json());

app.get("/meetups", MeetupController.getAllMeetups);

app.get("/meetups/:id", MeetupController.getMeetupById);

app.post("/meetups", MeetupController.createMeetup);

app.put("/meetups/:id", MeetupController.updateMeetupById);

app.delete("/meetups/:id", MeetupController.deleteMeetupById);

app.listen(3000, () => console.log("Server is listening to port 3000"));
