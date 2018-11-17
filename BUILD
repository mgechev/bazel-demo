package(default_visibility = ["//visibility:public"])

load("@build_bazel_rules_typescript//:defs.bzl", "ts_library")

ts_library(
    name = "app",
    srcs = ["test.ts"],
    deps = ["//lexer", "//parser", "//interpreter"],
)
