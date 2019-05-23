package(default_visibility = ["//visibility:public"])

load("@npm_bazel_typescript//:defs.bzl", "ts_devserver", "ts_library")

ts_library(
    name = "app",
    srcs = ["test.ts"],
    deps = ["//lexer", "//parser", "//interpreter"],
)

load("@build_bazel_rules_nodejs//:defs.bzl", "rollup_bundle")

rollup_bundle(
  name = "bundle",
  entry_point = "test.js",
  deps = [":app"],
)
