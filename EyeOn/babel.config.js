const plugin = require("tailwindcss");

module.exports = function (api) {
    api.cache(true);
    return {
      presets: [
        [
          "babel-preset-expo", 
          { 
            jsxImportSource: "nativewind" 
          }
        ],
        "nativewind/babel",
      ],
      plugins:[
        [
          "module:react-native-dotenv",
          { 
            moduleNaeme:"@env",
            path:".env",
          }
        ]
      ]
    };
  };