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
  let orgId = ""

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

  it("Organization create (permission: CLIENT)", async function() {
    const result = await agent
      .post(path)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(testData.organizationCreate)

    orgId = result.body.data.id

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    expect(result.statusCode).to.be.equal(201)
  })

  it("Organization adding socials (permission: CLIENT)", async function() {
    const result = await agent
      .put(path + `/${orgId}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ socials: testData.organizationSocials })

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    assert.isObject(result.body.data.socials)
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

  it("Organization findById (permission: CLIENT)", async function() {
    const result = await agent
      .get(path + `/${orgId}`)
      .set("Content-Type", "application/json")

    assert.isObject(result)
    assert.isObject(result.body)
    expect(result.statusCode).to.be.equal(200)
  })

  it("Organization updateById (permission: CLIENT)", async function() {
    const result = await agent
      .put(path + `/${orgId}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(testData.organizationUpdate)

    assert.isObject(result)
    assert.isObject(result.body)
    expect(result.statusCode).to.be.equal(200)
  })

  it("Organization deleteById (permission: CLIENT)", async function() {
    const result = await agent
      .delete(path + `/${orgId}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)

    assert.isObject(result)
    assert.isObject(result.body)
    expect(result.statusCode).to.be.equal(200)
  })
})
