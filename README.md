FA Full Time Mobile application
===

## Context

The FA Full Time website is a central hub of amateur football league statistics. There is a great amount of data publicly available through the full time website, and it is updated very quickly after games have finished on a saturday afternoon. The Football Association (aka the FA) have done a fantastic job of building and promoting the website to the amateur football community.

Sadly, the website has an awful mobile experience. This project provides a mobile application with a view into some of the vast amount of data available on the FA Full Time website.


## Objectives / Requirements

- As a user I want the ability to view a list of all the leagues
- As a user I want the ability to view the most recent results from a league that I have selected
- As a user I want the ability to view the current standings in a league that I have selected


## Components

There are three components to the system which work together. 

1. Scraper

- Fetches HTML pages from the FA Full Time website and extracts the match results for each league
- Written in Elixir
- Uses GraphQL mutation queries to post the match results into the middleware 

2. Middlware

- Used as a fascilitate moving the football data between the scraper and the mobile app
- Written in Scala
- GraphQL endpoint
- Stores data in memory but plans to use a persistence data store
- Has GraphiQL page to aid development and debugging


3. Mobile App

- Simply displays the data held in the middleware
- React Native used to construct the user interface
- Redux (with thunks) used for state management
- GraphQL queries used for fetching data from the middleware
- Extra fun stuff used such as:
	- redux-thunk
	- react-navigation
	- flow static type checking
- Plans to add more views with images and animation


## Usage instructions

### Pre-requisites

I shortly hope to containerise the components, so that in the future you won't need to install so much software just to get this app to run on your machine!

Software required:

- [Elixir lang v1.4](http://elixir-lang.org/). You can verify that Elixir is installed by running `elixir -v` in a Terminal window.  The output should contain the text "Elixir 1.4.2".  Elixir is used by the component which scrapes football data from the FA Full Time website.
- [Scala and SBT](https://www.scala-lang.org/).  You can verify that scala and SBT are installed by running `sbt --version` in a Terminal window.  Scala is used to serve the GraphQL endpoint.
- [React Native environment](https://facebook.github.io/react-native/docs/getting-started.html).  You'll need a working React Native environment set up.  Either iOS or Android work on MacOS, or Android on Windows.

- You need to make sure that no other process is bound to ports 8080 or 8081 before starting the middleware and the mobile application.


### Usage

1. Start the middleware 

First start the middleware component. Open a Terminal window and `cd` into the middleware directory and execute `sbt run` to start the web server.  During the first startup of the middleware, all of the dependencies are fetched and it can take a few minutes to start.

When the server has started, then the output in the Terminal is paused on `[info] Running Server`. You will be able to interact with the graphQL endpoint by using the [GraphiQL](http://localhost:9001/graphql?query=%7B%0A%20%20leagues%20%7B%0A%20%20%20%20id%0A%20%20%20%20name%0A%20%20%20%20standings%20%7B%0A%20%20%20%20%20%20teamName%0A%20%20%20%20%20%20matchesPlayed%0A%20%20%20%20%20%20points%0A%20%20%20%20%7D%0A%20%20%20%20results%20%7B%0A%20%20%20%20%20%20date%0A%20%20%20%20%20%20homeTeam%20%7B%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20awayTeam%20%7B%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20homeScore%0A%20%20%20%20%20%20awayScore%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A) page.


2. (Optional) start the scraper

Starting the scraper is optional, because the middleware contains some initial seed data.  Open a Terminal window and `cd` into the scraper directory.  Run `mix run` to install the dependencies and run the data scrape.  After scraping the data from the FA Full Time website, the program will exit.

3. Start the mobile application

Open a Terminal window and `cd` into the mobile directory. To start the application inside the iOS simulator, run `react-native run-ios`.  If you wish to run the application inside the Android emulator, run `react-native run-android`.

Please note that the mobile application is currently hard-coded to use 'http://localhost:8080/graphql' for the API endpoint.


## Schema

The schema known to all components is as follows:

- League(id, name)
- Team(id, name)
- Fixture(id, name, date, homeTeam, awayTeam, homeScore, awayScore)
- TeamStanding(league, team, position, matchesPlayed, goalDifference, points)


## Hopes and dreams for future improvements

- Jest used for unit testing components. Fake stores can be used to isolate and test the Redux Containers.

- Create a Dockerfile for each of the three components, so that users don't have to install so much software just to get the application to run.  After each component is Dockerised, then docker-compose can be used so that a single Terminal command will start all services.

- Dependency injection for the scraper, so that tests can be written against the parsing logic

- League discovery for the scraper. Currently only one league is searched and it the URL is hardcoded, however there should be a way to find a list of leagues to search

- Allow for the URL of the GraphQL endpoint to be easily configurable when starting the mobile application

- Enhance the mobile to display more data, make use of Images and React Native's Animation library

- Improve the layout and colour schemes to look better on Android devices