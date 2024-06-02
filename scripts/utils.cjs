/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const fs = require("fs");

/**
 * 获取私钥内容
 * @param {string} privateKeyRelativePath 私钥文件相对 .ssh 路径
 */
exports.getPrivateKey = function(privateKeyRelativePath) {
    const content = fs.readFileSync(path.join(process.env.HOME, ".ssh", privateKeyRelativePath), {
        encoding: "utf-8"
    })
    return content;
}
