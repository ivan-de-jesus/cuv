import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Lightbox from 'vue-easy-lightbox'

Vue.use(Lightbox)

// ionic dependencies
import Ionic from "@ionic/vue"

import "@ionic/core/css/core.css"
import "@ionic/core/css/ionic.bundle.css"

// ion icons
import {
  person,
  people,
  paper,
  car,
  clipboard,
  add,
  call,
  trash,
  create,
  arrowForward,
  mail,
  eye,
  eyeOff,
  filing,
  locate,
  logoUsd,
  print,
  lock,
  exit,
  checkboxOutline,
  sync
} from "ionicons/icons";
import {
  addIcons
} from "ionicons";

addIcons({
  //ios
  "ios-person": person.ios,
  "ios-paper": paper.ios,
  "ios-car": car.ios,
  "ios-clipboard": clipboard.ios,
  "ios-add": add.ios,
  "ios-call": call.ios,
  "ios-trash": trash.ios,
  "ios-create": create.ios,
  "ios-arrow-forward": arrowForward.ios,
  "ios-mail": mail.ios,
  "ios-eye": eye.ios,
  "ios-eye-off": eyeOff.ios,
  "ios-filing": filing.ios,
  "ios-locate": locate.ios,
  "ios-logo-usd": logoUsd.ios,
  "ios-people": people.ios,
  "ios-print": print.ios,
  "ios-lock": lock.ios,
  "ios-exit": exit.ios,
  "ios-checkbox-outline": checkboxOutline.ios,
  "ios-sync": sync.ios,

  //md
  "md-person": person.md,
  "md-paper": paper.md,
  "md-car": car.md,
  "md-clipboard": clipboard.md,
  "md-add": add.md,
  "md-call": call.md,
  "md-trash": trash.md,
  "md-create": create.md,
  "md-arrow-forward": arrowForward.md,
  "md-mail": mail.md,
  "md-eye": eye.md,
  "md-eye-off": eyeOff.md,
  "md-filing": filing.md,
  "md-locate": locate.md,
  "md-logo-usd": logoUsd.md,
  "md-people": people.md,
  "md-print": print.md,
  "md-lock": lock.md,
  "md-exit": exit.md,
  "md-checkbox-outline": checkboxOutline.md,
  "md-sync": sync.md,

  "logo-usd": logoUsd,


});

// global styles 
import "./assets/css/index.css"
import "./assets/css/color.css"

Vue.use(Ionic);

// router noduplicate routes solution

const originalPush = router.push;
router.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')