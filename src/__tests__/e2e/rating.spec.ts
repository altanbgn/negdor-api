import supertest from "supertest"
import { expect, assert } from "chai"

// Local
import app from "@/app"
import config from "@/utils/config"
import prisma from "@/prisma"
import testData from "@/__tests__/test-data.json"

const agent = supertest.agent(app)
const path = `/${config.apiPrefix}/rating`

describe("Module: Rating", async function() {
  let token = ""
  let orgId = ""
  let ratingId = ""

  this.beforeAll(async function() {
    await prisma.rating.deleteMany({})

    const loginResult = await agent
      .post(`/${config.apiPrefix}/auth/login`)
      .set("Content-Type", "application/json")
      .send({
        email: "test@gmail.com",
        password: "test-password"
      })

    console.log(loginResult.body)

    token = loginResult.body.data

    const createdOrg = await agent
      .post(`/${config.apiPrefix}/organization`)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)
      .send(testData.organizationCreate)

    console.log(createdOrg.body)

    orgId = createdOrg.body.data.id
  })

  this.afterAll(async function() {
    await prisma.rating.deleteMany({
      where: { id: ratingId }
    })

    await prisma.organization.deleteMany({
      where: { id: orgId }
    })
  })

  it("Create rating (user: USER)", async function() {
    const result = await agent
      .post(`${path}`)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({
        organization: orgId,
        value: 5
      })

    ratingId = result.body.data.id

    assert.isObject(result)
    assert.isObject(result.body)
    expect(result.statusCode).to.be.equal(201)
  })
})
