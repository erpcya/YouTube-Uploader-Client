<template>
  <el-form label-width="120px">
    <el-form-item label="Title">
      <el-input v-model="title"></el-input>
    </el-form-item>
    <el-form-item label="Description">
      <el-input type="textarea" v-model="description"></el-input>
    </el-form-item>
    <el-form-item label="Keywords">
      <el-input type="textarea" v-model="keywords"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="onCancel">Cancel</el-button>
      <el-button type="primary" @click="onSubmit">Publish Video</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import { eventBus } from './main.js'
  export default {
    props: ['filenameValue', 'indexValue', 'titleValue', 'descriptionValue', 'keywordsValue'],
    data() {
      return {
        index: 0,
        title: '',
        description: '',
        keywords: ''
      }
    },
    methods: {
      onSubmit() {
        console.log('Submit!');
        eventBus.publishMedia({
          index: this.indexValue,
          filename: this.filenameValue,
          title: this.title,
          description: this.description,
          keywords: this.keywords
        });
      },
      onCancel() {
        console.log('Cancel!');
        eventBus.cancelMedia();
      },
      created() {
        this.index = this.indexValue;
        this.filename = this.filenameValue;
        this.title = this.titleValue;
        this.description = this.descriptionValue;
        this.keywords = this.keywordsValue;
        console.log("Dentro: " + indexValue);
      }
    }
  }
</script>
