<template>
    <div id="app" @click="turnOffEditingMode">
        <header class="header">
            <h1>YouPhoto</h1>
            <img class="plus-button" src="./assets/plus.svg" @click="showAddPhotoPopup = true" />
        </header>
        <main class="content">
            <p v-if="isLoading" class="loading-label">Caricamento...</p>
            <div class="masorny">
                <div class="image-box" v-for="url in imageUrls" :key="url">
                    <img
                        :src="url"
                        class="image"
                        v-long-press="1000"
                        @long-press-start="setEditingModeTimeout"
                        @long-press-stop="clearEditingModeTimeout"
                    />
                    <img
                        src="./assets/delete.svg"
                        @click="deleteImage(url)"
                        class="delete-button"
                        v-if="editingMode"
                    />
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
import axios from "axios";
const apiUrl = "/.netlify/functions/api/images/";

export default {
    name: "app",
    data() {
        return {
            showAddPhotoPopup: false,
            file: "",
            message: "",
            submitted: false,
            imageUrls: [],
            editingMode: false,
            editingModeTimeout: null,
            isDeleting: false,
            isLoading: true
        };
    },
    created() {
        this.loadUrls();
    },
    methods: {
        async loadUrls() {
            try {
                const result = await axios.get(apiUrl);
                const data = result.data.data;
                const urls = data.map(el => el.url);
                this.imageUrls = urls;
                this.isLoading = false;
            } catch (error) {
                alert(error);
            }
        },
        hideAddPhotoPopup(e) {
            if (e.target === e.currentTarget) {
                this.file = "";
                this.message = "";
                this.showAddPhotoPopup = false;
                this.submitted = false;
            }
        },
        onSelect() {
            const file = this.$refs.file.files[0];
            this.file = file;
        },
        async onSubmit() {
            if (this.file && !this.submitted) {
                const formData = new FormData();
                formData.append("file", this.file);
                this.submitted = true;
                try {
                    await axios.post(apiUrl, formData);
                    this.message = "Caricato";
                    this.loadUrls();
                } catch (error) {
                    this.message =
                        "Si è verificato un errore. Riprova più tardi";
                }
            }
        },
        setEditingModeTimeout() {
            this.editingModeTimeout = window.setTimeout(() => {
                this.editingMode = true;
            }, 1000);
        },
        clearEditingModeTimeout() {
            clearTimeout(this.editingModeTimeout);
            setTimeout(() => {
                this.editingModeTimeout = null;
            }, 200);
        },
        async deleteImage(url) {
            const filename = url.match(/file-\d+.\w+/);
            if (!this.isDeleting) {
                this.isDeleting = true;
                await axios.delete(apiUrl + filename);
                await this.loadUrls();
                this.isDeleting = false;
            }
        },
        turnOffEditingMode(e) {
            if (!e.target.classList.contains("delete-button")) {
                if (!this.editingModeTimeout && this.editingMode === true) {
                    this.editingMode = false;
                }
            }
        }
    }
};
</script>

<style lang="scss">
@import "./assets/style/main";
* {
    box-sizing: inherit;
    margin: 0;
    padding: 0;
}
html {
    box-sizing: border-box;
}
</style>
