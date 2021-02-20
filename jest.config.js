const path = require('path');

module.exports = {
    setupFiles: ['<rootDir>/__tests__/setting/setup.js'],
    moduleNameMapper: {
        "^.*[.](jpg|JPG|gif|GIF|png|PNG|less|LESS|css|CSS|scss|SCSS)$" : path.join(__dirname,  `EmptyModule`)
    },
    moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],
    transformIgnorePatterns: [ "/node_modules/" ],
    unmockedModulePathPatterns: [
      "<rootDir>/node_modules/react",
      "<rootDir>/node_modules/react-dom",
      "<rootDir>/node_modules/react-addons-test-utils",
      "<rootDir>/EmptyModule.js"
    ],
    preset: 'ts-jest',
    modulePathIgnorePatterns : ["<rootDir>/__tests__/setting"]
};
