export default {
    email(mail) {
        if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return (true)
        }
        return (false)
    },
    number(value) {
        if (/^([0-9])*$/.test(value)) {
            return (true)
        }
        return (false)

    }

}