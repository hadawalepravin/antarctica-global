# Antarctica Global Api
This API registers a user with First Name, Last Name, Email Id, Password, a unique employeeId and Organization Name.

## Prerequisites
- NodeJS v8.11.3
- MongoDB Atlas (Free Version)

## Start Service
- Run "npm install"
- Update MONGO_USER, MONGO_PASSWORD and MONGO_DB parameters in nodemon.json
- Run "npm start"

## MongoDB Tables
- users (firstName, lastName, email, password)
- organizations (name, location)
- registrations (employeeId, userRef, organizationRef, createdAt, updatedAt)

## Sample Queries

### Create User
mutation {
  createUser(userInput: {
    firstName: "pravin", 
    lastName: "hadawale", 
    email: "pravinhadawale@gmail.com",
    password: "12345"
  }) {
    firstName
    lastName
    email
    password
  }
}

### Create Organization
mutation {
  createOrganization(organizationInput: {
    name: "google", 
    location: "mumbai"
  }) {
    name
    location
  }
}

### Read Users
query {
	users {
    _id
    firstName
    lastName
    email
    password
  }
}

### Read Organizations
query {
	organizations {
    _id
    name
    location
  }
}

### Login
query {
	login (email: "pravinhadawale@gmail.com", password: "12345") {
    userId
    token
    tokenExpiration
  }
}

### Register User with Organization and assign unique EmployeeId
mutation {
  register(registrationInput: {
    userId: "5f9e22cd9dbb643084ece6f3",
    organizationId: "5f9e23989dbb643084ece6f9" 
  }) {
    _id
    employeeId
    user {
      _id
      firstName
      lastName
      email
      password
    }
    organization {
      _id
      name
      location
    }
    createdAt
    updatedAt
  }
}

### Read Registrations
query {
	registrations {
    _id
    employeeId
    user {
      _id
      firstName
      lastName
      email
      password
    }
    organization {
      _id
      name
      location
    }
    createdAt
    updatedAt
  }
}

### Search Registrations by FirstName, LastName and EmployeeId
### Sort Registrations either by FirstName, LastName, Email, EmployeeId or OrganizationName
### Paginate using PageSize and PageIndex

query {
	filterRegistrations(filterInput: {
    firstName: "pravin",
    lastName: "hadawale",
    employeeId: "kgyj71x8",
    sortInput: {
      field: "firstName",
      order: 1
    },
    paginationInput: {
      size: 10,
      index: 1
    }
  }) {
    _id
    employeeId
    user {
      _id
      firstName
      lastName
      email
      password
    }
    organization {
      _id
      name
      location
    }
    createdAt
    updatedAt
  }
}

### SortInput
#### Possible field values: firstName, lastName, email, employeeId, organizationName
#### Possible order values: 1, -1
### PaginationInput
#### Default size value: 10
#### Default index value: 1

## Contact hadawalepravin@gmail.com for any queries
