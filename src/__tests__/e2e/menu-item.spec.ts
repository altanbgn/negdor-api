import supertest from "supertest"
import { expect, assert } from "chai"

// Local
import app from "@/app"
import config from "@/utils/config"
import prisma from "@/prisma"
import testData from "@/__tests__/test-data.json"

const agent = supertest.agent(app)
const path = `/${config.apiPrefix}/menu-item`

describe("Module: MenuItem", function() {
  let token = ""
  let menuId = ""
  let menuItemId = ""
  let orgId = ""

  this.timeout(10000)
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

    const createdMenu = await agent
      .post(`/${config.apiPrefix}/menu`)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({
        title: "test-menu",
        description: "test-menu-description",
        organizationId: orgId,
      })

    menuId = createdMenu.body.data.id
  })

  this.afterAll(async function() {
    await prisma.menu.delete({ where: { id: menuId } })
    await prisma.organization.delete({ where: { id: orgId } })
  })

  it("MenuItem create (permission: CLIENT)", async function() {
    const result = await agent
      .post(path)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({
        title: "test-menu-item",
        description: "test-menu-item-description",
        price: 10000,
        image: "test-menu-item-image",
        menuId
      })

    menuItemId = result.body.data.id

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    expect(result.statusCode).to.be.equal(201)
  })

  it("MenuItem list", async function() {
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

  it("MenuItem findById", async function() {
    const result = await agent
      .get(path + `/${menuItemId}`)
      .set("Content-Type", "application/json")

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    expect(result.statusCode).to.be.equal(200)
  })

  it("MenuItem updateById (permission: CLIENT)", async function() {
    const result = await agent
      .put(path + `/${menuItemId}`)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({
        title: "test-menu-item-updated",
        description: "test-menu-item-description-updated",
        price: 90000,
        image: "test-menu-item-image-updated",
      })

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    expect(result.statusCode).to.be.equal(200)
  })

  it("MenuItem deleteById (permission: CLIENT)", async function() {
    const result = await agent
      .delete(path + `/${menuItemId}`)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    expect(result.statusCode).to.be.equal(200)
  })
})
