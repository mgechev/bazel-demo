package(default_visibility = ["//visibility:public"])

load("@npm_bazel_typescript//:defs.bzl", "ts_devserver", "ts_library")

ts_library(
    name = "parser",
    srcs = glob(["*.ts"]),
    deps = ["//lexer"],
)

