import supertest from "supertest"
import { expect, assert } from "chai"

// Local
import app from "@/app"
import config from "@/utils/config"
import prisma from "@/prisma"

const agent = supertest.agent(app)
const path = `/${config.apiPrefix}/user`

describe("Module: User", function() {
  let token = ""

  this.beforeAll(async function() {
    const result = await agent
      .post(`/${config.apiPrefix}/auth/login`)
      .set("Content-Type", "application/json")
      .send({
        email: "test-admin@gmail.com",
        password: "test-password"
      })

    token = result.body.data
  })

  it("User list", async function() {
    const result = await agent
      .get(path + "/list")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)

    const data = result.body.data

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    assert.isArray(data.list)
    assert.isNumber(data.page)
    assert.isNumber(data.perPage)
    assert.isNumber(data.total)
    expect(result.statusCode).to.be.equal(200)
  })
})
