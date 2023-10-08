import supertest from "supertest"
import { expect, assert } from "chai"

// Local
import app from "@/app"
import config from "@/utils/config"
import prisma from "@/prisma"

const agent = supertest.agent(app)
const path = `/${config.apiPrefix}/category`

describe("Module: Category", function() {
  let token = ""
  let categoryId = ""

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
    await prisma.category.deleteMany({
      where: {
        OR: [
          { value: "test-parent-category" },
          { value: "test-child-category" }
        ]
      }
    })
  })

  it("Category create parent (user: ADMIN)", async function() {
    const result = await agent
      .post(`${path}`)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({ value: "test-parent-category" })

    categoryId = result.body.data.id

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    expect(result.statusCode).to.be.equal(201)
  })

  it("Category create child (user: ADMIN)", async function() {
    const result = await agent
      .post(`${path}`)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({
        value: "test-child-category",
        parentId: categoryId
      })

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    expect(result.statusCode).to.be.equal(201)
  })

  it("Category list", async function() {
    const result = await agent
      .get(`${path}/list`)
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

  it("Category find one", async function() {
    const result = await agent
      .get(`${path}/${categoryId}`)
      .set("Content-Type", "application/json")

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)

    expect(result.statusCode).to.be.equal(200)
  })
})
