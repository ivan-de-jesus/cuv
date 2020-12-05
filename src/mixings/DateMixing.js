export default {
    methods: {
        createStaticDate() {
            return `${new Date().getTime()}`;
        },

        parseStaticDate(dateOfString) {
            const dateOfNumber = Number.parseInt(dateOfString);
            return new Date(dateOfNumber);
        }
    }
}