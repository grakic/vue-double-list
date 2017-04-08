<template>
<div class="row double-list">
    <div class="col-md-6">
        <ul class="list-group header">
            <li class="list-group-item input">
               <input @input="resetMarkStart" type="text" v-model="filter" class="form-control" placeholder="Search">
            </li>
        </ul>
        <ul :class="['list-group list', {'empty': itemsCount == selectedCount}]">
            <li v-for="item in filteredItems" v-if="!item.selected"
                @click="toggleMark($event, item)"
                :class="['list-group-item', {'marked': item.marked}]">
                <slot name="item" :item="item.value">{{ item.value }}</slot>
            </li>
        </ul>
        <div class="text-center">
            <button @click="add" class="btn btn-simple" :disabled="itemsCount == selectedCount">
            Add {{ label }} <i class="ti-angle-double-right"></i></button>
        </div>
    </div>
    <div class="col-md-6">
        <ul class="list-group header">
            <li class="list-group-item input">
                <label v-if="selectedCount > 0">Selected {{ label }} ({{ selectedCount }})</label>
                <label v-else>No {{ label }} selected</label>
            </li>
        </ul>
        <ul :class="['list-group list', {'empty': selectedCount == 0}]">
            <li v-for="item in filteredItems" v-if="item.selected"
                @click="toggleMark($event, item)"
                :class="['list-group-item', {'marked': item.marked}]">
                <slot name="item" :item="item.value">{{ item.value }}</slot>
            </li>
        </ul>
        <div class="text-center">
            <button @click="remove" class="btn btn-simple" :disabled="selectedCount == 0">
            <i class="ti-angle-double-left"></i> Remove {{ label }}</button>
        </div>
    </div>
</div>
</template>


<style>
.double-list .list-group.list {
    overflow-y: auto;
    user-select: none;
}
.double-list .list-group.list.empty {
    background-color: #F3F2EE;
    border: 1px solid #ddd;
    border-radius: 4px;
}
.double-list .list-group.header {
    margin-bottom: 5px;
}
.double-list .list-group-item.input {
    padding: 0;
}
.double-list .list-group-item.input input {
    border: 0;
}
.double-list .list-group-item.input label {
    padding: 7px 15px;
}
.double-list .list-group-item.marked {
    background-color: #08C;
    color: white;
}
</style>


<script>
export default {
  props: ['label', 'items', 'itemFilterKey', 'itemIdKey', 'value'],
  mounted: function () {
    this.init()
  },
  activated: function () {
    let selected = this.selectedValues
    if (selected.length > 0) {
      this.$emit('input', selected)
    }
  },
  deactivated: function () {
    this.$emit('input', [])
  },
  watch: {
    items: function () {
      this.init()
    },
  },
  computed: {
    selectedValues: function () {
      return this.listItems.filter(function (item) {
        return item.selected
      }).map(function (item) {
        return item.value
      })
    },
    itemsCount: function () {
      return this.items.length
    },
    selectedCount: function () {
      return this.value.length
    },
    filteredItems: function () {
      if (this.filter.length) {
        return this.listItems.filter(function (item) {
          return this.filterMatch(item)
        }, this)
      } else {
        return this.listItems
      }
    },
  },
  methods: {
    init: function () {
      let newListItems = []
      let newListItemsByKey = {}
      let newMarkStart = null
      this.items.forEach(function (item, index) {
        let itemKey = (this.itemIdKey === undefined) ? item : item[this.itemIdKey]
        let oldListItemIndex = this.listItemsByKey[itemKey]
        let oldListItem = (oldListItemIndex !== undefined) ? this.listItems[oldListItemIndex] : false

        newListItems.push({
          value: item,
          index: index,
          marked: oldListItem && oldListItem.marked,
          selected: oldListItem && oldListItem.selected,
        })

        newListItemsByKey[itemKey] = index

        if (this.markStart !== null && newMarkStart === null &&
          oldListItem && oldListItem.index === this.markStart) {
          newMarkStart = index
        }
      }, this)

      // Emit change if selected items are removed
      let removedSelectedItems = []
      if (this.selectedCount > 0) {
        removedSelectedItems = this.selectedValues.filter(function (item) {
          let itemKey = (this.itemIdKey === undefined ? item : item[this.itemIdKey])
          return newListItemsByKey[itemKey] === undefined
        }, this)
      }

      this.markStart = newMarkStart
      this.listItems = newListItems
      this.listItemsByKey = newListItemsByKey

      if (removedSelectedItems.length > 0) {
        this.$emit('input', this.selectedValues)
      }
    },
    filterMatch: function (item) {
      return (this.itemFilterKey === undefined ? item.value : item.value[this.itemFilterKey]).toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
    },
    moveMarked: function (e, addToSelected) {
      e.preventDefault()
      let items = this.listItems.filter(function (item) {
        return item.marked && item.selected !== addToSelected
      })
      items.forEach(function (item) {
        item.selected = addToSelected
      })
      this.selectedCount += addToSelected ? items.length : -items.length
      this.$emit('input', this.selectedValues)
    },
    add: function (e) {
      this.moveMarked(e, true)
    },
    remove: function (e) {
      this.moveMarked(e, false)
    },
    toggleMark: function (e, item) {
      e = e || window.event

      if (!e.ctrlKey && !(e.shiftKey && this.markStart !== null)) {
        // clear all
        for (let i = 0; i < this.listItems.length; i++) {
          if (this.listItems[i].selected === item.selected) {
            this.listItems[i].marked = false
          }
        }
      }

      if (e.shiftKey && this.markStart !== null && this.markStart !== item.index) {
        // mark all from markStart that is not filtered
        let indexStart = Math.min(this.markStart, item.index + 1)
        let indexEnd = Math.max(this.markStart, item.index - 1)
        for (let i = indexStart; i <= indexEnd; i++) {
          if (this.listItems[i].selected === item.selected && this.filterMatch(this.listItems[i])) {
            this.listItems[i].marked = true
          }
        }
      }

      item.marked = !item.marked
      this.markStart = item.marked ? item.index : null
    },
    resetMarkStart: function (filter) {
      if (this.markStart !== null) {
        let item = this.listItems[this.markStart]
        if (!this.filterMatch(item)) {
          this.markStart = null
        }
      }
    },
  },
  data: function () {
    return {
      listItems: [],
      listItemsByKey: {},
      filter: '',
      markStart: null,
    }
  },
}
</script>
