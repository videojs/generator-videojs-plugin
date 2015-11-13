# <%= packageName %>

A plugin for video.js. 

## Getting Started

1. Clone this repository!
1. Install dependencies: `npm install`
1. Run a development server: `npm start`

That's it! Refer to the [video.js plugin standards](docs/standards.md) for more detail.

### Running Tests

- In all available and supported browsers: `npm test`
- In a specific browser: `npm run test:chrome`, `npm run test:firefox`, etc.
- While development server is running, navigate to [`http://localhost:9999/test/`](http://localhost:9999/test/) (_note:_ port may vary, check console output)

### Tag and Release

1. Make sure everything is committed.
1. `npm version *` where `*` is `major`, `minor`, `patch`, etc. [Read more about versioning.](docs/standards.md#versioning)
1. `npm publish`

## License

<%= licenseName %>
