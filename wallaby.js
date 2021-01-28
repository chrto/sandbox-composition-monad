module.exports = function () {
    return {
      files: [
        "package.json",
        "jest.config.js",
        "src/**/*.ts",
        "!src/**/*.test.ts",
      ],
      tests: [
        "src/**/*.test.ts",
      ],
      env: {
        type: "node"
      },
      // or any other supported testing framework:
      // https://wallabyjs.com/docs/integration/overview.html#supported-testing-frameworks
      testFramework: "jest",
      debug: true,
      setup: function (wallaby) {
        var jestConfig = require('./jest.config.js');
        wallaby.testFramework.configure(jestConfig);
      }
    };
  };
