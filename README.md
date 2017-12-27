# StreetSupport Admin

The website codebase for admin.streetsupport.net.

## Git Branching

Please work in the `develop` branch first, and use feature branches for significant pieces of work. Once the feature is completed, submit a pull request into `develop`. Travis CI automatically builds on each commit to `develop`, `uat` and `prod`. The `prod` branch automatically builds to: [http://admin.streetsupport.net](http://admin.streetsupport.net).

## Build Status

* vulnerabilities - [![Known Vulnerabilities](https://snyk.io/test/github/StreetSupport/streetsupport-admin/8c0ef3ed832677243eda9456bf78e024c9519994/badge.svg)](https://snyk.io/test/github/StreetSupport/streetsupport-admin/8c0ef3ed832677243eda9456bf78e024c9519994)
* develop - [![Build Status](https://travis-ci.org/StreetSupport/streetsupport-admin.svg?branch=develop)](https://travis-ci.org/StreetSupport/streetsupport-admin)
* staging - [![Build Status](https://travis-ci.org/StreetSupport/streetsupport-admin.svg?branch=uat)](https://travis-ci.org/StreetSupport/streetsupport-admin)
* release - [![Build Status](https://travis-ci.org/StreetSupport/streetsupport-admin.svg?branch=release)](https://travis-ci.org/StreetSupport/streetsupport-admin)

## Install

* Install Node 6 LTS,
* Run in Terminal: `npm i gulp-cli -g` (Gulp does not need to be installed globally),
* In your command line terminal, navigate to the street support project folder,
* Run: `npm i`.

See [https://github.com/fephil/garrus](https://github.com/fephil/garrus) for more information about the Frontend workflow.

### Optional Installs

In your editor of choice, the following plugins are recommended but not required. Note the plugin names might be slightly different depending on your editor.

* editorconfig,
* tabs-to-spaces,
* linter,
* linter-handlebars,
* linter-js-standard,
* linter-stylelint.

## Usage

Run these tasks in your command line Terminal:

`gulp [--production] [--debug]`

`gulp deploy [--production] [--debug]`

`gulp auditcode`

* The `gulp` task builds the website, watches for changes and starts up a sever,
* The `gulp deploy` task builds the website without watching for changes or running the server,
* The `gulp auditcode` task runs various linting on the project source files,
* The `gulp jsdev` task only checks and builds javascript with associated tests,
* The `--production` flag builds minified assets with no sourcemaps,
* The `--debug` flag shows the files being created in each task (if the task has a pipe).

## Development

### Workflow

On running the default `gulp` task from the terminal, it will run tests and linting, build the site into the `/_dist/` directory, and then launch in your default browser. As you edit files in the `/src/` directory, the site will refresh automatically.

### Pages

Each page of the site is found under the `/pages/` directory. Each page is represented by a handlebars file `index.hbs`, in a directory named after the page's url. In each `.hbs` file, meta data is entered to define the page:

* title: the page's title tag
* description: the page's meta description
* layout: the master layout file (found in `/layouts/`)
* permalink: ???
* jsBundle: the js bundle that will be loaded into the page. Bundles are defined in `/webpack.config.js` and each one points to a js file in `/src/js/`
* section: the top level navigation item this page belongs to. See `/src/scss/modules/_variables.scss` for list of sections
* page: the navigation item for this page. See `/src/scss/modules/_variables.scss` for list of pages
* nosubnav: {true|false} if `true`, hide the sub navigation on the page

Page templating is done using [Hogan](http://twitter.github.io/hogan.js/). Note: template parts need to be escaped eg:

``` \{{myVariable}} ```

[Knockout](http://knockoutjs.com/) data-binding is also used in some pages.

### Javascript

Page code-behinds are written in plain ol' Javascript, or use [Knockout](http://knockoutjs.com/). Knockout view models are found in `/js/models/` are mostly tested. [ES2015](https://babeljs.io/learn-es2015/) syntax is transpiled using [Babel](https://babeljs.io/).

### API Environment

For dev against a local dev API:

* Update the index in `src/js/env.js` to `0` connect to `local` env.
* Update the local url in `src/js/api-endpoints` to your local environment API url e.g. `var local = 'http://localhost:8080'`

### Testing

Tests reside in the `/spec` directory, and are written using [Jasmine](https://jasmine.github.io/) and [Sinon](http://sinonjs.org/). Please ensure any features submitted via pull request are covered by tests.

A number of happy paths are covered by automated browsers tests at: [https://github.com/StreetSupport/web-automated-testing](https://github.com/StreetSupport/web-automated-testing).

### Logins

With the `env` variable set to dev (1), you can use the following login credentials:

* `superadmin:StreetSupport!` access all the things!
* `anaccomadmin:StreetSupport!` an admin for an individual accommodation entry
* `mcradmin:StreetSupport!` an admin for the manchester area
* `tempaccomadmin:StreetSupport!` an admin for B&Bs reviews
* `orgadmin:StreetSupport!` an admin for an individual organisation

### Styling

CSS styling is written in Sass, based on [Susy](http://susy.oddbird.net/), in the [BEM](http://getbem.com/introduction/) style, and is auto-prefixed. Build with a mobile-first approach, using [sass-mq](https://github.com/sass-mq/sass-mq) for media queries.
Each component's styles should reside in its own file. Avoid nesting of elements and modifiers (although there are many cases of nesting at the moment!).
