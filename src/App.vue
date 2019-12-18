<template>
    <div id="app">
        <header class="header">
            <h1>YouPhoto</h1>
            <img class="plus-button" src="./assets/plus.svg" @click="showAddPhotoPopup = true" />
        </header>
        <main class="content">
            <div class="masorny">
                <div class="image-box" v-for="url in imageUrls" :key="url">
                    <img :src="url" class="image" />
                </div>
            </div>
        </main>
        <div class="popup" v-if="showAddPhotoPopup" ref="popup" @click="hideAddPhotoPopup">
            <form @submit.prevent="onSubmit" enctype="multipart/form-data" class="popup__box">
                <h2 class="popup__title">Carica la tua immagine</h2>
                <input class="popup__input" type="file" ref="file" @change="onSelect" />
                <button class="popup__btn">Carica</button>
                <p v-if="submitted" class="popup__result-message">{{ message }}</p>
            </form>
        </div>
        <footer class="footer">Diritti riservati ad Alberto Heissl</footer>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'app',
    data() {
        return {
            showAddPhotoPopup: false,
            file: '',
            message: '',
            submitted: false,
            imageUrls: []
        };
    },
    created() {
        this.loadUrls();
    },
    methods: {
        async loadUrls() {
            const result = await axios.get('/.netlify/functions/api/images/');
            const data = result.data.data;
            const urls = data.map(el => el.url);
            this.imageUrls = urls;
        },
        hideAddPhotoPopup(e) {
            if (e.target === e.currentTarget) {
                this.file = '';
                this.message = '';
                this.showAddPhotoPopup = false;
                this.submitted = false;
            }
        },
        onSelect() {
            const file = this.$refs.file.files[0];
            this.file = file;
        },
        async onSubmit() {
            if (this.file) {
                const formData = new FormData();
                formData.append('file', this.file);
                this.submitted = true;
                try {
                    await axios.post('/.netlify/functions/api/images/', formData);
                    this.message = 'Caricato';
                    this.loadUrls();
                } catch (error) {
                    this.message = 'Si è verificato un errore. Riprova più tardi';
                }
            }
        }
    }
};
</script>

<style lang="scss">
@import './assets/style/main';
* {
    box-sizing: inherit;
    margin: 0;
    padding: 0;
}
html {
    box-sizing: border-box;
}
</style>
