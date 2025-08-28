# Keycloak Authentication Flow Examples

This project demonstrates various OAuth 2.0 and OpenID Connect authentication flows using Keycloak.

## Getting Started

### Prerequisites
- Docker and Docker Compose installed
- Node.js and npm (within the container)

### Running the Project

1. **Navigate to the keycloak directory and start Keycloak:**
   ```bash
   cd ~/keycloak
   docker compose build
   docker compose up
   ```

2. **Navigate to the project directory:**
   ```bash
   cd ~/keycloak/authentication-flow
   ```

3. **Build the Docker containers:**
   ```bash
   docker compose build
   ```

4. **Start the services in detached mode:**
   ```bash
   docker compose up -d
   ```

5. **Access the application container:**
   ```bash
   docker compose exec app bash
   ```

6. **Run the authentication flow examples:**
   
   Execute any of the following commands to test different OAuth 2.0 flows:
   
   ```bash
   # Authorization Code Flow
   npm run authorization-code
   
   # Implicit Flow
   npm run implicit
   
   # Hybrid Flow
   npm run hybrid
   
   # Resource Owner Password Credentials Flow
   npm run resource-owner
   ```

## Authentication Flows

- **Authorization Code Flow**: Most secure flow for web applications
- **Implicit Flow**: Simplified flow for single-page applications (deprecated)
- **Hybrid Flow**: Combination of authorization code and implicit flows
- **Resource Owner Password Credentials Flow**: Direct exchange of username and password