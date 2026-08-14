import { LessonErrorCodes } from './errorCodes';
import { LessonErrorMessages } from './errorMessages';

/**
 * Creates a standard Error for a known lesson error code.
 *
 * This is the one function every file inside `client/src/lessons/`
 * should call to construct an error, instead of writing a bare
 * `new Error('some message')` inline. Centralizing construction here
 * means every lesson error carries the same shape — a code, optional
 * context, and a message assembled from the shared catalogue — no
 * matter which file raised it.
 *
 * Purpose:
 *   Build a fully-described Error object for a given lesson error code.
 *
 * Inputs:
 * @param {string} code - One of the values exported from
 *   `LessonErrorCodes` (see `./errorCodes.js`). Passing a code that
 *   isn't in the catalogue is not itself an error — the resulting
 *   Error will just carry a generic description — since this function
 *   never throws on its own (see "Possible errors" below).
 * @param {Object} [context={}] - Extra detail about the specific
 *   failure, e.g. `{ section: 'discovery', promptId: 'function-input' }`.
 *   Attached to the returned error as `error.context` so a developer
 *   reading a stack trace (or a future automated check) can see
 *   exactly what failed without re-parsing the message string.
 *
 * Outputs:
 * @returns {Error} A standard JavaScript Error, with two extra
 *   properties set: `error.code` (the code passed in) and
 *   `error.context` (the context object passed in, or `{}`).
 *
 * Possible errors:
 *   This function does not throw. It only constructs and returns an
 *   Error object — the caller decides whether to `throw` it. If `code`
 *   is not present in `LessonErrorMessages`, the returned error simply
 *   uses a generic fallback description rather than failing.
 *
 * Side effects:
 *   None. Every call constructs a new, independent Error object; no
 *   shared state is read or written.
 */
export function createLessonError(code, context = {}) {
  const info = LessonErrorMessages[code];
  const description = info ? info.description : 'Unrecognized lesson error code.';
  const error = new Error(`[${code}] ${description}`);
  error.code = code;
  error.context = context;
  return error;
}

// LessonErrorCodes is re-exported so callers throughout `lessons/` can
// reference a code without importing `errorCodes.js` directly.
//
// LessonErrorMessages is also re-exported, even though nothing outside
// this `errors/` folder currently imports it (createLessonError already
// reads it internally to build each error's message) — it's kept public
// for a plausible future consumer, such as a developer-facing error
// overlay or diagnostic log that wants to show a code's full
// description/cause/recovery text, not just the short message
// createLessonError already embeds. Remove this re-export if no such
// consumer has appeared by the time a second lesson is added.
export { LessonErrorCodes, LessonErrorMessages };
