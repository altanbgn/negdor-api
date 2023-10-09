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
        email: "test-user@gmail.com",
        password: "test-password"
      })

    token = loginResult.body.data

    const createdOrg = await agent
      .post(`/${config.apiPrefix}/organization`)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)
      .send(testData.organizationCreate)

    orgId = createdOrg.body.data.id
  })

  this.afterAll(async function() {
    await prisma.organization.delete({ where: { id: orgId } })
  })

  it("Rating create (permission: CLIENT)", async function() {
    const result = await agent
      .post(path)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({
        organizationId: orgId,
        value: 5
      })

    ratingId = result.body.data.id

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    expect(result.statusCode).to.be.equal(201)
  })

  it("Rating list (organization id) (permission: CLIENT)", async function() {
    const result = await agent
      .get(`${path}/list?organizationId=${orgId}`)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    expect(result.statusCode).to.be.equal(200)
  })

  it("Rating findById (permission: CLIENT)", async function() {
    const result = await agent
      .get(path + `/${ratingId}`)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    expect(result.statusCode).to.be.equal(200)
  })

  it("Rating updateById (permission: CLIENT)", async function() {
    const result = await agent
      .put(path + `/${ratingId}`)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({ value: 4 })

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    expect(result.statusCode).to.be.equal(200)
  })

  it("Rating deleteById (permission: CLIENT)", async function() {
    const result = await agent
      .delete(path + `/${ratingId}`)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    expect(result.statusCode).to.be.equal(200)
  })
})
