<template>
    <div class="container">
        <div class="list-edit line" key="_list_edit">
            <span class="list-label">
                名称:<input type="text" placeholder="名称..." v-model="editingName">
                增量:<input type="number" placeholder="数量..." v-model="editingValue">
            </span>
            <span class="list-button">
                <div class="icon-box list-shuffle" @click="shuffle()">
                    <IconShuffle class="icon"></IconShuffle>
                </div>
                <div class="icon-box list-edit" @click="add()">
                    <IconAdd class="icon"></IconAdd>
                </div>
            </span>
        </div>
        <div class="list-wrapper">
            <TransitionGroup tag="div" class="list" name="fade">
                <div v-for="item, index in list" :key="item.name" class="list-item line"
                    @dragenter="dragenter($event, index)" @dragover="dragover($event)" @dragstart="dragstart(index)"
                    draggable="true">
                    <span class="list-label">{{ item.name }}: {{ item.value }}</span>
                    <span class="list-button">
                        <div class="icon-box" @click="remove(index)">
                            <IconDelete class="icon"></IconDelete>
                        </div>
                        <div class="icon-box" @click="reduce(index)">
                            <IconMinus class="icon"></IconMinus>
                        </div>
                    </span>
                </div>
                <div v-if="list.length == 0" key="_list_empty_tip" class="list-item line list-empty">
                    <span class="list-label">列表为空</span>
                </div>
            </TransitionGroup>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { shuffle as $shuffle } from 'lodash'
import IconMinus from '../icon/IconMinus.vue';
import IconDelete from '../icon/IconDelete.vue';
import IconAdd from '../icon/IconAdd.vue';
import IconShuffle from '../icon/IconShuffle.vue';
const emits = defineEmits([
    'update:list'
])

const props = defineProps({
    list: {
        default: [
            { name: "列表1", value: 1 },
            { name: "列表2", value: 1 },
            { name: "列表3", value: 1 },
            { name: "列表4", value: 1 },
            { name: "列表5", value: 1 },
            { name: "列表6", value: 1 },
        ]
    }
})

const editingName = ref('Default');
const editingValue = ref(1);

const dragIndex = ref(null);
// const enterIndex = ref(null);

const shuffle = () => {
    emits("update:list", $shuffle(props.list))
};
const remove = (index) => {
    var list_ = props.list;
    list_.splice(index, 1);
    emits("update:list", list_);
}
const reduce = (index) => {
    var list_ = props.list;
    if (--list_[index].value)
        emits("update:list", list_);
    else {
        remove(index);
    }
}
const add = () => {
    if ((editingName.value != '') && editingValue.value != 0) {
        var list_ = props.list, index = 0;
        do {
            if (index != list_.length) {
                if (list_[index].name == editingName.value) {
                    list_[index].value += editingValue.value
                    break;
                }
            } else {
                list_[index] = {
                    name: editingName.value,
                    value: editingValue.value
                };
                emits("update:list", list_);
                break;
            }
        } while (index++ < list_.length);
        // editingName.value+="."
    }
}

const dragstart = (index) => {
    dragIndex.value = index;
};
const dragenter = (e, index) => {
    e.preventDefault();
    if (dragIndex.value !== index) {
        const moving = props.list[dragIndex.value];
        var list_ = props.list;
        list_.splice(dragIndex.value, 1);
        list_.splice(index, 0, moving);
        emits("update:list", list_);
        dragIndex.value = index;
    }
};
const dragover = (e) => {
    e.preventDefault();
};
</script>
<style lang="scss" scoped>
.container {
    --radius: 8px;
    padding: 3px;

    .list-edit {
        border-radius: var(--radius) var(--radius) 0 0;

        input {
            margin: .1em .2em;
            padding: .2em;
            padding-left: .5em;
            background-color: #fff;
            font-size: .8em;
            box-shadow: inset 1px 1px 2px 0 #eef5,
                inset -.5px -.5px 2px 0 #3335;
            border: none;
            height: 1em;
            line-height: 1em;

            max-width: 5em;
            border-radius: 8px;
        }
    }

    .list-wrapper {
        .list {
            transition: all .5s cubic-bezier(0.55, 0, 0.1, 1);
            position: relative;

            .list-item {
                transition: all .5s ease;
                border-top: 1px dashed black;

                &:last-child {
                    border-radius: 0 0 var(--radius) var(--radius);
                }
            }
        }
    }

    .line {
        display: -webkit-inline-flex;
        display: inline-flex;
        width: 100%;
        height: fit-content;
        padding: 0;
        padding-top: 4px;
        padding-bottom: 4px;
        align-items: center;
        background: #eeeef0;

        .list-label {
            display: inherit;
            width: max-content;
            margin-left: .2em;
            line-break: strict;
            font-size: 18px;
        }

        .list-button {
            position: relative;
            display: inline-flex;
            justify-self: flex-end;
            margin-left: auto;
        }

        .icon-box {
            user-select: none;
            width: 28px;
            height: 28px;
            padding: 2px;
            margin: 0 4px 0 0;

            .icon {
                width: 24px;
                height: 24px
            }
        }
    }
}

//.fade-enter-active,
//.fade-leave-active {}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform-origin: top center;
    transform: scaleY(0) scaleX(0) translateY(-50%);

    &.list-empty {
        transform-origin: bottom center;
        transform: scaleY(0) scaleX(0) translateY(50%);
    }
}

.fade-leave-active {
    position: absolute;
}
</style>
