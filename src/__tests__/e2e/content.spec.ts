import supertest from "supertest"
import { expect, assert } from "chai"

// Local
import app from "@/app"
import config from "@/utils/config"
import prisma from "@/prisma"

const agent = supertest.agent(app)
const path = `/${config.apiPrefix}/content`

describe("Module: Content", function() {
  let token = ""
  let contentKey = ""

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

  this.afterAll(async function() {
    await prisma.content.deleteMany({
      where: { key: "test-content-key" }
    })
  })

  it("Content create (permission: ADMIN)", async function() {
    const result = await agent
      .post(path)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ key: "test-content-key", value: "test-content-value" })

    contentKey = result.body.data.key

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    expect(result.statusCode).to.be.equal(201)
  })

  it("Content list", async function() {
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

  it("Content findByKey", async function() {
    const result = await agent
      .get(path + `/${contentKey}`)
      .set("Content-Type", "application/json")

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    expect(result.statusCode).to.be.equal(200)
  })

  it("Content updateByKey (permission: ADMIN)", async function() {
    const result = await agent
      .put(path + `/${contentKey}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ value: "test-content-value-updated" })

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    expect(result.statusCode).to.be.equal(200)
  })

  it("Content deleteByKey (permission: ADMIN)", async function() {
    const result = await agent
      .delete(path + `/${contentKey}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    expect(result.statusCode).to.be.equal(200)
  })
})
