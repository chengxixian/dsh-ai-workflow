/**
 * AI workflow canvas — Host half.
 *
 * The browser half only draws the graph; every side effect (calling a model,
 * running an agent turn, invoking a tool, submitting a ComfyUI prompt, posting
 * the reply back to the chat) happens here, behind the Host's JSON routes.
 *
 * Storage is per conversation: `<workspace>/dsh-workflows/<session>/main.json`,
 * so a workflow belongs to the chat it was drawn in.
 */
import { registerWorkflowRoutes } from './workflow.js'

/** Plugin identifier; it is also the bundle entry id in `cordis.patch.yml`. */
export const name = 'dsh-ai-workflow'

/**
 * Services this plugin needs before it can register its routes.
 * `connection` provides the authenticated fetch registry the routes hang off.
 */
export const inject = ['connection']

/**
 * Register the `/api/ai-workflow` routes.
 * @param {object} ctx - plugin context.
 * @returns {void}
 */
export function apply(ctx) {
  registerWorkflowRoutes(ctx)
}