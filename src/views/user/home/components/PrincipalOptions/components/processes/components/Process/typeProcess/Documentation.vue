<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="danger">
        <ion-buttons slot="start">
          <ion-button @click="dismiss(false)" :disabled="loading">
            <ion-icon slot="icon-only" name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>Documentación</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item>
          <ion-label text-wrap>Factura</ion-label>
          <ion-checkbox
            :disabled="disabled"
            @ionChange="documentation.invoice = !documentation.invoice"
            :checked="documentation.invoice"
          />
        </ion-item>

        <ion-item>
          <ion-label text-wrap>Facturas Subsecuentes</ion-label>
          <ion-checkbox
            :disabled="disabled"
            @ionChange="documentation.invoices = !documentation.invoices"
            :checked="documentation.invoices"
          />
        </ion-item>

        <ion-item>
          <ion-label text-wrap>Tarjeta de circulación</ion-label>
          <ion-checkbox
            :disabled="disabled"
            @ionChange="documentation.circulationCard = !documentation.circulationCard"
            :checked="documentation.circulationCard"
          />
        </ion-item>

        <ion-item>
          <ion-label text-wrap>Certificado de Verificación</ion-label>
          <ion-checkbox
            :disabled="disabled"
            @ionChange="documentation.certificate = !documentation.certificate"
            :checked="documentation.certificate"
          />
        </ion-item>

        <SelectItem
          multiple
          title="Tenencias"
          :values="documentation.holdings"
          :disabled="disabled"
          :generic-data="years"
          @onSelected="setAndUpdateHoldings"
        />

        <ion-item>
          <ion-label text-wrap>Copia de Identificación Oficial</ion-label>
          <ion-checkbox
            :disabled="disabled"
            @ionChange="documentation.identification = !documentation.identification"
            :checked="documentation.identification"
          />
        </ion-item>

        <ion-item>
          <ion-label text-wrap>Copia Comprobante de domicilio</ion-label>
          <ion-checkbox
            :disabled="disabled"
            @ionChange="documentation.proofAddress = !documentation.proofAddress"
            :checked="documentation.proofAddress"
          />
        </ion-item>

        <ion-item>
          <ion-label text-wrap>Copia RFC</ion-label>
          <ion-checkbox
            :disabled="disabled"
            @ionChange="documentation.copyRFC = !documentation.copyRFC"
            :checked="documentation.copyRFC"
          />
        </ion-item>

        <ion-item>
          <ion-label text-wrap>Autorización Electónica Facturación</ion-label>
          <ion-checkbox
            :disabled="disabled"
            @ionChange="documentation.authorizationBilling = !documentation.authorizationBilling"
            :checked="documentation.authorizationBilling"
          />
        </ion-item>

        <ion-item>
          <ion-label text-wrap position="floating">Número de contrato a liquidar</ion-label>
          <ion-input
            autocapitalize="on"
            :disabled="disabled"
            :value="documentation.number"
            @ionInput="documentation.number = $event.target.value"
          />
        </ion-item>

        <ion-item>
          <ion-label text-wrap position="floating">Unidad nueva o seminueva por comprar</ion-label>
          <ion-input
            autocapitalize="on"
            :disabled="disabled"
            :value="documentation.stateUnitToBuy"
            @ionInput="documentation.stateUnitToBuy = $event.target.value"
          />
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-footer>
      <ion-button
        expand="block"
        @click="dismiss(true)"
        color="danger"
        :disabled="loading || disabled"
      >HECHO</ion-button>
    </ion-footer>
  </ion-page>
</template>

<script>
import SelectItem from "../../../../../../../../../../components/util/SelectItem";
import firebase from "../../../../../../../../../../firebase/index";
import CONSTANTS from "../../../../../../../../../../components/util/CONSTANTS";

export default {
  name: "Documentation",

  components: { SelectItem },

  mixins: [CONSTANTS],

  props: ["documentation", "type", "disabled", "id"],

  data() {
    return {
      loading: false,

      years: [
        { text: "2012", value: "2012" },
        { text: "2013", value: "2013" },
        { text: "2014", value: "2014" },
        { text: "2015", value: "2015" },
        { text: "2016", value: "2016" },
        { text: "2017", value: "2017" },
        { text: "2018", value: "2018" },
        { text: "2019", value: "2019" },
        { text: "2020", value: "2020" },
        { text: "2021", value: "2021" },
      ],
    };
  },

  filters: {
    ArrayStringParse(arr) {
      let years = [];

      for (let i = 0; i < arr.length; i++) {
        if (i <= 2) {
          years.push(arr[i]);
        }
      }

      return years.toString();
    },
  },

  methods: {
    setAndUpdateHoldings({ items }) {
      this.documentation.holdings = items;
    },

    async dismiss(update) {
      this.loading = true;

      if (update) {
        try {
          await firebase.client
            .raw()
            .collection(this.VEHICLES_COLLECTION)
            .doc(this.id)
            .update({
              documentation: this.documentation,
            });
        } catch (e) {
          console.log(`ERROR ACTUALIZANDO DOCUMENTACIÓNDE VEHICULO ${e}`);
        }
      }

      await this.$ionic.modalController.dismiss({
        documentation: this.documentation,
        update,
      });

      this.loading = false;
    },
  },
};
</script>

<style scoped>
</style>