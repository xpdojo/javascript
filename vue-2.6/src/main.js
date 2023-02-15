/**
 * https://joshua1988.github.io/web-development/vuejs/v-model-usage/#v-model-%EB%AC%B8%EB%B2%95%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%B4%EC%84%9C-%ED%95%9C%EA%B5%AD%EC%96%B4%EB%A5%BC-%EC%B2%98%EB%A6%AC%ED%95%A0-%EC%88%9C-%EC%97%86%EC%9D%84%EA%B9%8C%EC%9A%94
 * IME 문제 해결방안
 */
// Vue.component(tagName, options): 전역 컴포넌트 등록
// https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
// W3C 규칙(모두 소문자, 하이픈 포함)을 지켜야 하는 건 아니지만 권장
Vue.component('ime', {
    template: `<input v-bind:value="value" v-on:input="updateInput">`,
    props: ['value'],
    methods: {
        updateInput(event) {
            this.$emit('input', event.target.value);
        }
    }
});

let app = new Vue({
    el: '#app',
    // https://v2.vuejs.org/v2/api/#data
    data: {
        person: {
            firstName: '',
            lastName: '',
            fullName: '',
            age: 20,
        },
        inputText: 'hello',
        type: 'text',
        link: 'https://www.youtube.com/',
        computedMessage: 'computed message',
    },
    components: {
        'ime': Vue.component('ime'),
    },
    // https://v2.vuejs.org/v2/api/#methods
    methods: {
        greeting: function (name) {
            return `Hello ${name}`;
        },
        // function 키워드를 생략할 수 있다.
        add() {
            return this.person.age++;
        },
        subtract() {
            return this.person.age--;
        },
        getYoutubeChannel(channel) {
            return this.link + channel;
        },
        updateInputText(event) {
            this.inputText = event.target.value;
        },

        testMethods() {
            // 함수 형태
            console.log(this.getMethodsDate());
        },
        testComputed() {
            // 함수 형태도 아님
            console.log(this.getComputedDate);
        },
        getMethodsDate() {
            // 호출된 시각 반환
            return new Date().toLocaleString();
        }
    },
    /**
     * https://v2.vuejs.org/v2/api/#computed
     * https://v2.vuejs.org/v2/guide/computed.html#Computed-Properties
     */
    computed: {
        getComputedDate() {
            // 맨처음 호출된 시각 캐싱 후 반환, 이후 호출 시 캐싱된 값을 반환
            return new Date().toLocaleString();
        }
    },
    /**
     * https://v2.vuejs.org/v2/api/#watch
     * https://v2.vuejs.org/v2/guide/computed.html#Watchers
     *
     * 대부분의 경우 computed 속성이 더 적합하지만 사용자가 만든 감시자가 필요한 경우가 있습니다.
     * 그래서 Vue는 watch 옵션을 통해 데이터 변경에 반응하는 보다 일반적인 방법을 제공합니다.
     * 이는 데이터 변경에 대한 응답으로 비동기식 또는 시간이 많이 소요되는 조작을 수행하려는 경우에 가장 유용합니다.
     */
    watch: {
        'person.firstName': function (newValue, oldValue) {
            console.log(newValue, oldValue);
            this.person.fullName = newValue + ' ' + this.person.lastName;
        },
        'person.lastName': function (newValue, oldValue) {
            console.log(newValue, oldValue);
            this.person.fullName = this.person.firstName + ' ' + newValue;
        }
    }
});
