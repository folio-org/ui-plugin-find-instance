/**
 * Parses http error to json.
 *
 * @param httpError object
 * @returns object
 */
export const parseHttpError = async httpError => {
  const contentType = httpError?.headers?.get('content-type');
  let jsonError = {};

  try {
    if (contentType === 'text/plain') {
      jsonError.message = await httpError.text();
    } else {
      jsonError = await httpError.json();
    }

    return jsonError;
  } catch (err) {
    return httpError;
  }
};
