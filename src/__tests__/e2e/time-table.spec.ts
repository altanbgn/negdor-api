import supertest from "supertest"
import { expect, assert } from "chai"

// Local
import app from "@/app"
import config from "@/utils/config"
import prisma from "@/prisma"
import testData from "@/__tests__/test-data.json"
const agent = supertest.agent(app)
const path = `/${config.apiPrefix}/time-table`

describe("Module: Time-Table", async function() {
  let token = ""
  let orgId = ""
  let timeTableId = ""

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
    await prisma.timeTable.deleteMany({ where: { organizationId: orgId } })
    await prisma.organization.delete({ where: { id: orgId } })
  })

  it("Time-Table create (permission: ADMIN)", async function() {
    const result = await agent
      .post(path)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({
        weekday: "TUESDAY",
        startTime: "07:30",
        endTime: "18:30",
        organizationId: orgId
      })

    timeTableId = result.body.data.id

    assert.isObject(result)
    assert.isObject(result.body)
    expect(result.statusCode).to.be.equal(201)
  })

  it("Time-Table list", async function() {
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

  it("Time-Table findById", async function() {
    const result = await agent
      .get(path + `/${timeTableId}`)
      .set("Content-Type", "application/json")

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    expect(result.statusCode).to.be.equal(200)
  })

  it("Time-Table updateById (permission: ADMIN)", async function() {
    const result = await agent
      .put(path + `/${timeTableId}`)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({
        startTime: "08:30",
        endTime: "19:30",
      })

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    expect(result.statusCode).to.be.equal(200)
  })

  it("Time-Table deleteById (permission: ADMIN)", async function() {
    const result = await agent
      .put(path + `/${timeTableId}`)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({
        startTime: "08:30",
        endTime: "19:30",
      })

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isObject(result.body.data)
    expect(result.statusCode).to.be.equal(200)
  })
})
