const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "meetups",
  password: "root",
  port: 5432,
});

class MeetupService {
  static async getAllMeetups(params) {
    const client = await pool.connect();

    const queryParams = [];
    let query = "SELECT * FROM meetups";
    let subquery = "";

    const result = {};

    if (params) {
      const { search, filter, sort, page, limit } = params;

      let searchquery = "";

      if (search) {
        queryParams.push(`%${search}%`);
        searchquery +=
          ` WHERE name ILIKE $${queryParams.length} ` +
          `OR description ILIKE $${queryParams.length}`;
      }

      if (filter) {
        queryParams.push(`%${filter}%`);
        searchquery += ` AND tags ILIKE $${queryParams.length}`;
      }

      if (sort) {
        const [sortColumn, sortOrder] = sort.split(":");
        if (
          ["id", "name", "description", "tags", "location", "time"].includes(
            sortColumn.toLowerCase()
          ) &&
          ["desc", "asc"].includes(sortOrder.toLowerCase())
        )
          subquery += searchquery + ` ORDER BY ${sortColumn} ${sortOrder.toUpperCase()}`;
      }

      if (page) {
        const countResult = await pool.query(
          `SELECT COUNT(*) FROM meetups ${searchquery}`,
          queryParams
        );
        const totalCount = countResult.rows[0].count;
        const totalPages = Math.ceil(totalCount / (limit ? limit : 10));
        const currentPage = parseInt(page);
        const offset = (page - 1) * (limit ? limit : 10);

        result.prevPage = currentPage > 1 ? currentPage - 1 : null;
        result.nextPage = currentPage < totalPages ? currentPage + 1 : null;
        result.currentPage = currentPage;
        result.totalCount = totalCount;
        result.totalPages = totalPages;

        queryParams.push(limit ? limit : 10, offset);
        subquery += ` LIMIT $${queryParams.length - 1} OFFSET $${
          queryParams.length
        }`;
      }
    }

    query += subquery;

    const queryResult = await client.query(query, queryParams);
    const meetups = queryResult.rows;
    client.release();

    const { totalCount, totalPages, currentPage, prevPage, nextPage } = result;

    return { meetups, totalCount, totalPages, currentPage, prevPage, nextPage };
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
    const { name, description, tags, time, location } = meetupDto;
    const result = await client.query(
      "INSERT INTO meetups (name, description, tags, time, location) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, description, tags, time, location]
    );
    const meetup = result.rows[0];
    client.release();
    return meetup;
  }

  static async updateMeetupById(id, meetupUpdateDto) {
    const client = await pool.connect();
    const { name, description, tags, time, location } = meetupUpdateDto;
    const result = await client.query(
      "UPDATE meetups SET name=$1, description=$2, tags=$3, time=$4, location=$5 WHERE id=$6 RETURNING *",
      [name, description, tags, time, location, id]
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
