
export const setResponse = (object, response) => {
  response.status(200);
  response.json(object);
}

export const setError = (error, response) => {
  if (error.name === "ValidationError") {
    let errors = {};

    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });

    response.status(400).json(errors);
  }

  response.status(error.status || 500);

  response.json({
    "error": error.body || {
      "code": "internalServerError",
      "message": "Error occured while processing request"
    }
  });
}

