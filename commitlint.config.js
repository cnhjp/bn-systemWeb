module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat', // 一个新的功能
                'fix', // 修复一个Bug
                'docs', // 变更的只有文档
                'style', // 空格, 分号等格式修复
                'refactor', // 代码重构，注意和特性、修复区分开
                'perf', //提升性能
                'test', // 添加一个测试
                'chore', // 开发工具变动(构建、脚手架工具等)
                'revert', // 代码回退
                'init', // 初始化项目
            ],
        ],
        'type-empty': [2, 'never'], // type不能为空
        'type-case': [0, 'always', 'lower-case'], // type不限制大小写
        'subject-empty': [2, 'never'], // subject（简短得描述）不能为空
        'subject-max-length': [1, 'always', 50], // subject最大长度，超出只会警告，不阻止提交
        'body-leading-blank': [1, 'always'],
        'footer-leading-blank': [1, 'always'],
        'header-max-length': [2, 'always', 72],
    },
}
