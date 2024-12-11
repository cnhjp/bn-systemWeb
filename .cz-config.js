module.exports = {
    /** 提交类型 可选列表 */
    types: [
        { value: 'feat', name: '特性:    一个新的功能' },
        { value: 'fix', name: '修复:    修复一个Bug' },
        { value: 'docs', name: '文档:    变更的只有文档' },
        { value: 'style', name: '格式:    空格, 分号等格式修复' },
        { value: 'refactor', name: '重构:    代码重构，注意和特性、修复区分开' },
        { value: 'perf', name: '性能:    提升性能' },
        { value: 'test', name: '测试:    添加一个测试' },
        { value: 'chore', name: '工具:    开发工具变动(构建、脚手架工具等)' },
        { value: 'revert', name: '回滚:    代码回退' },
    ],
    /** 更改范围 可选列表 */
    scopes: [{ name: 'scope-1' }, { name: 'scope-2' }, { name: 'scope-3' }, { name: 'scope-4' }],
    /** 覆盖交互提示信息 */
    messages: {
        type: '请选择你的提交类型',
        scope: '请选择更改的范围',
        subject: '简短描述本次修改:\n',
        body: '提供关于本次修改更具体的信息（可选），使用 "|" 换行：\n',
        footer: '列出此更改关闭的任何问题(可选)。例:#31，#34\n',
        confirmCommit: '确定提交信息？',
    },
    /** 跳过任何你想要的问题 */
    skipQuestions: ['scope', 'body', 'footer'],
    /** 限制主题长度 */
    subjectLimit: 100,
}
