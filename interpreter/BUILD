load("@build_bazel_rules_typescript//:defs.bzl", "ts_library")
package(default_visibility = ["//visibility:public"])

ts_library(
    name = "interpreter",
    srcs = glob(["*.ts"]),
    deps = ["//lexer", "//parser"],
)
