const request = require('supertest');
const app = require('../server'); // Import Express app
const User = require('../models/user');
const mongoose = require('mongoose');

beforeAll(async () => {
    await User.deleteMany({}); // Clear existing users before running tests
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('User Authentication Tests', () => {
    let token = '';

    test('❌ Should fail signup due to missing fields', async () => {
        const res = await request(app).post('/graphql').send({
            query: `
                mutation {
                    signup(username: "", email: "invalidemail", password: "123") {
                        token
                        user {
                            id
                            username
                        }
                    }
                }
            `
        });
        expect(res.body.errors).toBeDefined();
        expect(res.body.errors[0].message).toContain("Invalid email format");
    });

    test('✅ Should successfully sign up a user', async () => {
        const res = await request(app).post('/graphql').send({
            query: `
                mutation {
                    signup(username: "testuser", email: "testuser@example.com", password: "password123") {
                        token
                        user {
                            id
                            username
                        }
                    }
                }
            `
        });
        expect(res.body.data.signup.token).toBeDefined();
        token = res.body.data.signup.token;
    });

    test('✅ Should successfully login a user', async () => {
        const res = await request(app).post('/graphql').send({
            query: `
                query {
                    login(email: "testuser@example.com", password: "password123") {
                        token
                        user {
                            id
                            username
                        }
                    }
                }
            `
        });
        expect(res.body.data.login.token).toBeDefined();
    });

    test('❌ Should fail login with incorrect password', async () => {
        const res = await request(app).post('/graphql').send({
            query: `
                query {
                    login(email: "testuser@example.com", password: "wrongpassword") {
                        token
                        user {
                            id
                            username
                        }
                    }
                }
            `
        });
        expect(res.body.errors).toBeDefined();
        expect(res.body.errors[0].message).toContain("Invalid credentials");
    });
});
