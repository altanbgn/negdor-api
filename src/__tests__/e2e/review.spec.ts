import supertest from "supertest"
import { expect, assert } from "chai"

// Local
import app from "@/app"
import config from "@/utils/config"
import prisma from "@/prisma"

const agent = supertest.agent(app)
const path = `/${config.apiPrefix}/review`

describe("Module: Review (role: USER)", function () {
  let token = ""
  let organizationId = ""
  let reviewId = ""

  this.beforeAll(async function() {
    const result = await agent
      .post(`/${config.apiPrefix}/auth/login`)
      .set("Content-Type", "application/json")
      .send({
        email: "test-user@gmail.com",
        password: "test-password"
      })

    const org = await prisma.organization.create({
      data: {
        name: "Test Organization 1",
        handle: "test-organization-1",
        shortDescription: "Test Organization short description 1",
        fullDescription: "Test Organization full description 1",
        emails: ["altanbagana@protonmail.com"],
        phonenumbers: ["88789169"],
        locations: ["pog123"],
        director: "pog 1"
      }
    })


    token = result.body.data
    organizationId = org?.id || ""
  })

  this.afterAll(async function () {
    await prisma.review.deleteMany({})
    await prisma.organization.delete({ where: { id: organizationId } })
  })

  it("Review create (user: USER)", async function() {
    const result = await agent
      .post(path)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({
        title: "test-title",
        body: "test-body",
        organizationId
      })

    reviewId = result.body.data.id

    assert.isObject(result)
    assert.isObject(result.body)
    expect(result.statusCode).to.be.equal(201)
  })

  it("Review update (user: USER)", async function() {
    const result = await agent
      .put(path + `/${reviewId}`)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({
        title: "test-title updated",
        body: "test-body updated"
      })

    assert.isObject(result)
    assert.isObject(result.body)
    expect(result.statusCode).to.be.equal(200)
  })

  it("Review find (user: USER)", async function() {
    const result = await agent
      .get(path + `/${reviewId}`)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)

    assert.isObject(result)
    assert.isObject(result.body)
    expect(result.statusCode).to.be.equal(200)
  })

  it("Review delete (user: USER)", async function() {
    const result = await agent
      .delete(path + `/${reviewId}`)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)

    assert.isObject(result)
    assert.isObject(result.body)
    expect(result.statusCode).to.be.equal(200)
  })
})
