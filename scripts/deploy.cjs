/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const SftpClient = require("ssh2-sftp-client");
const chalk = require("chalk");
const dayjs = require("dayjs");
const shell = require("shelljs");

const configObj = require("./config.cjs");

console.log("当前环境", chalk.blue(process.env.NODE_ENV));

/**
 * @type {import("ssh2-sftp-client").ConnectOptions[] | undefined}
 */
const configList = configObj[process.env.NODE_ENV];
if (!configList) throw new Error("当前环境找不到对应的配置");

function build() {
    if (shell.exec(`pnpm run build:${process.env.NODE_ENV}`).code === 0) {
        console.log(chalk.green("打包成功"));

        deploy();
    }
}

function deploy() {
    configList.forEach((item) => {
        const sftp = new SftpClient();
        sftp.connect(item)
            // 检测指定部署路径中是否存在
            .then(() => {
                return sftp.exists(item.path);
            })
            // 备份（重命名后再上传）
            .then((isExists) => {
                if (!isExists) return isExists;
                console.log(chalk.yellow(`${item.host}--`) + chalk.blue(`---备份中---`));
                const currentDate = dayjs();
                let newDirectory = `${item.backupPath}_${currentDate.format("YYYY_MM_DD")}_${currentDate.format("HH_mm_ss")}`;
                console.log(chalk.yellow(`${item.host}--`) + "备份文件夹路径:", newDirectory);

                // 执行服务器重命名操作
                return sftp.rename(
                    // 服务器路径
                    item.path,
                    // 备份路径
                    newDirectory,
                );
            })
            // 上传
            .then((isExists) => {
                if (isExists) {
                    console.log(chalk.yellow(`${item.host}--`) + chalk.green(`---备份完成---`));
                }

                console.log(chalk.yellow(`${item.host}--`) + chalk.blue(`---上传中---`));

                return sftp.uploadDir(path.resolve(__dirname, "../dist"), item.path);
            })
            // 上传成功，关闭连接
            .then(() => {
                console.log(chalk.yellow(`${item.host}--`) + chalk.green(`上传完成，部署成功`));
                sftp.end();
            });
    });
}

function run() {
    build();
}

run();
