import { parseHttpError } from './utils';

describe('utils', () => {
  describe('parseHttpError', () => {
    it('should return correct object when content type is plain text', async () => {
      const httpError = {
        headers: { get: () => 'text/plain' },
        text: async () => 'error message',
      };
      const jsonError = await parseHttpError(httpError);

      expect(jsonError).toEqual({ message: 'error message' });
    });

    it('should return correct object when content type is other than plain text', async () => {
      const httpError = {
        headers: { get: () => 'application/json' },
        json: async () => ({ errors: [{ message: 'error message' }] }),
      };
      const jsonError = await parseHttpError(httpError);

      expect(jsonError).toEqual({ errors: [{ message: 'error message' }] });
    });

    it('if an error occurred during parsing the error then return the http error', async () => {
      const httpError = {
        headers: { get: () => 'application/json' },
        json: () => throw new Error('Thrown from json()'),
      };
      const jsonError = await parseHttpError(httpError);

      expect(jsonError).toEqual(httpError);
    });
  });
});
