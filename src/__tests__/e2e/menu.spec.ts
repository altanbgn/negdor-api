import supertest from "supertest"
import { expect, assert } from "chai"

// Local
import app from "@/app"
import config from "@/utils/config"
import prisma from "@/prisma"
import testData from "@/__tests__/test-data.json"

const agent = supertest.agent(app)
const path = `/${config.apiPrefix}/menu`

describe("Module: Menu", function() {
  let token = ""
  let menuId = ""
  let orgId = ""

  this.beforeAll(async function() {
    const result = await agent
      .post(`/${config.apiPrefix}/auth/login`)
      .set("Content-Type", "application/json")
      .send({
        email: "test-admin@gmail.com",
        password: "test-password"
      })

    token = result.body.data

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

  it("Menu create (permission: CLIENT)", async function() {
    const result = await agent
      .post(path)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({
        title: "test-menu",
        description: "test-menu-description",
        organizationId: orgId,
      })

    menuId = result.body.data.id

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    expect(result.statusCode).to.be.equal(201)
  })

  it("Menu list", async function() {
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

  it("Menu findById", async function() {
    const result = await agent
      .get(path + `/${menuId}`)
      .set("Content-Type", "application/json")

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    expect(result.statusCode).to.be.equal(200)
  })

  it("Menu updateById (permission: CLIENT)", async function() {
    const result = await agent
      .put(path + `/${menuId}`)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({
        title: "test-menu-updated",
        description: "test-menu-description-updated",
      })

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    expect(result.statusCode).to.be.equal(200)
  })

  it("Menu deleteById (permission: CLIENT)", async function() {
    const result = await agent
      .delete(path + `/${menuId}`)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    expect(result.statusCode).to.be.equal(200)
  })
})
