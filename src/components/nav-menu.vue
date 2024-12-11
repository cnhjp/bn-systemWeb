<script lang="ts">
import { definePropType } from '@/utils'
import SvgIcon from '@/components/svg-icon.vue'

export default defineComponent({
    props: {
        options: {
            type: definePropType<App.GlobalMenuOption[]>(Array),
            default() {
                return []
            },
        },
        collapse: {
            type: definePropType<boolean>(Boolean),
            default() {
                return false
            },
        },
        defaultActive: {
            type: definePropType<string>(String),
            default() {
                return ''
            },
        },
        props: {
            type: definePropType<{
                [key in keyof App.GlobalMenuOption]: string
            }>(Object),
            default() {
                return {
                    key: 'key',
                    index: 'index',
                    label: 'label',
                    icon: 'icon',
                    children: 'children',
                    group: 'group',
                    route: 'route',
                }
            },
        },
    },
    setup(props) {
        const createNavMenu = () => {
            return h(
                ElMenu,
                {
                    collapse: props.collapse,
                    defaultActive: props.defaultActive,
                },
                () => generate(props.options || []),
            )
        }
        const createSubMenu = (item: App.GlobalMenuOption) => {
            return h(
                ElSubMenu,
                {
                    key: item[props.props.index],
                    index: item[props.props.index],
                },
                {
                    default: () => generate(item[props.props.children]),
                    title: () => createMenuTitle(item),
                },
            )
        }
        const createMenuItem = (item: App.GlobalMenuOption) => {
            return h(
                ElMenuItem,
                {
                    key: item[props.props.index],
                    index: item[props.props.index],
                },
                () => createMenuTitle(item),
            )
        }
        const createMenuGroup = (title: string, items: App.GlobalMenuOption[]) => {
            const nodes: any[] = []
            items.forEach((item) => {
                if (item[props.props.children] && item[props.props.children].length > 0) {
                    nodes.push(createSubMenu(item))
                } else {
                    nodes.push(createMenuItem(item))
                }
            })
            return h(
                ElMenuItemGroup,
                {
                    title: title,
                },
                nodes,
            )
        }
        const createMenuTitle = (item: App.GlobalMenuOption) => {
            return [h(ElIcon, () => h(SvgIcon, { icon: item[props.props.icon] })), h('span', item[props.props.label])]
        }
        const generate = (options: App.GlobalMenuOption[]) => {
            const nodes: any[] = []
            const groups = grouping(options)
            for (const key in groups) {
                let items = groups[key]
                if (key === 'default') {
                    items.forEach((item) => {
                        if (item[props.props.children] && item[props.props.children].length > 0) {
                            nodes.push(createSubMenu(item))
                        } else {
                            nodes.push(createMenuItem(item))
                        }
                    })
                } else {
                    nodes.push(createMenuGroup(key, items))
                }
            }
            return nodes
        }
        const grouping = (options: App.GlobalMenuOption[]) => {
            let groups: Record<string, Array<any>> = { default: [] }
            options.forEach((item: App.GlobalMenuOption) => {
                const key = item[props.props.group]
                if (key) {
                    ;(groups[key] || (groups[key] = [])).push(item)
                } else {
                    groups.default.push(item)
                }
            })
            return groups
        }
        return () => createNavMenu()
    },
})
</script>

<style lang="scss" scoped></style>
