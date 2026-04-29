// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require('nativewind/metro');

const { withNativeWind } = require("nativewind/metro");
const { getDefaultConfig } = require("expo/metro-config");

const path = require("path");

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  "@": path.resolve(__dirname),
};

module.exports = withNativeWind(config, { input: "./global.css" });
