# Vue.js v2.6 Demo

## Vue Instance Lifecycle

- [Diagram](https://v2.vuejs.org/v2/guide/instance.html#Lifecycle-Diagram)
  - beforeCreate
    - created
  - beforeMount
    - mounted
  - beforeUpdate
    - updated
  - beforeDestroy
    - destroyed

## 주요 키워드

### 양방향 바인딩 (Two-way Data Binding)

- [Vue 2.0 - 2 way data binding more in-depth analysis](https://derekzeng.me/articles/vue-2-0-2-way-data-binding-more-in-depth-analysis) - Coderek
  - [0.7KB로 Vue와 같은 반응형 시스템 만들기](https://ui.toast.com/weekly-pick/ko_20190531) - TOAST UI
- [Two-way Data Binding in React](https://sandroroth.com/blog/react-two-way-data-binding) - Sandro Roth
- [Vue.js 3 반응형 동작 원리 살펴보기](https://ui.toast.com/weekly-pick/ko_20210112) - TOAST UI

### 반응형 (Reactive)

- [SolidJS와 함께 되짚어보는 반응형 프로그래밍](https://ui.toast.com/posts/ko_20220331)

### 선언적 (Declarative)

- [사람들은 왜 선언형 UI에 열광할까?](https://medium.com/@kimdohun0104/%EC%82%AC%EB%9E%8C%EB%93%A4%EC%9D%80-%EC%99%9C-%EC%84%A0%EC%96%B8%ED%98%95-ui%EC%97%90-%EC%97%B4%EA%B4%91%ED%95%A0%EA%B9%8C-1440d03f4e49) - kimdohun0104

## 상태 관리

- Vuex

## SPA (Single Page Application)

- Vue Router

## Issue

### IME

[IME 입력이 포함되는 경우](https://vuejs.org/guide/essentials/forms.html#text)
v-model 대신 v-bind와 v-on을 사용한다.
혹은 [커스텀 컴포넌트](https://joshua1988.github.io/web-development/vuejs/v-model-usage/#v-model-%EB%AC%B8%EB%B2%95%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%B4%EC%84%9C-%ED%95%9C%EA%B5%AD%EC%96%B4%EB%A5%BC-%EC%B2%98%EB%A6%AC%ED%95%A0-%EC%88%9C-%EC%97%86%EC%9D%84%EA%B9%8C%EC%9A%94)를 생성한다.

> For languages that require an [IME](https://en.wikipedia.org/wiki/Input_method) (Chinese, Japanese, Korean etc.),
> you'll notice that `v-model` doesn't get updated during IME composition.
> If you want to respond to these updates as well, use your own `input` event listener and `value` binding instead of using `v-model`.

```html
<!--one-way-->
<input v-bind:type="type" :value="inputText"><br/>
<!--two-way-->
<input v-bind:type="type" :value="inputText" v-on:input="updateInput"><br/>
<input v-bind:type="type" v-model="inputText"><br/>
```
