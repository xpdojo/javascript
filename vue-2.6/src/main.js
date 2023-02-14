/**
 * https://joshua1988.github.io/web-development/vuejs/v-model-usage/#v-model-%EB%AC%B8%EB%B2%95%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%B4%EC%84%9C-%ED%95%9C%EA%B5%AD%EC%96%B4%EB%A5%BC-%EC%B2%98%EB%A6%AC%ED%95%A0-%EC%88%9C-%EC%97%86%EC%9D%84%EA%B9%8C%EC%9A%94
 * IME 문제 해결방안
 */
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
    data: {
        person: {
            name: 'markruler',
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
    computed: {
        getComputedDate() {
            // 맨처음 호출된 시각 캐싱 후 반환, 이후 호출 시 캐싱된 값을 반환
            return new Date().toLocaleString();
        }
    }
});
