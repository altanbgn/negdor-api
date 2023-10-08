import supertest from "supertest"
import { expect, assert } from "chai"

// Local
import app from "@/app"
import config from "@/utils/config"
import testData from "@/__tests__/test-data.json"

const agent = supertest.agent(app)
const path = `/${config.apiPrefix}/organization`

describe("Module: Organization", function() {
  let token = ""
  let organizationId = ""

  this.beforeAll(async function() {
    const result = await agent
      .post(`/${config.apiPrefix}/auth/login`)
      .set("Content-Type", "application/json")
      .send({
        email: "test-user@gmail.com",
        password: "test-password"
      })

    token = result.body.data
  })

  it("Organization create (user: USER)", async function() {
    const result = await agent
      .post(path)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(testData.organizationCreate)

    organizationId = result.body.data.id

    assert.isObject(result)
    assert.isObject(result.body)
    expect(result.statusCode).to.be.equal(201)
  })

  it("Organization find one", async function() {
    const result = await agent
      .get(path + `/${organizationId}`)
      .set("Content-Type", "application/json")

    assert.isObject(result)
    assert.isObject(result.body)
    expect(result.statusCode).to.be.equal(200)
  })

  it("Organization list", async function() {
    const result = await agent
      .get(path + "/list")
      .set("Content-Type", "application/json")

    const data = result.body.data

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isArray(data.list)
    assert.isNumber(data.page)
    assert.isNumber(data.perPage)
    assert.isNumber(data.total)
    expect(result.statusCode).to.be.equal(200)
  })

  it("Organization update (user: USER)", async function() {
    const result = await agent
      .put(path + `/${organizationId}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(testData.organizationUpdate)

    assert.isObject(result)
    assert.isObject(result.body)
    expect(result.statusCode).to.be.equal(200)
  })

  it("Organization delete (user: USER)", async function() {
    const result = await agent
      .delete(path + `/${organizationId}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)

    assert.isObject(result)
    assert.isObject(result.body)
    expect(result.statusCode).to.be.equal(200)
  })
})
