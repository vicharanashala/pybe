const { z } = require('zod');

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const sessionSchema = z.object({
  scenarioId: z.string().min(1, 'scenarioId is required.'),
  reasoning: z.string().min(10, 'Reasoning must detail steps clearly.'),
  promptText: z.string().optional().default(''),
  reflection: z.string().optional().default(''),
  learnerName: z.string().optional().default('Guest learner'),
});

const scenarioSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  difficulty: z.string().min(1, 'Difficulty is required.'),
  concepts: z.array(z.string()).min(1, 'At least one concept is required.'),
  context: z.string().min(10, 'Context must be at least 10 characters.'),
  prompt: z.string().min(10, 'Prompt must be at least 10 characters.'),
  objectives: z.array(z.string()).min(1, 'At least one objective is required.'),
});

/**
 * Partial schema for PUT updates — all fields optional, but if present
 * they must still satisfy the same constraints. This prevents malformed
 * data (e.g. non-JSON-shaped concepts) from corrupting the database.
 */
const scenarioUpdateSchema = scenarioSchema.partial();

// ---------------------------------------------------------------------------
// Middleware factory
// ---------------------------------------------------------------------------

/**
 * Returns Express middleware that validates req.body against the given
 * Zod schema.  On success the parsed (and coerced / defaulted) data
 * replaces req.body.  On failure a 422 response is returned.
 *
 * @param {z.ZodSchema} schema
 */
function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      }));

      return res.status(422).json({
        success: false,
        error: 'Validation failed.',
        details: errors,
      });
    }

    // Replace body with parsed & coerced data
    req.body = result.data;
    return next();
  };
}

module.exports = { sessionSchema, scenarioSchema, scenarioUpdateSchema, validateBody };
