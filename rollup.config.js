import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";
import pkg from "./package.json";
import commonjs from "@rollup/plugin-commonjs";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        exports: "named",
        sourcemap: true,
        strict: false,
      },
    ],
    plugins: [
      commonjs(),
      typescript({
        objectHashIgnoreUnknownHack: true,
        clean: true,
        tsconfigOverride: {
          compilerOptions: {
            declaration: true,
            module: "es2015",
          },
        },
      }),
    ],
  },
  {
    input: "dist/index.d.ts",
    output: [
      {
        file: "dist/main.d.ts",
        format: "cjs",
      },
    ],
    plugins: [dts()],
  },
];
