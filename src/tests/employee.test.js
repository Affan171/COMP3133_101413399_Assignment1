const request = require('supertest');
const app = require('../server');
const Employee = require('../models/employee');

describe('Employee Management Tests', () => {
    let token = '';

    beforeAll(async () => {
        const res = await request(app).post('/graphql').send({
            query: `
                mutation {
                    signup(username: "employeeUser", email: "employee@example.com", password: "password123") {
                        token
                    }
                }
            `
        });
        token = res.body.data.signup.token;
    });

    test('❌ Should fail to add an employee without authorization', async () => {
        const res = await request(app).post('/graphql').send({
            query: `
                mutation {
                    addEmployee(
                        first_name: "John",
                        last_name: "Doe",
                        email: "johndoe@example.com",
                        gender: "Male",
                        designation: "Engineer",
                        salary: 5000,
                        date_of_joining: "2023-05-01",
                        department: "IT"
                    ) {
                        id
                        first_name
                        email
                    }
                }
            `
        });
        expect(res.body.errors).toBeDefined();
        expect(res.body.errors[0].message).toContain("Unauthorized");
    });

    test('✅ Should successfully add an employee with authorization', async () => {
        const res = await request(app)
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `
                    mutation {
                        addEmployee(
                            first_name: "John",
                            last_name: "Doe",
                            email: "johndoe@example.com",
                            gender: "Male",
                            designation: "Engineer",
                            salary: 5000,
                            date_of_joining: "2023-05-01",
                            department: "IT"
                        ) {
                            id
                            first_name
                            email
                        }
                    }
                `
            });

        expect(res.body.data.addEmployee.id).toBeDefined();
        expect(res.body.data.addEmployee.email).toBe("johndoe@example.com");
    });

    test('✅ Should fetch all employees with authorization', async () => {
        const res = await request(app)
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `
                    query {
                        getAllEmployees {
                            id
                            first_name
                            email
                        }
                    }
                `
            });

        expect(res.body.data.getAllEmployees.length).toBeGreaterThan(0);
    });

    test('❌ Should fail fetching employees without authorization', async () => {
        const res = await request(app).post('/graphql').send({
            query: `
                query {
                    getAllEmployees {
                        id
                        first_name
                        email
                    }
                }
            `
        });
        expect(res.body.errors).toBeDefined();
        expect(res.body.errors[0].message).toContain("Unauthorized");
    });
});
