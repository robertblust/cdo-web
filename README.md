This repository is no longer maintained. It stays online as a reference.

## Flatland CDO Web

A browser client for the [Flatland CDO Server](https://github.com/robertblust/cdo-server), which
serves an [Eclipse CDO](https://www.eclipse.org/cdo/) repository over a generic REST API. The
client carries no model of its own; every screen is built from what that API returns, so a
repository whose model changes needs no change here.

Login takes the repository endpoint, a username and a password, sent as HTTP basic
authentication and kept in a cookie. The repository is then a tree: selecting a node shows its
attributes and its references, either of which can be edited, a node can be added under its
container or removed, and a search matches an element by id, name or description. The endpoint
defaults to `http://localhost:8080` and is replaced by whatever the login form carries.

It is a single-page AngularJS 1.3 application with Bootstrap 3. Dependencies come from Bower,
the build is Grunt and the tests run under Karma with Jasmine. `grunt serve`, `grunt build` and
`grunt test` are the tasks the Gruntfile registers; the pinned dependencies are from 2015 and
were not reinstalled to check that they still resolve.

## License
[Eclipse Public License Version 1.0 ("EPL")](LICENSE)
