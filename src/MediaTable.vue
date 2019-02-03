<template>
  <div>
    <el-table
      :data="tableData.filter(data => !search || data.filename.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%">
      <el-table-column
        label="Title"
        prop="title">
      </el-table-column>
      <el-table-column
        label="Keywords"
        prop="keywords">
      </el-table-column>
      <el-table-column
        label="File Name"
        prop="basename">
      </el-table-column>
      <el-table-column
        label="Updated"
        prop="lastmod">
      </el-table-column>
      <el-table-column
        label="Progress">
          <template slot-scope="scope">
            <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.percentage"></el-progress>
          </template>
      </el-table-column>
      <el-table-column
        align="right">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="Type to search"/>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="info"
            plain
            @click="loadList(scope.row.filename, true)">Parent</el-button>
          <el-button
            size="mini"
            type="primary"
            plain
            v-show="scope.row.type == 'directory' && scope.row.type != '--'"
            @click="loadList(scope.row.filename)">Open</el-button>
            <el-button
              size="mini"
              type="success"
              plain
              v-show="scope.row.type != 'directory' && scope.row.type != '--'"
              @click="showPublishDialog(scope.$index)">Publish</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="Publish Video"
      :visible.sync="dialogFormVisible">
      <media-attributes
        :indexValue="currentIndex"
        :filenameValue="tableData[currentIndex].filename"
        :titleValue="tableData[currentIndex].title"
        :descriptionValue="tableData[currentIndex].description"
        :keywordsValue="tableData[currentIndex].keywords">
      </media-attributes>
    </el-dialog>
  </div>
</template>

<script>
  import { eventBus } from '@/main.js'
  import MediaAttributes from '@/MediaAttributes.vue'

  export default {
    props: ['tableData'],
    components: {
      MediaAttributes
    },
    data() {
      return {
        search: '',
        currentIndex: 0,
        dialogFormVisible: false,
        percentage: 0
      }
    },
    methods: {
      handlePublish(index, row) {
        console.log(index, row);
        const grpc_promise = require('grpc-promise');
        grpc_promise.promisifyAll(this.$RequestService)
        this.$fileData.setFilename(row.filename);
        this.$fileData.setBasename(row.basename);
        this.$fileData.setLastmod(row.lastmod);
        this.$fileData.setSize(row.size);
        this.$fileData.setType(row.type);
        this.$fileData.setMime(row.mime);
        this.$fileData.setTitle(row.title);
        this.$fileData.setDescription(row.description);
        this.$fileData.setKeywords(row.keywords);
        this.infoMessage("Uploading File: " + this.$fileData.getBasename());
        this.setPercentage(index, 40);
        var callList = this.$RequestService.requestUpload(this.$fileData)
          .then(res => {
            this.setPercentage(index, 80);
            console.log('Request response = ', res.getMessage());
            if(res.getMessage()) {
              this.setPercentage(index, 0);
              this.errorMessage(res.getMessage());
              console.log('Request response = ', res.getMessage());
            } else {
              this.setPercentage(index, 100);
              this.sucessMessage();
              console.log('Request response = ', res.getMessage());
            }
        })
        .catch(err => {
          this.setPercentage(index, 0);
          this.errorMessage(err);
          console.log('Request response = ', res.getMessage());
        });
      },
      loadList(fileName, isParent) {
        console.log("Hola: " + process.env.GRPC_HOST);
        if(fileName) {
          console.log("File Name " + fileName);
          if(isParent) {
            console.log("Before: " + fileName);
            fileName = fileName.substring(0, fileName.lastIndexOf("/"));
            fileName = fileName.substring(0, fileName.lastIndexOf("/"));
            console.log("After: " + fileName);
          }
        }
        const grpc_promise = require('grpc-promise');
        grpc_promise.promisifyAll(this.$RequestService);
        var this.$request = new ClientRequest();
        this.$request.setClientname("Web App");
        this.$request.setFilename(fileName);
        //
        var callList = this.$RequestService.requestFileList(this.$request)
          .then(res => {
          console.log('Client: Simple Message Received = ', res);
          this.setRowValues(res);
        })
        .catch(err => console.error(err));
      },
      setRowValues(receiveList) {
        this.clearArray();
        for(var i = 0; i < receiveList.getFilelistList().length; i++) {
          if(this.isValidFile(receiveList.getFilelistList()[i].getFilename())
            || receiveList.getFilelistList()[i].getType() == 'directory') {
            this.tableData.push({
              filename: receiveList.getFilelistList()[i].getFilename(),
              basename: receiveList.getFilelistList()[i].getBasename(),
              lastmod: receiveList.getFilelistList()[i].getLastmod(),
              size: receiveList.getFilelistList()[i].getSize(),
              type: receiveList.getFilelistList()[i].getType(),
              mime: receiveList.getFilelistList()[i].getMime(),
              title: (receiveList.getFilelistList()[i].getType() != 'directory'
                  ? receiveList.getFilelistList()[i].getTitle()
                  : 'Directory'),
              description: receiveList.getFilelistList()[i].getDescription(),
              keywords: receiveList.getFilelistList()[i].getKeywords()
            });
          }
        }
        if(this.tableData.length == 0) {
          this.tableData.push({
            filename: 'None',
            basename: 'None',
            lastmod: 'None',
            size: 'None',
            type: '--',
            mime: 'None',
            title: 'None',
            description: 'None',
            keywords: 'None'
          });
        }
      },
      setPercentage(index, value) {
        this.tableData[index].percentage = value;
      },
      isValidFile(fileName) {
        return fileName.includes(".flv")
          || fileName.includes(".mov")
          || fileName.includes(".mpeg")
          || fileName.includes(".webm")
      },
      clearArray() {
        this.tableData.splice(0, this.tableData.length);
      },
      showPublishDialog(index) {
        console.log("Index: " + index);
        this.currentIndex = index;
        this.dialogFormVisible = true;
      },
      sucessMessage(resultMessage) {
        this.$notify({
          title: 'Upload Success',
          message: resultMessage,
          type: 'success'
        });
      },
      warningMessage(resultMessage) {
        this.$notify({
          title: 'Warning',
          type: 'warning',
          message: resultMessage
        });
      },
      infoMessage(resultMessage) {
        this.$notify.info({
          title: 'Info',
          message: resultMessage
        });
      },
      errorMessage(resultMessage) {
        this.$notify.error({
          title: 'Error',
          message: resultMessage
        });
      }
    },
    created() {
      this.loadList();
      eventBus.$on('media-to-publish', (mediaAttribute)=> {
        console.log(mediaAttribute);
        this.dialogFormVisible = false;
        this.tableData[mediaAttribute.index].title = mediaAttribute.title;
        this.tableData[mediaAttribute.index].description = mediaAttribute.description;
        this.tableData[mediaAttribute.index].keywords = mediaAttribute.keywords;
        console.log("To Publish: " + this.tableData[mediaAttribute.index].keywords);
        this.handlePublish(mediaAttribute.index, this.tableData[mediaAttribute.index]);
      });
      eventBus.$on('media-to-cancel', ()=> {
        console.log("cancel");
        this.dialogFormVisible = false;
      });
    }
  }
</script>
