import supertest from "supertest"
import { expect, assert } from "chai"

// Local
import app from "@/app"
import config from "@/utils/config"
import prisma from "@/prisma"

const agent = supertest.agent(app)
const path = `/${config.apiPrefix}/auth`

describe("Module: Authentication", function () {
  this.timeout(10000)
  this.beforeAll(async function () {
    await prisma.user.deleteMany({
      where: { OR: [
        { username: "test-user-username" },
        { username: "test-admin-username" }
      ]}
    })
  })

  it("Registered user (role: USER)", async function () {
    const result = await agent
      .post(`${path}/register`)
      .set("Content-Type", "application/json")
      .send({
        avatar: "avatarimage.png",
        email: "test-user@gmail.com",
        firstname: "test-firstname",
        lastname: "test-lastname",
        username: "test-user-username",
        phonenumber: "1234567890",
        password: "test-password"
      })

    assert.isObject(result)
    assert.isObject(result.body)
    expect(result.statusCode).to.be.equal(201)
  })

  it("Registered user (role: ADMIN)", async function () {
    const result = await agent
      .post(`${path}/register`)
      .set("Content-Type", "application/json")
      .send({
        avatar: "avatarimage.png",
        email: "test-admin@gmail.com",
        firstname: "test-firstname",
        lastname: "test-lastname",
        username: "test-admin-username",
        phonenumber: "1234567890",
        password: "test-password"
      })

    await prisma.user.update({
      where: { username: "test-admin-username" },
      data: { role: "ADMIN" }
    })

    assert.isObject(result)
    assert.isObject(result.body)
    expect(result.statusCode).to.be.equal(201)
  })

  it("Login", async function () {
    const result = await agent
      .post(`${path}/login`)
      .set("Content-Type", "application/json")
      .send({
        email: "test-user@gmail.com",
        password: "test-password"
      })

    assert.isObject(result)
    assert.isObject(result.body)
    assert.isString(result.body.data)
    expect(result.statusCode).to.be.equal(200)
  })

  it("Forgot Password", async function () {
    this.timeout(10000)

    const result = await agent
      .post(`${path}/forgot-password`)
      .set("Content-Type", "application/json")
      .send({ email: "test@gmail.com" })

    assert.isObject(result)
    assert.isObject(result.body)
    expect(result.statusCode).to.be.equal(200)
    expect(result.body.message).to.be.equal("Password reset email sent successfully!")
  })

  console.log(
    "---------------------\n" +
    "* recover-password\n" +
    "* login-facebook\n" +
    "* login-google\n" +
    "---- Not tested! ----"
  )
})
