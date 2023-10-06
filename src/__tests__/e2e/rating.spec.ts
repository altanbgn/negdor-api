import supertest from "supertest"
import { expect, assert } from "chai"

// Local
import app from "@/app"
import config from "@/utils/config"
import prisma from "@/prisma"

const agent = supertest.agent(app)
const path = `/${config.apiPrefix}/rating`

describe("Module: Rating", async function () {
  let token = ""

  const orgResponse = await agent.get(`/${config.apiPrefix}/organization/list`)
  const organization = orgResponse.body.data[0]

  this.beforeAll(async function () {
    await prisma.rating.deleteMany({})

    const result = await agent
      .post(`/${config.apiPrefix}/auth/login`)
      .set("Content-Type", "application/json")
      .send({
        email: "test@gmail.com",
        password: "test-password"
      })

    token = result.body.data
  })

  it("Create rating (user: USER)", async function () {
    const result = await agent
      .post(`${path}`)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({
        organization: organization._id,
        value: 5
      })

    assert.isObject(result)
    assert.isObject(result.body)
    expect(result.statusCode).to.be.equal(201)
  })
})
