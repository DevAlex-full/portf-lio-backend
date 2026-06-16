import fp from 'fastify-plugin'
import type { FastifyPluginCallback, FastifyRequest, FastifyReply } from 'fastify'

const authPlugin: FastifyPluginCallback = (fastify, _opts, done) => {
  fastify.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
      try {
        await request.jwtVerify()
      } catch (err) {
        reply.send(err)
      }
    }
  )
  done()
}

export default fp(authPlugin, { name: 'authenticate' })
