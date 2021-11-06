# README

本工程是基于react+truffle+solidity进行开发的dapp，使用vscode+ganache进行开发，在打开项目前，首先需要连接ganache，并将端口设置为8545

在运行之前首先需要配置环境，使用命令：

```
npm install
```

### 1、合约部署

新建一个终端，并确保文件夹路径为dapp，在终端中输入命令：

```
truffle migrate
```

在终端窗口中找到selling.sol的合约的编译信息，将其中的contract address地址复制粘贴到src目录下allapi.js的第16行中。

### 2、运行项目

在终端中输入:

```
npm start run
```

开始运行

### 3、运行成功界面如下

![image-20211106113956083](/assets/picture1)

![image-20211106114033229](/assets/picture2)

