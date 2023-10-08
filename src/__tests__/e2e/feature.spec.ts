import supertest from "supertest"
import { expect, assert } from "chai"

import app from "@/app"
import config from "@/utils/config"
import prisma from "@/prisma"

const agent = supertest.agent(app)
const path = `/${config.apiPrefix}/feature`

describe("Module: Feature", function() {

})
