const _ = require('lodash');

const {
    notUNE,
    notUN
} = require('../../helper/validatorHelper');
const Utils = require('../../helper/utils');
const RESPONSE = require('../../classes/RESPONSER');

const { c, cpp, node, python, java } = require('compile-run');
const resultLimitCharacter = 30000;
const errorLimitCharacter = 30000;
const forMinutes = 60000 /* 1 Min */ * 20; // should not take more then 20 minutes!
const compilerOpetion = {
    timeout: forMinutes,
    compileTimeout: forMinutes,
    stderrLimit: errorLimitCharacter,
    stdoutLimit: resultLimitCharacter,
    // stdin:
    // compilerArgs:
    // executionPath:
    // compilationPath:
}

const not = (o) => !o;

class COMPILER_LOGIC {

    async java(req, res) {
        req.setTimeout(forMinutes); // because this route is going to do a lot havvy work!
        const { code } = _.pick(req.body, ['code']);
        // "public class Main { public static void main(String[] args) { System.out.println(\"Hello, From xCodeClazz\"); } }"
        java.runSource(code, compilerOpetion, (err, result) => new RESPONSE(res).ok({ err, result: { ...result, lang: 'java' } }));
    }

    async c(req, res) {
        req.setTimeout(forMinutes); // because this route is going to do a lot havvy work!
        const { code } = _.pick(req.body, ['code']);
        // "#include <stdio.h>\nint main() { printf(\"Hello, World!\"); return 0; }"
        c.runSource(code, compilerOpetion, (err, result) => new RESPONSE(res).ok({ err, result: { ...result, lang: 'c' } }));
    }

    async cpp(req, res) {
        req.setTimeout(forMinutes); // because this route is going to do a lot havvy work!
        const { code } = _.pick(req.body, ['code']);
        // "#include <iostream>\nusing namespace std; int main() { cout << \"Hi, From xCodeClazz\"; return 0; }"
        cpp.runSource(code, compilerOpetion, (err, result) => new RESPONSE(res).ok({ err, result: { ...result, lang: 'cpp' } }));
    }

    async python(req, res) {
        req.setTimeout(forMinutes); // because this route is going to do a lot havvy work!
        const { code } = _.pick(req.body, ['code']);
        // "print(\"Pussy World\")\nprint(\"How do you do\")"
        python.runSource(code, compilerOpetion, (err, result) => new RESPONSE(res).ok({ err, result: { ...result, lang: 'python' } }));
    }

    async node(req, res) {
        req.setTimeout(forMinutes); // because this route is going to do a lot havvy work!
        const { code } = _.pick(req.body, ['code']);
        // "const os = require(\"os\"); console.log(os.version());"
        node.runSource(code, compilerOpetion, (err, result) => new RESPONSE(res).ok({ err, result: { ...result, lang: 'node' } }));
    }

}

module.exports = COMPILER_LOGIC;