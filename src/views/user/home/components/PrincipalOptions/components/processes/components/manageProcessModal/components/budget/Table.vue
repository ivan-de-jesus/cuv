<template>
  <div v-if="type === 'create'">
    <table style="width:100%">
      <thead>
        <tr>
          <th>Concepto</th>
          <th>Monto</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr :key="`concept-${index}`" v-for="(concept,index) in concepts">
          <td>
            <input
              v-if="concepts[index]"
              style="width:100%;border:none;padding:10px;border-bottom:solid 1px #c1c1c1;"
              placeholder="Concepto"
              type="text"
              v-model="concepts[index].concept"
              @input="findEmptyRow"
              :disabled="disabled"
              @blur="checkConcepts"
            />
          </td>
          <td>

            <div class="flex-box">
              <ion-icon slot="start" color="danger" name="logo-usd" />
                <input
                        v-if="concepts[index]"
                        style="width:100%;border:none;padding:10px;border-bottom:solid 1px #c1c1c1;"
                        placeholder="Monto"
                        type="number"
                        v-model="concepts[index].amount"
                        @input="findEmptyRow"
                        :disabled="disabled"
                />
            </div>

          </td>
          <td>
            <ion-button
              v-if="!disabled && (concepts[index].concept || concepts[index].amount)"
              @click="deleteConcept(index)"
              fill="clear"
              color="danger"
            >
              <ion-icon slot="icon-only" name="trash"></ion-icon>
            </ion-button>
          </td>
        </tr>
        <tr>
          <td style="text-align:right; width:45%">
            <h1>Precio Total: </h1>
          </td>
          <td class="padding-1rem">
            <input
              style="border:none;padding:10px;width:100%;border-bottom:solid 1px #c1c1c1;"
              type="number"
              :value="total"
              disabled
            />
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>
    <!-- {{concepts}} -->
  </div>

  <div v-else-if="type === 'show'">
    <table style="width:100%">
      <thead>
      <tr>
        <th>Concepto</th>
        <th>Monto</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr :key="`concept-${index}`" v-for="(concept,index) in concepts.length -1">
        <td>
          <input
                  v-if="concepts[index]"
                  style="width:100%;border:none;padding:10px;border-bottom:solid 1px #c1c1c1;"
                  placeholder="Concepto"
                  type="text"
                  v-model="concepts[index].concept"
                  @input="findEmptyRow"
                  :disabled="disabled"
                  @blur="checkConcepts"
          />
        </td>
        <td>

          <div class="flex-box">
            <ion-icon slot="start" color="danger" name="logo-usd" />
            <input
                    v-if="concepts[index]"
                    style="width:100%;border:none;padding:10px;border-bottom:solid 1px #c1c1c1;"
                    placeholder="Monto"
                    type="number"
                    v-model="concepts[index].amount"
                    @input="findEmptyRow"
                    :disabled="disabled"
            />
          </div>

        </td>
        <td>
          <ion-button
                  v-if="!disabled && (concepts[index].concept || concepts[index].amount)"
                  @click="deleteConcept(index)"
                  fill="clear"
                  color="danger"
          >
            <ion-icon slot="icon-only" name="trash"></ion-icon>
          </ion-button>
        </td>
      </tr>
      <tr>
        <td style="text-align:right; width:45%">
          <h1>Total: </h1>
        </td>
        <td class="padding-1rem">
          <input
                  style="border:none;padding:10px;width:100%;border-bottom:solid 1px #c1c1c1;"
                  type="number"
                  :value="total"
                  disabled
          />
        </td>
        <td></td>
      </tr>
      </tbody>
    </table>
    <!-- {{concepts}} -->
  </div>

  <div v-else>
    <table style="width:100%">
      <thead>
      <tr>
        <th>Concepto</th>
        <th>Monto</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr :key="`concept-${index}`" v-for="(concept,index) in concepts">
        <td>
          <input
                  v-if="concepts[index]"
                  style="width:100%;border:none;padding:10px;border-bottom:solid 1px #c1c1c1;"
                  placeholder="Concepto"
                  type="text"
                  v-model="concepts[index].concept"
                  @input="findEmptyRow"
                  :disabled="disabled"
                  @blur="checkConcepts"
          />
        </td>
        <td>

          <div class="flex-box">
            <ion-icon slot="start" color="danger" name="logo-usd" />
            <input
                    v-if="concepts[index]"
                    style="width:100%;border:none;padding:10px;border-bottom:solid 1px #c1c1c1;"
                    placeholder="Monto"
                    type="number"
                    v-model="concepts[index].amount"
                    @input="findEmptyRow"
                    :disabled="disabled"
            />
          </div>

        </td>
        <td>
          <ion-button
                  v-if="!disabled && (concepts[index].concept || concepts[index].amount)"
                  @click="deleteConcept(index)"
                  fill="clear"
                  color="danger"
          >
            <ion-icon slot="icon-only" name="trash"></ion-icon>
          </ion-button>
        </td>
      </tr>
      <tr>
        <td style="text-align:right; width:45%">
          <h1>Total:</h1>
        </td>
        <td class="padding-1rem">
          <input
                  style="border:none;padding:10px;width:100%;border-bottom:solid 1px #c1c1c1;"
                  type="number"
                  :value="total"
                  disabled
          />
        </td>
        <td></td>
      </tr>
      </tbody>
    </table>
    <!-- {{concepts}} -->
  </div>
</template>

<script>
export default {
  props: {
    disabled: Boolean,
    conceptsProp: Array,
    type: String
  },
  data() {
    return {
      concepts: [{ concept: "", amount: '' }]
    };
  },
  computed: {
    total() {
      let total = 0;

      for (let i = 0; i <this.concepts.length -1 ; i++) {
        if (!isNaN(this.concepts[i].amount) || this.concepts[i].amount !== "") {
          total += parseFloat(this.concepts[i].amount);
        } else {
          total += 0;
        }
      }
      /*
      this.concepts.forEach(concept => {
        if (!isNaN(concept.amount) || concept.amount != "") {
          total += parseFloat(concept.amount);
        } else {
          total += 0;
        }
      });*/
      return total;
    }
  },
  methods: {
    checkConcepts(e) {
      console.log(this.concepts);

      if (e.target.value.length === 0) {
        this.$emit("hasErrors", true);
        return this.$ionic.alertController
          .create({
            header: "Recordatorio",
            message: "Por favor no dejes campos vacios",
            buttons: ["Aceptar"]
          })
          .then(a => a.present());
      } else {
        this.$emit("hasErrors", false);
      }
    },
/*
    parceNumber(e) {
      //e.target.value = "";
    },*/

    deleteConcept(index) {
      this.concepts.splice(index, 1);
    },

    findEmptyRow() {
      var findEmptyRow = false;

      this.concepts.forEach((row, index) => {
        if (row.concept == "" && row.amount == 0) {
          findEmptyRow++;
          if (findEmptyRow > 1) {
            this.concepts.splice(index, 1);
          }
        }
      });
      if (!findEmptyRow) {
        this.concepts.push({ concept: "", amount: '' });
      }
    }
  },
  watch: {
    total() {
      var concept = this.concepts;
      this.concepts = concept;
      this.$emit("ui-update", this.concepts);
    }
  },
  mounted() {
    if (this.conceptsProp !== undefined) {
      this.concepts = this.conceptsProp;
    }
  }
};
</script>

<style>
  .flex-box {
    padding-left: 1rem;
    display: flex;
    align-items: center;
  }

  .padding-1rem {
    padding-left: 1.9rem;
  }
</style>