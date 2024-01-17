import mongoose from "mongoose";
import request from 'supertest';
import "dotenv/config";

import app from '../app';

const { MONGODB_URI } = process.env;

beforeEach(async () => {
  await mongoose.connect(MONGODB_URI as string);
})

describe("GET /health", () => {
  it('response', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toEqual(200);
  });
})

afterEach(async () => {
  await mongoose.connection.close();
})