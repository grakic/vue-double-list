# vue-double-list

[![npm](https://img.shields.io/npm/v/vue-double-list.svg) ![npm](https://img.shields.io/npm/dm/vue-double-list.svg)](https://www.npmjs.com/package/vue-double-list)
[![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)

Double List Selection Component for Vue.js

[![Double List Selection Component for Vue.js](https://img.youtube.com/vi/qkYWaaMLCBM/0.jpg)](https://www.youtube.com/watch?v=qkYWaaMLCBM)

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Example](#example)

# Installation

```
npm install --save vue-double-list
```

## Default import

```javascript
import Vue from 'vue'
import DoubleList from 'vue-double-list'

Vue.use(DoubleList)
```

**⚠️ A css file is included when importing the package. You may have to setup your bundler to embed the css in your page.**

## Browser

```html
<link rel="stylesheet" href="vue-double-list/dist/vue-double-list.css"/>

<script src="vue.js"></script>
<script src="vue-double-list/dist/vue-double-list.js"></script>
```

The plugin should be auto-installed. If not, you can install it manually with the instructions below:

```javascript
Vue.use(DoubleList)
```

# Usage

```html
<double-list label="movies" :items="listItems" v-model="selectedItems"></double-list>
```

# Props
| Name | Type | Default | Description |
| ---:| --- | ---| --- |
| items | Array | [] | List items for selection |
| label | String | "" | Name describing items, used in UI for buttons, labels etc. |
| itemFilterKey | String | undefined | If items are objects, filter list on this item property |
| itemIdKey | String | undefined | If items are objects, use this item property for object identity |
| value | Array | [] | List of selected items, updated on @input |

# Example

With plain list items:

```javascript
new Vue({
    el: '#vue',
    methods: {
        onInput: function() {
            console.log('Selection changed', this.selectedItems);
        }
    },
    data: {
        listItems: ['Back to the Future', 'The Future', 'Metropolis'],
        selectedItems: []
    }
})
```

With object list items, will keep selection by item's id when listItems is updated:

```javascript
new Vue({
    el: '#vue',
    data: {
        listItems: [
            {id: 1, title: 'Back to the Future'}, 
            {id: 2, title: 'The Future'},
            {id: 3, title: 'Metropolis'}
        ],
        selectedItems: []
    }
})
```

To customize list item rendering, use named slot:

```html
<double-list label="movies" :items="listItems" v-model="selectedItems">
<template slot="item" scope="props">
    {{ props.item.title }}
</template>
</double-list>
```

---

# Plugin Development

## Installation

The first time you create or clone your plugin, you need to install the default dependencies:

```
npm install
```

## Watch and compile

This will run webpack in watching mode and output the compiled files in the `dist` folder.

```
npm run dev
```

## Use it in another project

While developping, you can follow the install instructions of your plugin and link it into the project that uses it.

In the plugin folder:

```
npm link
```

In the other project folder:

```
npm link vue-double-list
```

This will install it in the dependencies as a symlink, so that it gets any modifications made to the plugin.

## Publish to npm

You may have to login to npm before, with `npm adduser`. The plugin will be built in production mode before getting published on npm.

```
npm publish
```

## Manual build

This will build the plugin into the `dist` folder in production mode.

```
npm run build
```

---

## License

[MIT](http://opensource.org/licenses/MIT)
