# HotelOS
To build and run this project correctly, please make sure you follow these instructions:
**Docker Desktop** must be running in the background before starting the project.

## build and test
The service can be built using the following command:

`mvn clean install`

This skips unit tests:

`mvn clean install -DskipTests=true`

## Run application
The service can be run using the following command:

`mvn spring-boot:run`


### The PostgreSQL container is automatically started if it is not already running.
This behavior is implemented using **exec-maven-plugin**

If the application terminates, the container is not shut down automatically and will continue running in the background.


### Port Requirements
Before starting the application, make sure the following ports are free and not used by any other processes:

**5432** – default port for PostgreSQL

**8080** – default port for the application backend