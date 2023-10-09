import supertest from "supertest"
import { expect, assert } from "chai"

import app from "@/app"
import config from "@/utils/config"

const agent = supertest.agent(app)
const path = `/${config.apiPrefix}/feature`

describe("Module: Feature", function() {
  let token = ""
  let featureId = ""

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

  it("Feature create (permission: ADMIN)", async function() {
    const result = await agent
      .post(path)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({
        icon: "test-feature-icon",
        value: "test-feature"
      })

    featureId = result.body.data.id

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    expect(result.statusCode).to.be.equal(201)
  })

  it("Feature list", async function() {
    const result = await agent
      .get(path + "/list")
      .set("Content-Type", "application/json")

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

  it("Feature findById", async function() {
    const result = await agent
      .get(path + `/${featureId}`)
      .set("Content-Type", "application/json")

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    expect(result.statusCode).to.be.equal(200)
  })

  it("Feature updateById (permission: ADMIN)", async function() {
    const result = await agent
      .put(path + `/${featureId}`)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({
        icon: "test-feature-icon-updated",
        value: "test-feature-updated"
      })

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    expect(result.statusCode).to.be.equal(200)
  })

  it("Feature deleteById (permission: ADMIN)", async function() {
    const result = await agent
      .delete(path + `/${featureId}`)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    expect(result.statusCode).to.be.equal(200)
  })
})
