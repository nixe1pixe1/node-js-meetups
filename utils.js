const handleError = (res, err) => {
  console.error(`\nError: ${err.message}\n`);
  res.status(500).send("Error retrieving data from database");
};

module.exports = { handleError };
