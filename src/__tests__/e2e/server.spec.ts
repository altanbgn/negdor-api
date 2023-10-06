import request from "supertest"
import app from "@/app"
import config from "@/utils/config"

const agent = request.agent(app)

describe("Module: Server", () => {
  it(`Health`, (done) => {
    agent.get(`/${config.apiPrefix}/health`).expect(200, "OK!", done)
  })
})
