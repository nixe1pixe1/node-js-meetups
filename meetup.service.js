const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "meetups",
  password: "root",
  port: 5432,
});

class MeetupService {
  static async getAllMeetups() {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM meetups");
    const meetups = result.rows;
    client.release();
    return meetups;
  }

  static async getMeetupById(id) {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM meetups WHERE id=$1", [
      id,
    ]);
    const meetup = result.rows[0];
    client.release();
    return meetup;
  }

  static async createMeetup(meetupDto) {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO meetups (name, description, tags, time, location) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        meetupDto.name,
        meetupDto.description,
        meetupDto.tags,
        meetupDto.time,
        meetupDto.location,
      ]
    );
    const meetup = result.rows[0];
    client.release();
    return meetup;
  }

  static async updateMeetupById(id, meetupUpdateDto) {
    const client = await pool.connect();
    const result = await client.query(
      "UPDATE meetups SET name=$1, description=$2, tags=$3, time=$4, location=$5 WHERE id=$6 RETURNING *",
      [
        meetupUpdateDto.name,
        meetupUpdateDto.description,
        meetupUpdateDto.tags,
        meetupUpdateDto.time,
        meetupUpdateDto.location,
        id,
      ]
    );
    const meetup = result.rows[0];
    client.release();
    return meetup;
  }

  static async deleteMeetupById(id) {
    const client = await pool.connect();
    const result = await client.query(
      "DELETE FROM meetups WHERE id=$1 RETURNING *",
      [id]
    );
    const meetup = result.rows[0];
    client.release();
    return meetup;
  }
}

module.exports = { MeetupService };
